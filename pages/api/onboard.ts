// Autores: Jefersonramos, Joaogabriel, Matheusjorge

// Página responsável por fazer toda a API da página ONBOARD

import type { NextApiRequest, NextApiResponse } from 'next'; // Importação da requisição e resposta da API
import { PrismaClient } from '@prisma/client'; // Faz a importação do nosso modelo prisma

const prisma = new PrismaClient(); // Faz a instância do prisma

// Define a função principal que processa a requisição e envia a resposta para esta API Route.
export default async function manipuladorRequisicao(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== 'POST') { // Verifica se o método da requisição é POST

    // Se o método não for POST, retornamos um status 405 (Method Not Allowed).
    return res.status(405).json({ message: 'Método não permitido. Use POST.' });
  }

  // Acessa os dados enviados no corpo da requisição.
  const { email, senha, codigoReferencia } = req.body;
  console.log('API: Dados recebidos do frontend ->', { email, senha, codigoReferencia }); // Adicione este log
  try{
    // Verifica se o email já existe
    const usuarioExistente = await prisma.user.findUnique({where : {email: email}}); // Busca na tabela email se o usuário já existe  
    

    // Verifica se o usuário existe
    if (usuarioExistente) {
      return res.status(409).json({ message: 'E-mail já existe!' }); // Se existir retorna a mensagem de que o usuário existe e fecha a API
    }

    // Variaveis para gerar e verificar se o código já existe no BD
    let novoCodigoReferencia : string;
    let codigoExiste : boolean;

    do{

      // Esta função gera um código de referência, com letrar e numeros, onde as letras fiquem maiusculas pelo toUpperCase
      novoCodigoReferencia = Math.random().toString(36).substring(2, 8).toUpperCase();

      // Verifica se o código já existe na tabela
      const codigo = await prisma.user.findUnique({where : {referralCode: novoCodigoReferencia}});

      // Se o código existir ele irá gerar um novo código
      if(codigo)
        codigoExiste = true;
      else // Se não existir ele irá deixar o códig gerado
        codigoExiste = false;

    }while(codigoExiste == true); // Repete enquanto o código de referência já existir


    // Cria a variável para armazenar o id do Referenciador, que começa com null e pode ser um número
    let idDoReferenciador: number | null = null;

    // Se existir algum código de referência
    if(codigoReferencia){
      
      const usuarioReferenciador = await prisma.user.findUnique({where : {referralCode : codigoReferencia}}) // Busca o referenciador atraves do código de referência
      
      // Verifica se o referenciador realmente existe
      if(usuarioReferenciador){
        idDoReferenciador = usuarioReferenciador.id;
      }else{ // Se o código de referência não existir
        return res.status(400).json({ message: 'Código de referência não existe!' })
      }

    }

    // Criação do novo usuário no nosso banco de dados
    await prisma.user.create({
      data: {
      email: email,
      password: senha, 
      referralCode: novoCodigoReferencia,
      referredById: idDoReferenciador, // Salva o ID de quem o referenciou
      },
    });

    // Se existir referenciador acrescentar +1 referenciado e + 5,00 de bonus
    if(idDoReferenciador != null){

        await prisma.user.update({where : {id : idDoReferenciador}, 
        data: {numReferences: {increment : 1}, bonus : {increment : 5.00}}});

    }

    // Retorna uma mensagem de sucesso
    return res.status(201).json({ message: 'Usuário cadastrado com sucesso!'});

  }catch(error){// Caso aconteça algum erro

    return res.status(500).json({ error: 'Erro no servidor.' });

  }finally { 

    await prisma.$disconnect(); // Fecha a conexão com o banco de dados
    
  }
}
