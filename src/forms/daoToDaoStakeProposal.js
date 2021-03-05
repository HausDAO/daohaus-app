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
} from '@chakra-ui/react';
// import { utils } from 'web3';
import { RiErrorWarningLine } from 'react-icons/ri';

// import {
//   useDao,
//   useTxProcessor,
//   useUser,
//   useModals,
// } from '../../../contexts/PokemolContext';
import TextBox from '../components/TextBox';

import DetailsFields from './detailFields';
import { createHash, detailsToJSON } from '../utils/general';
import { useOverlay } from '../contexts/OverlayContext';
import DaoToDaoStakingTributeInput from './daoToDaoStakingTributeInput';
import { useDao } from '../contexts/DaoContext';
import {
  UBERHAUS_ADDRESS,
  UBERHAUS_STAKING_TOKEN,
  UBERHAUS_STAKING_TOKEN_SYMBOL,
} from '../utils/uberhaus';
import { useParams } from 'react-router-dom';
import { valToDecimalString } from '../utils/tokenValue';
import { createPoll } from '../services/pollService';
import { useUser } from '../contexts/UserContext';
import { useTX } from '../contexts/TXContext';
import { createForumTopic } from '../utils/discourse';
import { useMetaData } from '../contexts/MetaDataContext';
import { UberHausMinionService } from '../services/uberHausMinionService';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

const StakeProposalForm = () => {
  const { injectedProvider, address } = useInjectedProvider();
  const { daoOverview } = useDao();
  const { daoMetaData } = useMetaData;
  const { daoid, daochain } = useParams();
  const { cachePoll, resolvePoll } = useUser();
  const { refreshDao } = useTX();
  const {
    setD2dProposalModal,
    errorToast,
    successToast,
    setProposalModal,
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
    if (daoOverview) {
      const stakingTokenData = daoOverview.tokenBalances.find(
        (token) =>
          token.token.tokenAddress.toLowerCase() ===
          UBERHAUS_STAKING_TOKEN.toLowerCase(),
      );
      if (stakingTokenData) {
        setStakingToken({
          label: stakingTokenData.token.symbol || stakingTokenData.tokenAddress,
          symbol: stakingTokenData.token.symbol,
          value: stakingTokenData.token.tokenAddress,
          decimals: stakingTokenData.token.decimals,
          balance: stakingTokenData.tokenBalance,
        });
      }
    }
  }, [daoOverview]);

  const onSubmit = async (values) => {
    setLoading(true);

    const now = (new Date().getTime() / 1000).toFixed();
    const uberHausMinionData = daoOverview.minions.find(
      (minion) =>
        minion.minionType === 'UberHaus minion' &&
        minion.uberHausAddress === UBERHAUS_ADDRESS,
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
          UBERHAUS_STAKING_TOKEN,
          daoOverview.tokenBalances,
        )
      : '0';

    // address targetDao,
    // address actionTo,
    // address token,
    // uint256 actionValue,
    // bytes calldata actionData,
    // string calldata details
    const callData = '';

    const args = [
      daoid,
      UBERHAUS_ADDRESS,
      UBERHAUS_STAKING_TOKEN,
      tributeOffered,
      callData,
      details,
    ];

    try {
      const poll = createPoll({ action: 'uberHausProposeAction', cachePoll })({
        minionAddress: uberHausMinionData.minionAddress,
        createdAt: now,
        chainID: daochain,
        hash,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: `There was an error.`,
            });
            resolvePoll(txHash);
            console.error(`Could not find a matching proposal: ${error}`);
          },
          onSuccess: (txHash) => {
            successToast({
              title: 'UberHAUS Membership Proposal Submitted to the DAO!',
            });
            refreshDao();
            resolvePoll(txHash);
            createForumTopic({
              chainID: daochain,
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
        setProposalModal(false);
        setTxInfoModal(true);
      };
      await UberHausMinionService({
        web3: injectedProvider,
        uberHausMinion: uberHausMinionData.minionAddress,
        chainID: daochain,
      })('proposeAction')({ args, address, poll, onTxHash });
    } catch (err) {
      setLoading(false);
      setD2dProposalModal((prevState) => !prevState);
      console.error('error: ', err);
      errorToast({
        title: `There was an error.`,
      });
    }
  };

  return (
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

        {!stakingToken ? (
          <Box color='secondary.300' fontSize='m' mr={5}>
            <Icon as={RiErrorWarningLine} color='secondary.300' mr={2} />
            You can&apos;t staking into UberHAUS until{' '}
            {UBERHAUS_STAKING_TOKEN_SYMBOL} is whitelisted
          </Box>
        ) : null}
        <Box>
          <Button
            type='submit'
            loadingText='Submitting'
            isLoading={loading}
            disabled={loading || !stakingToken}
          >
            Submit
          </Button>
        </Box>
      </Flex>
    </form>
  );
};

export default StakeProposalForm;
