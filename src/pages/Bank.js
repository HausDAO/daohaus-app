import React from 'react';

import BankList from '../components/BankList';
import Chart from '../components/chart';
import { useToken } from '../contexts/TokenContext';

const Bank = () => {
  const { currentDaoTokens } = useToken();
  return (
    <div>
      <Chart />
      <BankList tokens={currentDaoTokens} />
    </div>
  );
};

export default Bank;
