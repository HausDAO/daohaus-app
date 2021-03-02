import React from 'react';
import StakeCard from '../components/stakeCard';

const ClanCard = () => {
  const handleConnect = () => {};
  const handleHarvest = () => {};
  const handleWithdraw = () => {};

  const earnings = 'Pending';

  return (
    <StakeCard
      title='Clan'
      description='Stake $Haus as a DAO'
      reward='Get 3x Rewards + Uber Governance'
      inputMax={false}
      inputLabel='DAO address'
      amtEarned={earnings}
      onHarvest={handleHarvest}
      onWithdraw={handleWithdraw}
      submitBtn={{ label: 'CONNECT', fn: handleConnect }}
    />
  );
};

export default ClanCard;
