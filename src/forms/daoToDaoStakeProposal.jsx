import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  FormLabel,
  FormControl,
  Flex,
  Input,
  Icon,
  Box,
  useToast,
  Link,
} from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { RiErrorWarningLine, RiLoginBoxLine } from 'react-icons/ri';

import { FaCopy } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

import TextBox from '../components/TextBox';
import molochAbi from '../contracts/molochV2.json';
import DetailsFields from './detailFields';
import { createHash, detailsToJSON } from '../utils/general';
import { useOverlay } from '../contexts/OverlayContext';
import DaoToDaoStakingTributeInput from './daoToDaoStakingTributeInput';
import { useDao } from '../contexts/DaoContext';
import { UBERHAUS_DATA } from '../utils/uberhaus';
import { valToDecimalString } from '../utils/tokenValue';
import { createPoll } from '../services/pollService';
import { useUser } from '../contexts/UserContext';
import { useTX } from '../contexts/TXContext';
import { createForumTopic } from '../utils/discourse';
import { useMetaData } from '../contexts/MetaDataContext';
import { UberHausMinionService } from '../services/uberHausMinionService';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { TokenService } from '../services/tokenService';

const StakeProposalForm = () => {
  const { injectedProvider, address } = useInjectedProvider();
  const { daoOverview } = useDao();
  const { daoMetaData } = useMetaData();
  const { daoid } = useParams();
  const { cachePoll, resolvePoll } = useUser();
  const toast = useToast();
  const { refreshDao } = useTX();
  const {
    setD2dProposalModal,
    errorToast,
    successToast,
    setTxInfoModal,
  } = useOverlay();
  const [loading, setLoading] = useState(false);
  const [currentError, setCurrentError] = useState(null);
  const [stakingToken, setStakingToken] = useState(null);

  const { handleSubmit, errors, register, setValue, getValues } = useForm();

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

  useEffect(() => {
    const setupTokenData = async () => {
      const uberHausMinionData = daoOverview.minions.find(
        minion =>
          minion.minionType === 'UberHaus minion' &&
          minion.uberHausAddress === UBERHAUS_DATA.ADDRESS,
      );

      const tokenBalance = await TokenService({
        chainID: UBERHAUS_DATA.NETWORK,
        tokenAddress: UBERHAUS_DATA.STAKING_TOKEN,
        is32: false,
      })('balanceOf')(uberHausMinionData.minionAddress);

      setStakingToken({
        label: UBERHAUS_DATA.STAKING_TOKEN_SYMBOL,
        symbol: UBERHAUS_DATA.STAKING_TOKEN_SYMBOL,
        value: UBERHAUS_DATA.STAKING_TOKEN,
        decimals: UBERHAUS_DATA.STAKING_TOKEN_DECIMALS,
        balance: tokenBalance,
        uberHausMinionData,
      });
    };
    if (daoOverview) {
      setupTokenData();
    }
  }, [daoOverview]);

  const onSubmit = async values => {
    setLoading(true);

    const now = (new Date().getTime() / 1000).toFixed();
    const uberHausMinionData = daoOverview.minions.find(
      minion =>
        minion.minionType === 'UberHaus minion' &&
        minion.uberHausAddress === UBERHAUS_DATA.ADDRESS,
    );
    const hash = createHash();
    const details = detailsToJSON({
      ...values,
      uberHaus: true,
      uberType: 'staking',
      hash,
    });

    const tributeOffered = values.tributeOffered
      ? valToDecimalString(
          values.tributeOffered,
          UBERHAUS_DATA.STAKING_TOKEN.toLowerCase(),
          daoOverview.tokenBalances,
        )
      : '0';

    const submitProposalArgs = [
      uberHausMinionData.minionAddress,
      values.sharesRequested || '0',
      '0',
      tributeOffered,
      UBERHAUS_DATA.STAKING_TOKEN,
      '0',
      daoOverview.depositToken.tokenAddress,
      details,
    ];

    const submitProposalAbiData = molochAbi.find(
      f => f.type === 'function' && f.name === 'submitProposal',
    );

    const hexData = injectedProvider.eth.abi.encodeFunctionCall(
      submitProposalAbiData,
      submitProposalArgs,
    );

    const args = [
      daoid,
      UBERHAUS_DATA.ADDRESS,
      UBERHAUS_DATA.STAKING_TOKEN,
      '0',
      hexData,
      details,
    ];

    console.log('args', args);

    try {
      const poll = createPoll({ action: 'uberHausProposeAction', cachePoll })({
        minionAddress: uberHausMinionData.minionAddress,
        createdAt: now,
        chainID: UBERHAUS_DATA.NETWORK,
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
              title: 'UberHAUS Membership Proposal Submitted to the DAO!',
            });
            refreshDao();
            resolvePoll(txHash);
            createForumTopic({
              chainID: UBERHAUS_DATA.NETWORK,
              daoID: daoid,
              afterTime: now,
              proposalType: 'UberHAUS Membership Proposal',
              values,
              daoid,
              daoMetaData,
            });
          },
        },
      });
      const onTxHash = () => {
        setD2dProposalModal(prevState => !prevState);
        setTxInfoModal(true);
      };
      await UberHausMinionService({
        web3: injectedProvider,
        uberHausMinion: uberHausMinionData.minionAddress,
        chainID: UBERHAUS_DATA.NETWORK,
      })('proposeAction')({
        args,
        address,
        poll,
        onTxHash,
      });
    } catch (err) {
      setLoading(false);
      setD2dProposalModal(prevState => !prevState);
      console.error('error: ', err);
      errorToast({
        title: 'There was an error.',
        desciption: err?.desciption || '',
      });
    }
  };

  const noBalance = !stakingToken || +stakingToken.balance <= 0;

  const copiedToast = () => {
    toast({
      title: 'Copied Address',
      position: 'top-right',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <>
      <Box mb={4}>
        <Box variant='heading' fontWeight={900}>
          Membership Requirements
        </Box>
        <Box>Minimum tribute: 500 HAUS</Box>
        <Box>Shares requested: Equal to tribute</Box>
        <Link
          href='https://daohaus.club/docs/uber_actions/'
          isExternal
          fontSize='xs'
        >
          More info
          <Icon
            as={RiLoginBoxLine}
            color='secondary.500'
            h='15px'
            w='15px'
            ml={2}
          />
        </Link>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl
          isInvalid={errors.name}
          display='flex'
          flexDirection='row'
          justifyContent='space-between'
          mb={5}
          flexWrap='wrap'
        >
          <Box w={['100%', null, '50%']} pr={[0, null, 5]}>
            <DetailsFields register={register} />
          </Box>
          <Box w={['100%', null, '50%']}>
            <TextBox as={FormLabel} size='xs' htmlFor='name' mb={2}>
              Shares Requested
            </TextBox>
            <Input
              name='sharesRequested'
              placeholder='0'
              mb={5}
              ref={register({
                required: {
                  value: true,
                  message: 'Requested shares are required for Member Proposals',
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'Requested shares must be a number',
                },
              })}
              color='white'
              focusBorderColor='secondary.500'
            />
            <DaoToDaoStakingTributeInput
              register={register}
              setValue={setValue}
              getValues={getValues}
              setError={setCurrentError}
              stakingToken={stakingToken}
            />
          </Box>
        </FormControl>
        <Flex justify='flex-end' align='center' h='60px'>
          {currentError && (
            <Box color='secondary.300' fontSize='m' mr={5}>
              <Icon as={RiErrorWarningLine} color='secondary.300' mr={2} />
              {currentError.message}
            </Box>
          )}

          {noBalance ? (
            <Box color='secondary.300' fontSize='m' mr={5}>
              <Icon as={RiErrorWarningLine} color='secondary.300' mr={2} />
              {`You can&apos;t stake into UberHAUS until your UberHAUS minion has
            a ${UBERHAUS_DATA.STAKING_TOKEN_SYMBOL} balance. Send 
            ${UBERHAUS_DATA.STAKING_TOKEN_SYMBOL} your minion&apos;s address:
            ${stakingToken?.uberHausMinionData.minionAddress}`}
              <CopyToClipboard
                text={stakingToken?.uberHausMinionData.minionAddress}
                onCopy={copiedToast}
              >
                <Icon
                  as={FaCopy}
                  color='secondary.300'
                  ml={2}
                  _hover={{ cursor: 'pointer' }}
                />
              </CopyToClipboard>
            </Box>
          ) : null}
          <Box>
            <Button
              type='submit'
              loadingText='Submitting'
              isLoading={loading}
              disabled={loading || noBalance}
            >
              Submit
            </Button>
          </Box>
        </Flex>
      </form>
    </>
  );
};

export default StakeProposalForm;
