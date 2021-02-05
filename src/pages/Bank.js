import React from 'react';

import BankList from '../components/BankList';
import BankChart from '../components/bankChart';
import { useToken } from '../contexts/TokenContext';

const Bank = () => {
  const { currentDaoTokens } = useToken();
  return (
    <div>
      <BankChart />
      <BankList tokens={currentDaoTokens} />
    </div>
  );
};

export default Bank;
