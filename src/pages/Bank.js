import React from 'react';

import BankList from '../components/BankList';
import BankChart from '../components/bankChart';

const Bank = ({ overview, customTerms, currentDaoTokens }) => {
  return (
    <div>
      <BankChart
        currentDaoTokens={currentDaoTokens}
        overview={overview}
        customTerms={customTerms}
      />
      <BankList tokens={currentDaoTokens} />
    </div>
  );
};

export default Bank;
