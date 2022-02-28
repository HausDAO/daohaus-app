import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';

import { useOverlay } from '../contexts/OverlayContext';
import GenericFormDisplay from './genericFormDisplay';
import GenericInput from './genericInput';

import {
  fetchSpecificTokenData,
  getReadableBalance,
} from '../utils/tokenValue';
import { createContract } from '../utils/contract';
import { validate } from '../utils/validation';
import { LOCAL_ABI } from '../utils/abi';

const getStakingData = async ({
  stakingAddress,
  daochain,
  safeAddress,
  onError,
}) => {
  const stakingContract = createContract({
    address: stakingAddress,
    abi: LOCAL_ABI.SWAPR_STAKING,
    chainID: daochain,
  });

  try {
    const tokenAddress = await stakingContract.methods.stakableToken().call();
    const stakedTokensOf = await stakingContract.methods
      .stakedTokensOf(safeAddress)
      .call();

    return { tokenAddress, stakedTokensOf };
  } catch (error) {
    console.error(error);
    onError?.({
      title: 'Data fetching error',
      description: error?.message || 'Could not load staking contract data',
    });
  }
};

const getRewardsData = async ({
  stakingAddress,
  daochain,
  safeAddress,
  shouldUpdate,
  setStakingToken,
  setStakedAmt,
  onError,
  setFormValue,
}) => {
  try {
    const { tokenAddress, stakedTokensOf } = await getStakingData({
      stakingAddress,
      daochain,
      safeAddress,
    });

    const tokenData = await fetchSpecificTokenData(
      tokenAddress,
      { name: true, decimals: true, balance: safeAddress },
      daochain,
    );

    const readableBalance = getReadableBalance(
      {
        decimals: tokenData?.decimals,
        balance: tokenData?.balance,
      },
      4,
    );
    const readableStakedAmt = getReadableBalance(
      {
        decimals: tokenData?.decimals,
        balance: stakedTokensOf,
      },
      4,
    );

    if (tokenData && tokenAddress && shouldUpdate) {
      setStakingToken({ ...tokenData, tokenAddress, readableBalance });
      setFormValue('stakingTokenAddress', tokenAddress);
      setFormValue('stakingTokenDecimals', tokenData?.decimals);
    }
    if (stakedTokensOf) {
      setStakedAmt(readableStakedAmt);
    }
  } catch (error) {
    onError?.({
      title: 'Data fetching error',
      description: error?.message || 'Could not load staking contract data',
    });
  }
};

const Tutorial = props => {
  const { localForm } = props;
  const { watch, setValue } = localForm;
  const { errorToast } = useOverlay();
  const { daochain } = useParams();

  const [stakingToken, setStakingToken] = useState(null);
  const [stakedAmt, setStakedAmt] = useState(null);

  const stakingAddress = watch('stakingAddress');
  const safeAddress = watch('selectedSafeAddress');

  useEffect(() => {
    let shouldUpdate = true;
    const handleGetRewardsData = async () => {
      getRewardsData({
        stakingAddress,
        safeAddress,
        setStakingToken,
        setStakedAmt,
        shouldUpdate,
        daochain,
        setFormValue: setValue,
        onError: errorToast,
      });
    };
    if (validate.address(stakingAddress) && validate.address(safeAddress)) {
      handleGetRewardsData();
    }
    return () => (shouldUpdate = false);
  }, [stakingAddress, safeAddress]);

  return (
    <>
      <GenericInput {...props} label='Farm Rewards Address' />

      <Flex justifyContent='space-between'>
        <GenericFormDisplay
          localForm={localForm}
          label='Token:'
          name='tokenName'
          override={stakingToken?.name || '--'}
          expectType='any'
        />
        <GenericFormDisplay
          localForm={localForm}
          label='Amt Staked:'
          name='amtStaked'
          override={stakedAmt || '--'}
          expectType='any'
        />
        <GenericFormDisplay
          localForm={localForm}
          label='Minion Balance:'
          name='minionBalance'
          override={stakingToken?.readableBalance || '--'}
          expectType='any'
        />
      </Flex>
    </>
  );
};

export default Tutorial;
