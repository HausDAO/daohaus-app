import React from 'react';

import StakeCard from './stakeCard';

const ShogunCard = () => {
  const handleStake = () => {};
  const handleHarvest = () => {};
  const handleWithdraw = () => {};

  const earnings = '42.001';
  const walletHoldings = '314.51489';

  return (
    <StakeCard
      title='Shogun'
      description='Stake $HAUS/wxDai Uni LP'
      reward='Get 2x Rewards, Soft Signalling'
      inputLabel={`My Wallet: ${walletHoldings} $HAUS`}
      amtEarned={earnings}
      onHarvest={handleHarvest}
      onWithdraw={handleWithdraw}
      submitBtn={{ label: 'STAKE ON FARMHAUS', fn: handleStake }}
      inputMax
      farmHausRedirect
    />
  );
};

export default ShogunCard;
