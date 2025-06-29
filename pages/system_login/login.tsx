import React, { useState } from 'react';
import { useRouter } from 'next/router';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Erro ao tentar logar');
        setIsError(true);
      } else {
        // Salva dados no localStorage
        localStorage.setItem('reference', email);
        localStorage.setItem('bonus', String(data.bonus ?? 0));
        localStorage.setItem('referencesCount', String(data.referencesCount ?? 0));

        setMessage('Login realizado com sucesso!');
        setIsError(false);

        setTimeout(() => router.push('../system_login/account'), 1500);
      }
    } catch (error) {
      setMessage('Erro ao conectar com o servidor.');
      setIsError(true);
    }
  };

  return (
    <div className="container">
      <div className="loginBox">
        <h2 className="title">Login</h2>
        <form onSubmit={handleSubmit} id="loginForm">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </div>
          <button type="submit" className="button">Entrar</button>

          {message && (
            <div className={`message ${isError ? 'error' : 'success'}`}>
              {message}
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
