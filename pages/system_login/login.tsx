// Autores: Jefersonramos, Joaogabriel, Matheusjorge

// Página responsável por fazer login do usuário no sistema

import React, { useState } from 'react'; 
import { useRouter } from 'next/router'; 


const LoginPage: React.FC = () => {

  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState(false);

  const router = useRouter(); 

   // Esta função é chamada quando o formulário é submetido, ou seja, clicar no botão Entrar
  const entrar = async (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    try {
      // Chamada para a API de Login
      const resposta = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json(); // Analisa a resposta JSON recebida do servidor.

      if (!resposta.ok) {
        setMensagem(dados.error || 'Erro ao tentar logar'); // Pega a mensagem de erro do servidor
        setErro(true);

      } else {

        // Função para guardar os dados de login na memória do navegador
        localStorage.setItem('numReferencias', JSON.stringify(dados.user.numReferencias)); // Armazena o numero de referências
        localStorage.setItem('bonusRecebido', JSON.stringify(dados.user.bonus)); // Armazena o bonus recebido pelo usuário

        setMensagem('Login realizado com sucesso!');
        setErro(false);

        setTimeout(() => router.push('../system_login/account'), 1500);
      }
    } catch (error) {
      setMensagem('Erro ao conectar com o servidor.');
      setErro(true);
    }
  };

  return (
    <div className="container">
      <div className="loginBox">
        <h2 className="title">Login</h2>
        <form onSubmit={entrar} id="loginForm">
          <div className="formGroup">
            <input
              type="email"
              placeholder="E-mail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>
          <div className="formGroup">
            <input
              type="password"
              placeholder="Senha"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="input"
            />
          </div>
          <button type="submit" className="button">Entrar</button>

          {mensagem && (
          <div className={`mensagem ${erro ? 'erro' : 'successo'}`}>
            {mensagem}
          </div>
          )}
        </form>
        <p className="registerText">
          Não tem conta? <a href="../system_login/onboard" className="link">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
