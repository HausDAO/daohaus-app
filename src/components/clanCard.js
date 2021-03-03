import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import StakeCard from '../components/stakeCard';
import { isEthAddress } from '../utils/general';
import { supportedChains } from '../utils/chain';

const ClanCard = () => {
  const { daochain } = useParams();
  // const history = useHistory();
  const [error, setError] = useState(null);
  const { register, getValues } = useForm();
  const handleConnect = () => {
    const address = getValues('daoAddress');
    if (!isEthAddress(address)) {
      setError('invalid address');
    } else {
      setError(null);
      // get the chain...
      // this will break on
      // history.push(`/dao/${daochain}/${address}`);
      // actually summon an uber mininon
    }
  };
  const handleHarvest = () => {};
  const handleWithdraw = () => {};

  const earnings = 'Pending';

  return (
    <StakeCard
      title='Clan'
      description='Stake $Haus as a DAO'
      reward='Get 3x Rewards + Uber Governance'
      inputMax={false}
      inputLabel={`${supportedChains[
        daochain
      ].network.toUpperCase()} DAO Address`}
      amtEarned={earnings}
      onHarvest={handleHarvest}
      onWithdraw={handleWithdraw}
      submitBtn={{ label: 'CONNECT', fn: handleConnect }}
      register={register}
      error={error}
    />
  );
};

export default ClanCard;
