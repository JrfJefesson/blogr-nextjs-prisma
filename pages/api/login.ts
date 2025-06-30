// Autores: Jefersonramos, Joaogabriel, Matheusjorge

// Página responsável por fazer toda a API da página LOGIN

import type { NextApiRequest, NextApiResponse } from 'next'; // Importa os tipos do Next.js para requisição e resposta de API.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // Cria uma nova instância do Prisma Client para usar nesta API.

// Define a estrutura dos dados que esta API pode retornar.
type Data = {
  error?: string;
  success?: boolean;
  bonus?: number;
  referencesCount?: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Pega o 'email' e 'password' enviados pelo corpo da requisição (do formulário do frontend).
  const { email, password } = req.body;

  if (!email || !password) { // Verifica se o e-mail e a senha não estão vazios. 
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios' }); // Se algum estiver vazio, retorna um status 400 (Bad Request) e uma mensagem de erro.
  }

  try {
    // Busca o Usuário no Banco de Dados pelo email
    const user = await prisma.user.findUnique({ 
      where: { email },
    });

    // Verifica se a senha e email estão corretos
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Esta combinação de e-mail e senha está incorreta!' });
    }

    // Aqui retornamos os dados extras para salvar no localStorage
    return res.status(200).json({
      success: true,
      bonus: user.bonus ?? 0,
      referencesCount: user.numReferences ?? 0,
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro no servidor' });
  }
}

/*
  O res.status() é uma parte fundamental de como as APIs (como a sua no Next.js)
  se comunicam com o frontend (seu navegador, sua página React).

  Esses números (como 200, 401, 405, 500) são chamados de Códigos de Status HTTP. 
  Eles são parte de um padrão global da internet (o protocolo HTTP) e servem para indicar 
  o resultado de uma requisição que foi feita ao servidor.
*/