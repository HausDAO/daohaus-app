import React from 'react';

import BankList from '../components/BankList';
import BankChart from '../components/bankChart';
import { useToken } from '../contexts/TokenContext';
import MainViewLayout from '../components/mainViewLayout';

const Bank = ({ customTerms }) => {
  const { currentDaoTokens } = useToken();

  return (
    <MainViewLayout header='bank' customTerms={customTerms}>
      <BankChart />
      <BankList tokens={currentDaoTokens} />
    </MainViewLayout>
  );
};

export default Bank;
