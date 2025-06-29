import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'userId é obrigatório e deve ser uma string' });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId, 10) },
        select: {
          numReferences: true,
          bonus: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Erro no servidor' });
    }

  } else if (req.method === 'PUT') {
    const { userId, referredById, bonus } = req.body;

    if (!userId || referredById === undefined || bonus === undefined) {
      return res.status(400).json({ error: 'Campos insuficientes: userId, referredById e bonus são obrigatórios' });
    }

    try {
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

  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).end('Método não permitido');
  }
}
