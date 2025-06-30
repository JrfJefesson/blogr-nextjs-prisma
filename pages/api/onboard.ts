// Autores: Jefersonramos, Joaogabriel, Matheusjorge

// Página responsável por fazer toda a API da página ONBOARD

// É através deste objeto 'prisma' que você interage com o banco de dados.
import { PrismaClient } from '@prisma/client';

// Importa os tipos 'NextApiRequest' e 'NextApiResponse' do Next.js.
// Eles ajudam a garantir que 'req' (requisição) e 'res' (resposta)
// sigam o formato que o Next.js espera para rotas de API.
import type { NextApiRequest, NextApiResponse } from 'next';


const prisma = new PrismaClient();

// Função que gera o código de referência
function gerarCodigoReferencia(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Caracteres permitidos no código
  let codigo = '';
  for (let i = 0; i < 6; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return codigo;
}

// Função Principal da Rota de API (Handler)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {// Garante que esta rota de API só responda a requisições do tipo POST.
    return res.status(405).json({ error: 'Método não permitido' });// Se o método não for POST, retorna um status 405 (Method Not Allowed) e uma mensagem de erro.
  }

  //Extração de Dados da Requisição
  const { email, password, referralCode } = req.body;

  // Verifica se o e-mail e a senha não estão vazios.
  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
  }

  try {
    // Verifica se o email já existe
    // 'prisma.user.findUnique' busca um usuário pela coluna 'email', que é @unique.
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já existe!' }); // Se um usuário com o mesmo e-mail for encontrado, retorna um erro 400.
    }

    // Valida o código de referência se fornecido
    let referredByUser = null;
    if (referralCode) {
      referredByUser = await prisma.user.findUnique({ // Tenta encontrar um usuário cujo 'referralCode' corresponda ao fornecido.
        where: { referralCode }
      });

      if (!referredByUser) { // Se o código de referência foi fornecido, mas não existe no banco
        return res.status(400).json({ error: 'Código de referência não existe!' });
      }
    }

    // Gera código de referência único para o novo usuário
    let newCode = '';
    let isUnique = false;
    while (!isUnique) {
      newCode = gerarCodigoReferencia();
      const existingCode = await prisma.user.findUnique({ where: { referralCode: newCode } }); // Verifica no banco se já existe um usuário com esse código
      if (!existingCode) isUnique = true; // Se não encontrou, o código é único
    }

    // Cria o novo usuário
    const newUser = await prisma.user.create({  // 'prisma.user.create' é o método do Prisma para inserir um novo registro na tabela 'users'.
      data: {
        email,
        password, 
        referralCode: newCode,
        referredBy: referredByUser ? { connect: { id: referredByUser.id } } : undefined // Conecta o novo usuário ao indicador, se 'referredByUser' foi encontrado.
      }
    });

    // Atualização do Bônus e Contador do Usuário que Indicou (Se houver)
    if (referredByUser) { // Se um usuário indicador foi encontrado
      await prisma.user.update({
        where: { id: referredByUser.id }, // Onde o ID do usuário é igual ao ID do indicador
        data: {
          numReferences: referredByUser.numReferences + 1,
          bonus: referredByUser.bonus + 5.0
        }
      });
    }
    
    return res.status(201).json({ success: true }); // Sucesso ao cadastrar usuário
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error); 
    return res.status(500).json({ error: 'Erro no servidor.' }); // Falha ao cadastrar usuário
  }
}
