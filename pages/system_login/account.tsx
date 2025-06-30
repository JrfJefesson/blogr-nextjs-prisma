// Autores: Jefersonramos, Joaogabriel, Matheusjorge

// Página responsável por mostrar as referências e bonus de um usuário dentro do sistema

import React, { useEffect, useState } from 'react'; // Importa React, o hook 'useEffect' (para efeitos colaterais) e 'useState' (para estado).
import { useRouter } from 'next/router';

// Define a "forma" do objeto 'data' que o componente vai manipular.
type AccountData = {
  numberOfReferrals: number;
  bonusReceived: number;
};

const AccountPage: React.FC = () => {

  // Declaração dos Estados do Componente
  const [data, setData] = useState<AccountData | null>(null); // 'data': Armazenará o objeto com 'numberOfReferrals' e 'bonusReceived', 'useState<AccountData | null>(null)': Inicializa 'data' como null
  const [loading, setLoading] = useState(true); // 'loading': Booleano que indica se os dados ainda estão sendo carregados (true) ou se já terminaram (false).


  const router = useRouter();

  // Este hook é usado para executar código "com efeitos colaterais"
  // como buscar dados ou interagir com APIs/armazenamento do navegador.
  useEffect(() => { 
    // Busca de Dados do LocalStorage
    const storedRefs = localStorage.getItem('referencesCount');
    const storedBonus = localStorage.getItem('bonus');
    const storedUser = localStorage.getItem('reference'); 

    // Se não houver um 'storedUser' (o e-mail do login) no localStorage,
    // significa que o usuário não está "logado" nesta sessão do navegador.
    if (!storedUser) {
      router.push('../system_login/login'); // Redireciona para login se não tiver usuário
      return;
    }

    //Converte os dados (que vêm como string do localStorage) para números e atualiza o estado 'data'.
    setData({
      numberOfReferrals: storedRefs ? Number(storedRefs) : 0,
      bonusReceived: storedBonus ? Number(storedBonus) : 0,
    });


    setLoading(false); // Define 'loading' como false, indicando que os dados foram carregados.
  }, [router]); // - '[router]' significa que o efeito será re-executado se o objeto 'router' mudar.

  // Função para Lidar com o Logout
  const handleLogout = () => {
    localStorage.clear(); // Limpa o LocalStorage
    router.push('../system_login/login'); // Redireciona o usuário de volta para a página de login.
  };

  if (loading) return <p>Carregando...</p>; // Exibe "Carregando..." enquanto os dados estão sendo buscados.
  if (!data) return <p>Dados não disponíveis.</p>; // Exibe "Dados não disponíveis." se 'data' for null após o carregamento (um caso de erro).

  return (
    <div className="container">
      <h2 className="title">Minha Conta</h2>
      <p>Bem-vindo(a)!</p>
      <p><strong>Referências:</strong> {data.numberOfReferrals}</p>
      <p><strong>Bônus:</strong> R$ {data.bonusReceived.toFixed(2)}</p>
      <button className="button" onClick={handleLogout}>Sair</button>
    </div>
  );
};

export default AccountPage;
