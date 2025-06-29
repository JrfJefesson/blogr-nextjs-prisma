// pages/api/onboard.ts

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

function gerarCodigoReferencia(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = '';
  for (let i = 0; i < 6; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return codigo;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { email, password, referralCode } = req.body;

  // Verificação simples
  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
  }

  try {
    // Verifica se o email já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já existe!' });
    }

    // Valida o código de referência se fornecido
    let referredByUser = null;
    if (referralCode) {
      referredByUser = await prisma.user.findUnique({
        where: { referralCode }
      });

      if (!referredByUser) {
        return res.status(400).json({ error: 'Código de referência não existe!' });
      }
    }

    // Gera código de referência único para o novo usuário
    let newCode = '';
    let isUnique = false;
    while (!isUnique) {
      newCode = gerarCodigoReferencia();
      const existingCode = await prisma.user.findUnique({ where: { referralCode: newCode } });
      if (!existingCode) isUnique = true;
    }

    // Cria o novo usuário
    const newUser = await prisma.user.create({
      data: {
        email,
        password, // ⚠️ depois podemos criptografar com bcrypt
        referralCode: newCode,
        referredBy: referredByUser ? { connect: { id: referredByUser.id } } : undefined
      }
    });

    // Atualiza o usuário que indicou (se houver)
    if (referredByUser) {
      await prisma.user.update({
        where: { id: referredByUser.id },
        data: {
          numReferences: referredByUser.numReferences + 1,
          bonus: referredByUser.bonus + 5.0
        }
      });
    }

    return res.status(201).json({ success: true });
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    return res.status(500).json({ error: 'Erro no servidor.' });
  }
}
