import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Flex, FormHelperText, Spinner } from '@chakra-ui/react';
import { ethers } from 'ethers';

import ErrorList from './ErrorList';
import PaymentInput from './paymentInput';
import { useToken } from '../contexts/TokenContext';
import { useTX } from '../contexts/TXContext';
import { TX } from '../data/contractTX';
import { SF_ACTIVE_STREAMS } from '../graphQL/superfluid-queries';
import { LOCAL_ABI } from '../utils/abi';
import { graphQuery } from '../utils/apollo';
import { supportedChains } from '../utils/chain';
import { createContract } from '../utils/contract';
import { MINION_TYPES } from '../utils/proposalUtils';
import { isSupertoken } from '../utils/superfluid';

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

  const paymentToken = watch('paymentToken');
  const applicant = watch('applicant');
  const minion = watch('selectedMinion');

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
      const { superTokenAddress, isSuperToken } = await isSupertoken(
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
      setFormCondition(isSuperToken ? 'withSupertoken' : 'upgradeToSupertoken');
      // TODO: allowance value
      setValue('allowanceToApply', ethers.constants.MaxUint256.toString());
      setFetchingSupertoken(false);
    }
  };

  const deploySupertoken = async () => {
    setLoading(true);
    const selectedToken = currentDaoTokens.find(token => {
      return token.tokenAddress === paymentToken;
    });
    const tokenContract = createContract({
      address: selectedToken.tokenName,
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
    });
    await checkSuperToken();
    setLoading(false);
  };

  useEffect(() => {
    const checkActiveStream = async () => {
      const chainConfig = supportedChains[daochain];
      const accountStreams = await graphQuery({
        endpoint: chainConfig.superfluid.subgraph_url,
        query: SF_ACTIVE_STREAMS,
        variables: {
          ownerAddress: minion,
          recipientAddress: applicant.toLowerCase(),
        },
      });

      const activeStream = accountStreams?.account?.flowsOwned?.find(
        s => s.token?.underlyingAddress === paymentToken,
      );
      setValue('activeStream', activeStream);
    };

    if (paymentToken && applicant && minion) {
      checkActiveStream();
    }
    // TODO: is this still required?
    // if (paymentToken) {
    //   checkSuperToken();
    // }
  }, [applicant, paymentToken, minion]);

  useEffect(() => {
    if (paymentToken) {
      checkSuperToken();
    }
  }, [paymentToken]);

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
              disabled={loading}
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
