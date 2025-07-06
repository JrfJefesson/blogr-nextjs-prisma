// Autores: Jefersonramos, Joaogabriel, Matheusjorge

// Página responsável por mostrar as referências e bonus de um usuário dentro do sistema

import React, { useEffect, useState } from 'react'; // Importação para usar o useEffect
import { useRouter } from 'next/router';
 
const AccountPage: React.FC = () => {

  const [numReferencias, setNumReferencias] = useState<number>(0);;
  const [bonus, setBonus] = useState<number>(0);;
  
  const [loading, setLoading] = useState<boolean>(true); // Controla o carregamento da páginas

  const router = useRouter();
  
  useEffect(() => { // Para carregar dados do local Storage
    
    // Variáveis para verificar se os dados foram recebidos
    const referencias = localStorage.getItem('numReferencias');
    const bonusRecebido = localStorage.getItem('bonusRecebido');

    if(referencias && bonusRecebido){ // Verifica se as variáveis possuem informações

      setNumReferencias(JSON.parse(referencias));
      setBonus(JSON.parse(bonusRecebido));

    }else{ // Se não existir

      router.push('../system_login/login');

    }

    setLoading(false); // Não conseguiu carregar a página
    
    
  }, []); // Array vazio significa que isso é feito apenas uma vez

  const sair = (evento: React.MouseEvent<HTMLButtonElement>) => {
    // É preciso excluir os dados de acesso do localStorage
    localStorage.removeItem('numReferencias');
    localStorage.removeItem('bonusRecebido');

    // Retorna a página de login
    router.push('../system_login/login');
  }

  if (loading) { // Se estiver carregando, mostrar essa tela na página
    return <div className="container">Carregando informações da conta...</div>;
  }


  return (
    <div className="container">
      <h2 className="title">Minha Conta</h2>
      <p>Bem-vindo(a)!</p>
      <p><strong>Referências:</strong> {numReferencias}</p>
      <p><strong>Bônus:</strong> R$ {bonus.toFixed(2)}</p>
      <button className="button" onClick={sair}>Sair</button>
    </div>
  );
};

export default AccountPage;
