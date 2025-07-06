// Autores: Jefersonramos, Joaogabriel, Matheusjorge
// Página responsável por fazer o cadastro do usuário no prisma

import React, { useState } from 'react'; // Usado para armazenar os dados do front-end
import { useRouter } from 'next/router'; // Usado para redirecionamento

// Aqui irei receber, guardar e validar os dados digitados no FrontEnd
const OnboardPage = () => {
  // Variáveis para guardar as informações passadas no front-end
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [codigoReferencia, setCodigoReferencia] = useState<string>('');
  const [mensagem, setMensagem] = useState<string>('');
  const [erro, setErro] = useState(false);

  const router = useRouter(); // Permite navegar entre páginas

  // Função para cadastrar usuário
  const cadastrarUsuario = async (evento : React.FormEvent) => { // async signfica que é uma função assincrona, ou seja, requer tempo
    
    evento.preventDefault(); // Não permite o recarregamento da página

    // Agrupar as informações para o envio para o backend
    const dadosFormulario = {
      email : email,
      senha : senha,
      codigoReferencia : codigoReferencia
    }

    // Validação da senha
    if(dadosFormulario.senha.length < 6){ // Verifica se a senha tem 6 digitos
      setMensagem("A senha deve conter pelo menos 6 digitos");
      setErro(true);
      return;
    }
    else{ // Verifica se a senha oossui letras e números
        const possuiNumero = /\d/.test(dadosFormulario.senha); // Verifica se a senha possui pelo menos 1 numero
        const possuiLetra = /[a-zA-Z]/.test(dadosFormulario.senha); // Verifica se a senha possui ao menos 1 letra

        if(possuiNumero == true && possuiLetra == true){ // Se a senha possuir letras e números 
          setMensagem("");
          setErro(false);
        }
        else{ // Se a senha não possuir letras e números
          setMensagem("A senha deve conter pelo menos 1 número e 1 letra");
          setErro(true);
          return;
        }
    }

    // Chamada da API
    try{
      const resposta = await fetch('/api/onboard', { // await espera / fetch É assincrona, faz requisição
        method: 'POST', // Tipo de requisição
        headers: {
          'Content-Type': 'application/json', // Informa que o corpo da mensagem é um Json
        },
        body: JSON.stringify(dadosFormulario), // Converte o JSON para string
      }); 

      const dadosResposta = await resposta.json(); // Armazena a resposta da API

      if(resposta.ok){ // Se a nossa API retornar uma mensagem de sucesso VÁLIDA
        setMensagem(dadosResposta.mensagem || "Cadastro realizado com sucesso");
        setErro(false);
        setTimeout(() => { // Função para aguardar um tempo para redirecionar
          router.push('../system_login/login'); // Redireciona para a página de Login após o tempo de espera
        }, 2000);
      }else{// Se a nossa API retornar uma mensagem de erro
        setMensagem(dadosResposta.message || 'Erro desconhecido no cadastro. Tente novamente.');
        setErro(true);
      }

    }catch(error){ // Se houver algum erro 
      setMensagem('Não foi possível conectar ao servidor.')
      setErro(true);
    }


  }

  // HTML da página
  return (
    <div className="container">
      <h2>Cadastro</h2>
      <form id="onboardForm" onSubmit={cadastrarUsuario}>

        <div className="formGroup">
          <input
            type="email"
            name="email"
            id="email"
            value = {email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            required
            className="input"
          />
        </div>

        <div className="formGroup">
          <input
            type="password"
            name="password"
            id="password"
            value = {senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            required
            className="input"
          />
        </div>

        <div className="formGroup">
          <input
            type="text"
            name="refCode"
            id="refCode"
            value = {codigoReferencia}
            onChange={(e) => setCodigoReferencia(e.target.value)}
            placeholder="Código de referência (opcional)"
            maxLength={6}
            className="input"
          />
        </div>
        <button type="submit" className="button">Cadastrar</button>

        {mensagem && (
          <div className={`mensagem ${erro ? 'erro' : 'successo'}`}>
            {mensagem}
          </div>
        )}

      </form>
      <p>
        Já tem conta? <a href="/login" className="link">Fazer login</a>
      </p>
    </div>
  );
};

export default OnboardPage; // Componente para exibir tela