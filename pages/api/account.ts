// Autores: Jefersonramos, Joaogabriel, Matheusjorge

// Página responsável por fazer toda a API da página LOGIN

import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') { // Buscar Dados de Usuário
    const { userId } = req.query; // Extrai o 'userId' dos parâmetros de query da URL

    if (!userId || typeof userId !== 'string') { // Se 'userId' não for fornecido ou não for uma string, retorna um erro 400 (Bad Request).
      return res.status(400).json({ error: 'userId é obrigatório e deve ser uma string' });
    }

    try {
      // Busca o Usuário no Banco de Dados pelo ID.
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId, 10) },
        select: {
          numReferences: true,
          bonus: true,
        },
      });

      if (!user) { // Verifica se o usuário foi encontrado.
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.status(200).json(user); // Retorna um status 200 (OK) e o objeto 'user' (com numReferences e bonus).
    } catch (error) {
      return res.status(500).json({ error: 'Erro no servidor' }); // Se ocorrer um erro inesperado durante a comunicação com o banco, retorna um erro 500 (Internal Server Error).
    }

  } else if (req.method === 'PUT') { // Atualizar Dados de Usuário
    const { userId, referredById, bonus } = req.body; // Extrai os dados do corpo da requisição PUT (JSON enviado pelo frontend).

    // Verifica se os campos essenciais para a atualização estão presentes.
    if (!userId || referredById === undefined || bonus === undefined) {
      return res.status(400).json({ error: 'Campos insuficientes: userId, referredById e bonus são obrigatórios' });
    }

    try {
      // 'prisma.user.update' é o método do Prisma para atualizar um registro existente.
      const updatedUser = await prisma.user.update({ 
        where: { id: parseInt(userId, 10) },
        data: {
          referredById,
          bonus,
        },
      });

      return res.status(200).json({ message: 'Usuário atualizado', user: updatedUser });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar o usuário' });
    }

  } else { // Lógica para Métodos HTTP Não Permitidos
    res.setHeader('Allow', ['GET', 'PUT']); // Define o cabeçalho 'Allow' na resposta, informando ao cliente quais métodos são permitidos.
    return res.status(405).end('Método não permitido');
  }
}
