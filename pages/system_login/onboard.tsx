// Autores: Jefersonramos, Joaogabriel, Matheusjorge

// Página responsável por fazer o cadastro do usuário no prisma

import { useState } from 'react'; // Importa o hook 'useState' do React.
import { useRouter } from 'next/router'; // Importa o hook 'useRouter' do Next.js.

const OnboardPage = () => {

  // Armazenamento dos dados e atualizações
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [refCode, setRefCode] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false); // Indica se a mensagem é um erro (true) ou sucesso (false).

  const router = useRouter(); // - 'router' é um objeto que contém métodos para navegação (ex: router.push) e informações sobre a rota atual.

  // Funções Manipuladoras de Eventos
  // Estas funções são chamadas automaticamente pelo React quando o usuário digita nos campos de formulário.
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handleRefCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => setRefCode(e.target.value);

  // Esta função é chamada quando o usuário clica no botão "Cadastrar"
  // 'async' indica que a função fará operações assíncronas (que levam tempo, como chamadas de rede).
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Impede o comportamento padrão do navegador de recarregar a página ao submeter o formulário.

    // Campo de analise da senha
    const senhaValida = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password); // Validação da senha, possuir ao menos 6 caracteres, 1 numero e 1 letra
    if (!senhaValida) {
      setMessage('A senha deve ter no mínimo 6 caracteres, incluindo uma letra e um número.');
      setIsError(true);
      return;
    }

    // Chamada para a API de Cadastro
    try {
      const res = await fetch('/api/onboard', { // 'fetch' é uma API nativa do navegador para fazer requisições de rede.
        method: 'POST', // Define o método HTTP como POST (usado para enviar dados).
        headers: { 'Content-Type': 'application/json' }, // Informa ao servidor que o corpo da requisição é JSON.
        body: JSON.stringify({ email, password, referralCode: refCode }) // Converte os dados do formul formulário para uma string JSON e envia no corpo da requisição.
      }); // - 'referralCode: refCode' mapeia o estado 'refCode' para a chave 'referralCode' que a API espera.

      const data = await res.json(); // Converte a resposta JSON do servidor para um objeto JavaScript.

      // Condições para exito ou não do cadastro
      if (!res.ok) { // verifica se ocorreu erro no cadastro
        setMessage(data.error || 'Erro no cadastro'); // Pega a mensagem de erro da resposta da API
        setIsError(true); 
      } else { // Se der sucesso no cadastro
        setMessage('Cadastro realizado com sucesso!');
        setIsError(false); 
        setTimeout(() => router.push('../system_login/login'), 2000); // Redireciona o usuário para a tela de login
      }
    } catch (err) { // Caso houver erro ao se conectar ao servidor
      setMessage('Erro ao conectar com o servidor.');
      setIsError(true);
    }
  };

  // HTML da página
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

export default OnboardPage; // Componente para exibir tela
