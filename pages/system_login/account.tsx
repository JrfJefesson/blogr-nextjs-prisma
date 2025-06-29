import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type AccountData = {
  numberOfReferrals: number;
  bonusReceived: number;
};

const AccountPage: React.FC = () => {
  const [data, setData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedRefs = localStorage.getItem('referencesCount');
    const storedBonus = localStorage.getItem('bonus');
    const storedUser = localStorage.getItem('reference'); // identificador do login

    if (!storedUser) {
      router.push('../system_login/login'); // Redireciona para login se não tiver usuário
      return;
    }

    setData({
      numberOfReferrals: storedRefs ? Number(storedRefs) : 0,
      bonusReceived: storedBonus ? Number(storedBonus) : 0,
    });

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('../system_login/login');
  };

  if (loading) return <p>Carregando...</p>;
  if (!data) return <p>Dados não disponíveis.</p>;

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
