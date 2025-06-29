// pages/onboard.tsx

import { useState } from 'react';
import { useRouter } from 'next/router';

const OnboardPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [refCode, setRefCode] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleRefCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => setRefCode(e.target.value);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validação simples da senha
    const senhaValida = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password);
    if (!senhaValida) {
      setMessage('A senha deve ter no mínimo 6 caracteres, incluindo uma letra e um número.');
      setIsError(true);
      return;
    }

    try {
      const res = await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, referralCode: refCode })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Erro no cadastro');
        setIsError(true);
      } else {
        setMessage('Cadastro realizado com sucesso!');
        setIsError(false);
        setTimeout(() => router.push('../system_login/login'), 2000);
      }
    } catch (err) {
      setMessage('Erro ao conectar com o servidor.');
      setIsError(true);
    }
  };

  return (
    <div className="container">
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit} id="onboardForm">
        <div className="formGroup">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="E-mail"
            required
            value={email}
            onChange={handleEmailChange}
            className="input"
          />
        </div>
        <div className="formGroup">
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Senha"
            required
            value={password}
            onChange={handlePasswordChange}
            className="input"
          />
        </div>
        <div className="formGroup">
          <input
            type="text"
            name="refCode"
            id="refCode"
            placeholder="Código de referência (opcional)"
            maxLength={6}
            value={refCode}
            onChange={handleRefCodeChange}
            className="input"
          />
        </div>
        <button type="submit" className="button">Cadastrar</button>

        {message && (
          <div className={`message ${isError ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </form>
      <p>
        Já tem conta? <a href="/login" className="link">Fazer login</a>
      </p>
    </div>
  );
};

export default OnboardPage;
