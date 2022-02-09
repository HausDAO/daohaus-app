import { Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useOverlay } from '../contexts/OverlayContext';
import { LOCAL_ABI } from '../utils/abi';
import { createContract } from '../utils/contract';
import { fetchSpecificTokenData } from '../utils/tokenValue';
import { validate } from '../utils/validation';
import GenericFormDisplay from './genericFormDisplay';
import GenericInput from './genericInput';

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
  setSafeBalance,
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

    if (tokenData && tokenAddress && shouldUpdate) {
      setStakingToken({ ...tokenData, tokenAddress });
      setFormValue('stakingTokenAddress', tokenAddress);
    }
    if (stakedTokensOf) {
      setSafeBalance(stakedTokensOf);
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
  const [safeBalance, setSafeBalance] = useState(null);

  const stakingAddress = watch('stakingAddress');
  const safeAddress = watch('selectedSafeAddress');

  useEffect(() => {
    let shouldUpdate = true;
    const handleGetRewardsData = async () => {
      getRewardsData({
        stakingAddress,
        safeAddress,
        setStakingToken,
        setSafeBalance,
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

      <Flex>
        <GenericFormDisplay
          localForm={localForm}
          label='Token:'
          override={stakingToken?.name || '--'}
          expectType='any'
        />
        <GenericFormDisplay
          localForm={localForm}
          label='Safe Balance:'
          override={safeBalance || '--'}
          expectType='any'
        />
      </Flex>

      <GenericInput
        localForm={localForm}
        label='Stake Amount'
        disabled={!stakingToken}
        name='amount'
        expectType='number'
        helperText={stakingToken ? '' : 'Please input staking address'}
      />
    </>
  );
};

export default Tutorial;
