import React from 'react';

import BankList from '../components/BankList';
import BankChart from '../components/bankChart';
import { useToken } from '../contexts/TokenContext';

const Bank = () => {
  return (
    <div>
      <BankChart />
      <BankList />
    </div>
  );
};

export default Bank;
