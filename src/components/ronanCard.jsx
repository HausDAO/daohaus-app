import React from 'react';

import StakeCard from './stakeCard';

const RonanCard = () => {
  const handleStake = () => {};
  const handleHarvest = () => {};
  const handleWithdraw = () => {};

  const earnings = '42.001';
  const walletHoldings = '314.51489';

  return (
    <StakeCard
      title='Ronan'
      description='Stake $Haus on your own'
      reward='Get 1x Rewards, Soft Signaling'
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

export default RonanCard;
