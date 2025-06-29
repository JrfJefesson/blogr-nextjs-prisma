import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

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
