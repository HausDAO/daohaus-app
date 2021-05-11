import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, FormControl, Flex, Icon, Box, Text } from '@chakra-ui/react';
import { RiErrorWarningLine } from 'react-icons/ri';
import { useParams } from 'react-router-dom';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useTX } from '../contexts/TXContext';
import { useUser } from '../contexts/UserContext';
import {
  createHash,
  daoConnectedAndSameChain,
  detailsToJSON,
} from '../utils/general';
import { createPoll } from '../services/pollService';
import { MolochService } from '../services/molochService';
import { useDao } from '../contexts/DaoContext';
import { valToDecimalString } from '../utils/tokenValue';
import { chainByID } from '../utils/chain';
import CcoTributeInput from './ccoTributeInput';

const CcoLootGrabForm = ({
  roundData,
  currentContributionData,
  contributionClosed,
}) => {
  const {
    injectedProvider,
    address,
    requestWallet,
    injectedChain,
  } = useInjectedProvider();
  const { errorToast, successToast, setTxInfoModal } = useOverlay();
  const { daoOverview } = useDao();
  const { refreshDao } = useTX();
  const { cachePoll, resolvePoll } = useUser();
  const { daoid, daochain } = useParams();

  const [loading, setLoading] = useState(false);
  const [currentError, setCurrentError] = useState(null);
  const lootRatio = 1;

  const {
    handleSubmit,
    errors,
    register,
    setValue,
    setError,
    getValues,
    watch,
  } = useForm({ reValidateMode: 'onSubmit' });

  const currentTribute = watch('tributeOffered');

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const newE = Object.keys(errors)[0];
      setCurrentError({
        field: newE,
        ...errors[newE],
      });
    } else {
      setCurrentError(null);
    }
  }, [errors]);

  const onSubmit = async values => {
    setLoading(true);
    const hash = createHash();
    const details = detailsToJSON({
      title: 'CCO contribution!',
      cco: roundData.ccoId,
      hash,
    });
    const { tokenBalances, depositToken } = daoOverview;
    const tributeToken = roundData.ccoToken.tokenAddress;
    const paymentToken = depositToken.tokenAddress;
    const tributeOffered = values.tributeOffered
      ? valToDecimalString(values.tributeOffered, tributeToken, tokenBalances)
      : '0';
    const paymentRequested = '0';
    const applicant = address;
    const args = [
      applicant,
      values.sharesRequested || '0',
      Math.floor(values.tributeOffered * lootRatio || '0').toString(),
      tributeOffered,
      tributeToken,
      paymentRequested,
      paymentToken,
      details,
    ];

    try {
      const poll = createPoll({ action: 'submitProposalCco', cachePoll })({
        daoID: daoid,
        chainID: daochain,
        hash,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: 'There was an error.',
            });
            resolvePoll(txHash);
            console.error(`Could not find a matching proposal: ${error}`);
          },
          onSuccess: txHash => {
            successToast({
              title: 'Contribution Submitted!',
            });
            setValue('tributeOffered', '0');
            refreshDao();
            resolvePoll(txHash);
            setLoading(false);
          },
        },
      });
      const onTxHash = () => {
        setTxInfoModal(true);
      };
      await MolochService({
        web3: injectedProvider,
        daoAddress: daoid,
        chainID: daochain,
        version: daoOverview.version,
      })('submitProposal')({
        args,
        address,
        poll,
        onTxHash,
      });
    } catch (err) {
      setLoading(false);
      console.error('error: ', err);
      errorToast({
        title: 'There was an error.',
        description: err?.message || '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex justifyContent='space-between' my={3}>
        <Text fontSize='sm' color='blackAlpha.700' as='i'>
          {`${currentContributionData?.addressRemaining ||
            roundData.maxContribution}`}
          /
          {`${roundData.maxContribution} ${roundData.ccoToken.symbol} remaining`}
        </Text>
      </Flex>
      <FormControl
        isInvalid={errors.name}
        display='flex'
        flexDirection='row'
        justifyContent='flex-start'
        alignItems='baseline'
        mb={0}
        flexWrap='wrap'
      >
        <Box w={['100%', null, '70%']}>
          <CcoTributeInput
            register={register}
            setValue={setValue}
            getValues={getValues}
            setError={setError}
            roundData={roundData}
            contributionClosed={contributionClosed}
          />
        </Box>
        <Text fontSize='sm' color='whiteAlpha.700' as='i' ml={5}>
          {`will return -> ${+currentTribute * Number(roundData.ratio)} ${
            roundData.claimTokenSymbol
          } `}
        </Text>
      </FormControl>

      <Flex justifyContent='flex-end'>
        {currentError && (
          <Flex color='red.500' fontSize='m' mr={5} align='center'>
            <Icon as={RiErrorWarningLine} color='red.500' mr={2} />
            {currentError.message}
          </Flex>
        )}

        {daoConnectedAndSameChain(address, daochain, injectedChain?.chainId) ? (
          <Button
            type='submit'
            loadingText='Submitting'
            isLoading={loading}
            disabled={loading || contributionClosed}
            variant='primary'
          >
            Submit
          </Button>
        ) : (
          <Button
            onClick={requestWallet}
            isDisabled={injectedChain && daochain !== injectedChain?.chainId}
          >
            Connect
            {injectedChain && daochain !== injectedChain?.chainId
              ? `to ${chainByID(daochain).name}`
              : 'Wallet'}
          </Button>
        )}
      </Flex>
    </form>
  );
};

export default CcoLootGrabForm;
