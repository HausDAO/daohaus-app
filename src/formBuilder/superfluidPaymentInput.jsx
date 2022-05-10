import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Flex, FormHelperText, Spinner } from '@chakra-ui/react';
import { ethers } from 'ethers';

import ErrorList from './ErrorList';
import PaymentInput from './paymentInput';
import { useToken } from '../contexts/TokenContext';
import { useTX } from '../contexts/TXContext';
import { SUPERFLUID_MINION_TX as TX } from '../data/txLegos/superfluidMinionTx';
import { LOCAL_ABI } from '../utils/abi';
import { createContract } from '../utils/contract';
import { MINION_TYPES } from '../utils/proposalUtils';
import { fetchActiveStream, isSupertoken } from '../utils/superfluid';

const SuperfluidPaymentInput = props => {
  const { daochain } = useParams();
  const { currentDaoTokens } = useToken();
  const { submitTransaction } = useTX();
  const { localForm, minionType, setFormCondition } = props;
  const { setValue, watch, register } = localForm;
  const [fetchingSupertoken, setFetchingSupertoken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [txError /* setTxError */] = useState(null); // TODO: manage error
  const [hasSupertoken, setHasSupertoken] = useState(null);
  const [sTokenDeployed, setSTokenDeployed] = useState(false);

  const paymentToken = watch('paymentToken');
  const paymentRequested = watch('paymentRequested');
  const applicant = watch('applicant');
  const minion = watch('selectedMinion');
  const selectedSafeAddress = watch('selectedSafeAddress');

  useEffect(() => {
    register('activeStream');
    register('isSuperToken'); // TODO: remove this in favour of setFormCondition
    register('superTokenAddress');
    register('allowanceToApply');
  }, []);

  const checkSuperToken = async () => {
    const selectedToken = currentDaoTokens?.find(token => {
      return token.tokenAddress === paymentToken;
    });
    if (selectedToken) {
      setFetchingSupertoken(true);
      const {
        superTokenAddress,
        isNativeWrapper,
        isSuperToken,
      } = await isSupertoken(
        daochain,
        paymentToken,
        minionType === MINION_TYPES.SAFE,
      );
      setValue('isSuperToken', isSuperToken); // TODO: remove this
      setValue('superTokenAddress', superTokenAddress);
      setHasSupertoken(
        !!superTokenAddress &&
          superTokenAddress !== ethers.constants.AddressZero,
      );
      setFormCondition(
        isSuperToken
          ? 'withSupertoken'
          : isNativeWrapper
          ? 'withNativeWrapper'
          : 'upgradeToSupertoken',
      );
      setValue(
        'allowanceToApply',
        paymentRequested || ethers.constants.MaxUint256.toString(),
      );
      setFetchingSupertoken(false);
    }
  };

  const deploySupertoken = async () => {
    setLoading(true);
    const selectedToken = currentDaoTokens.find(token => {
      return token.tokenAddress === paymentToken;
    });
    const tokenContract = createContract({
      address: selectedToken.tokenAddress,
      abi: LOCAL_ABI.ERC_20,
      chainID: daochain,
    });
    const tokenName =
      selectedToken.tokenName || (await tokenContract.methods.name().call());
    await submitTransaction({
      tx: TX.SUPERFLUID_CREATE_SUPERTOKEN,
      args: [paymentToken, 2, `Super ${tokenName}`, `${selectedToken.symbol}x`],
      localValues: {
        paymentToken,
      },
      lifeCycleFns: {
        afterTx: () => setSTokenDeployed(true),
      },
    });
    await checkSuperToken();
    setLoading(false);
  };

  useEffect(() => {
    const checkActiveStream = async () => {
      const activeStream = await fetchActiveStream(
        daochain,
        minionType === MINION_TYPES.SAFE ? selectedSafeAddress : minion,
        paymentToken,
        applicant.toLowerCase(),
        minionType === MINION_TYPES.SAFE,
      );
      setValue('activeStream', activeStream);
    };

    if (paymentToken && applicant && minion) {
      checkActiveStream();
    }
  }, [applicant, paymentToken, minion]);

  useEffect(() => {
    if (paymentToken) {
      checkSuperToken();
    }
  }, [paymentRequested, paymentToken]);

  return (
    <>
      <PaymentInput {...props} />
      {fetchingSupertoken && <Spinner size='xs' />}
      {hasSupertoken === false && (
        <Flex mb={3}>
          <FormHelperText mt={0}>Token needs superpowers</FormHelperText>
          <Flex ml='auto'>
            <Button
              variant='outline'
              size='xs'
              onClick={deploySupertoken}
              disabled={loading || sTokenDeployed}
              isLoading={loading}
            >
              Create Supertoken
            </Button>
          </Flex>
          {txError && (
            <ErrorList
              singleError={{ message: 'API Error: Please check the logs' }}
            />
          )}
        </Flex>
      )}
    </>
  );
};
export default SuperfluidPaymentInput;
