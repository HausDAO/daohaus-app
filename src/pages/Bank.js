import React from 'react';

import BankList from '../components/BankList';
import BankChart from '../components/bankChart';
import { useToken } from '../contexts/TokenContext';
import MainViewLayout from '../components/mainViewLayout';

const Bank = ({ overview, customTerms, currentDaoTokens }) => {
  return (
    <MainViewLayout header='bank' customTerms={customTerms}>
      <BankChart
        currentDaoTokens={currentDaoTokens}
        overview={overview}
        customTerms={customTerms}
      />
      <BankList tokens={currentDaoTokens} />
    </MainViewLayout>
  );
};

export default Bank;
