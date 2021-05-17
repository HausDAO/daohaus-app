import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, FormControl, Flex, Icon, Text } from '@chakra-ui/react';
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
  openContribution,
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
    // watch,
  } = useForm({ reValidateMode: 'onSubmit' });

  // watch not updating enough
  // const currentTribute = watch('tributeOffered');

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
    <Flex wrap='wrap' w='100%'>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <Flex wrap='wrap' w='100%'>
          <Flex w='100%' align='space-between' justify='space-between'>
            <FormControl
              isInvalid={errors.name}
              display='flex'
              flexDirection='row'
              justifyContent='space-between'
              alignItems='space-between'
              mb={0}
              flexWrap='wrap'
              pr={6}
            >
              <CcoTributeInput
                register={register}
                setValue={setValue}
                getValues={getValues}
                setError={setError}
                roundData={roundData}
                contributionClosed={contributionClosed || !openContribution}
                currentContributionData={currentContributionData}
              />
              <Flex justify='space-between'>
                <Text fontSize='sm' color='blackAlpha.700' as='i' w='100%'>
                  {`${currentContributionData?.addressRemaining} / ${roundData.maxContribution} ${roundData.ccoToken.symbol} max contribution remaining`}
                </Text>{' '}
                {/* <Text fontSize='sm' color='whiteAlpha.700' as='i' ml={5}>
                  {`will return -> ${+currentTribute *
                    Number(roundData.ratio)} ${roundData.claimTokenSymbol} `}
                </Text> */}
              </Flex>
            </FormControl>
            {currentError && (
              <Flex color='red.500' fontSize='m' mr={5} align='center'>
                <Icon as={RiErrorWarningLine} color='red.500' mr={2} />
                {currentError.message}
              </Flex>
            )}

            {daoConnectedAndSameChain(
              address,
              daochain,
              injectedChain?.chainId,
            ) ? (
              <Button
                type='submit'
                loadingText='Submitting'
                isLoading={loading}
                disabled={loading || contributionClosed || !openContribution}
                variant='primary'
                fontFamily='heading'
                letterSpacing='0.1em'
                textTransform='uppercase'
              >
                Contribute
              </Button>
            ) : (
              <Button
                onClick={requestWallet}
                isDisabled={
                  injectedChain && daochain !== injectedChain?.chainId
                }
                fontFamily='heading'
                letterSpacing='0.1em'
                textTransform='uppercase'
              >
                Connect
                {injectedChain && daochain !== injectedChain?.chainId
                  ? `to ${chainByID(daochain).name}`
                  : 'Wallet'}
              </Button>
            )}
          </Flex>
        </Flex>
      </form>
    </Flex>
  );
};

export default CcoLootGrabForm;
