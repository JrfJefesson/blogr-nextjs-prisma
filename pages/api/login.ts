// Autores: Jefersonramos, Joaogabriel, Matheusjorge

// Página responsável por fazer toda a API da página LOGIN

import type { NextApiRequest, NextApiResponse } from 'next'; // Importa os tipos do Next.js para requisição e resposta de API.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // Cria uma nova instância do Prisma Client para usar nesta API.


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Pega o 'email' e 'password' enviados pelo corpo da requisição (do formulário do frontend).
  const { email, senha } = req.body;

  if (!email || !senha) { // Verifica se o e-mail e a senha não estão vazios. 
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios' }); // Se algum estiver vazio, retorna um status 400 (Bad Request) e uma mensagem de erro.
  }

  try {
    // Busca o Usuário no Banco de Dados pelo email
    const user = await prisma.user.findUnique({ 
      where: { email },
    });

    // Verifica se a senha e email estão corretos
    if (!user || user.password !== senha) {
      return res.status(401).json({ error: 'Esta combinação de e-mail e senha está incorreta!' });
    }

    return res.status(200).json({
      message: 'Login bem-sucedido!', user: {numReferencias: user.numReferences , bonus : user.bonus}
    });

  } catch (error) {
    return res.status(500).json({ error: 'Erro no servidor' });
  }finally { 

    await prisma.$disconnect(); // Fecha a conexão com o banco de dados
    
  }

}