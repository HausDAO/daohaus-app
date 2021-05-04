import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  FormLabel,
  FormControl,
  Flex,
  Icon,
  Box,
  Tooltip,
  Text,
} from '@chakra-ui/react';
import { RiErrorWarningLine, RiInformationLine } from 'react-icons/ri';
import { useParams } from 'react-router-dom';

import TextBox from '../components/TextBox';
import DetailsFields from './detailFields';
import AddressInput from './addressInput';
import { createHash, detailsToJSON } from '../utils/general';
import { useOverlay } from '../contexts/OverlayContext';
import DelegateMenu from '../components/delegateMenu';
import { UBERHAUS_DATA } from '../utils/uberhaus';
import { useUser } from '../contexts/UserContext';
import { createPoll } from '../services/pollService';
import { createForumTopic } from '../utils/discourse';
import { useMetaData } from '../contexts/MetaDataContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { UberHausMinionService } from '../services/uberHausMinionService';
import { useTX } from '../contexts/TXContext';
import TimeInput from '../components/timeInput';
import AddressAvatar from '../components/addressAvatar';

// TODO pass delegate to delegate menu
// TODO replace delegate with user avatar
// TODO sort out term limits, emergency recall

const DelegateProposalForm = ({
  daoMembers,
  uberMembers,
  uberHausMinion,
  uberDelegate,
}) => {
  const [loading, setLoading] = useState(false);
  const { daoid } = useParams();
  const { daoMetaData } = useMetaData();
  const { injectedProvider, address } = useInjectedProvider();
  const [timePeriod, setTimePeriod] = useState(0);
  const [currentError, setCurrentError] = useState(null);
  const {
    setD2dProposalModal,
    errorToast,
    successToast,
    setTxInfoModal,
  } = useOverlay();
  const { refreshDao } = useTX();
  const { cachePoll, resolvePoll } = useUser();
  const {
    handleSubmit,
    errors,
    register,
    setValue,
    watch,
    setError,
    clearErrors,
  } = useForm();

  const candidates = useMemo(() => {
    if (!daoMembers || !uberHausMinion || !uberMembers || !uberDelegate) {
      return null;
    }
    return daoMembers.filter(member => {
      const hasShares = +member.shares > 0;
      const isNotDelegate = member.memberAddress !== uberDelegate;
      const isNotUberMemberOrDelegate = uberMembers.every(
        uberMember =>
          member.memberAddress !== uberMember.memberAddress &&
          member.memberAddress !== uberMember.delegateKey,
      );
      if (hasShares && isNotDelegate && isNotUberMemberOrDelegate) {
        return member;
      }
      return null;
    });
  }, [daoMembers, uberHausMinion, uberMembers, uberDelegate]);

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

    const now = (new Date().getTime() / 1000).toFixed();

    const hash = createHash();
    const details = detailsToJSON({
      ...values,
      uberHaus: true,
      uberType: 'delegate',
      hash,
    });

    const args = [
      UBERHAUS_DATA.ADDRESS,
      values.memberApplicant,
      timePeriod?.toString() || values.delegateTerm,
      details,
    ];

    try {
      const poll = createPoll({
        action: 'uberHausNominateDelegate',
        cachePoll,
      })({
        minionAddress: uberHausMinion.minionAddress,
        chainID: UBERHAUS_DATA.NETWORK,
        newDelegateAddress: values?.memberApplicant,
        createdAt: now,
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
              proposalType: 'UberHAUS Delegate Proposal',
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
        uberHausMinion: uberHausMinion.minionAddress,
        chainID: UBERHAUS_DATA.NETWORK,
      })('nominateDelegate')({
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
        details: err?.message || '',
      });
    }
  };

  const delegateConditions = () => (
    <Flex direction='column'>
      <Text fontWeight='700' mb={2}>
        To be Eligable:
      </Text>
      <Text>- Delegate must be a share-holding member</Text>
      <Text>- Delegate must not be a member of UberHaus</Text>
      <Text>- Cannot be an UberHaus delegate in another Dao.</Text>
    </Flex>
  );

  const eligibleDelegatesLabel = () => (
    <Flex position='relative'>
      Eligible Delegates
      <Tooltip
        hasArrow
        bg='primary.500'
        placement='right'
        p={2}
        label={delegateConditions}
      >
        <Box>
          <Icon
            as={RiInformationLine}
            transform='translate(6px, -3px)'
            w={5}
            h={5}
          />
        </Box>
      </Tooltip>
    </Flex>
  );

  const timeInputLabel = () => (
    <TextBox as={FormLabel} size='xs' htmlFor='name' mb={2}>
      Delegation period length
    </TextBox>
  );

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
          <TextBox size='xs' htmlFor='name' mb={2}>
            Current Delegate
          </TextBox>
          <Flex w='100%' align='center' justify='space-between' pb={3} mb={2}>
            <AddressAvatar addr={uberDelegate} />
            <DelegateMenu />
          </Flex>
          <AddressInput
            name='delegate'
            formLabel={eligibleDelegatesLabel}
            register={register}
            setValue={setValue}
            watch={watch}
            memberOnly
            overrideData={candidates}
            memberOverride
          />
          <TimeInput
            errors={errors}
            register={register}
            setValue={setValue}
            watch={watch}
            setError={setError}
            clearErrors={clearErrors}
            inputName='delegateTerm'
            setTimePeriod={setTimePeriod}
            displayTotalSeconds={false}
            label={timeInputLabel}
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
        <Box>
          <Button
            type='submit'
            loadingText='Submitting'
            isLoading={loading}
            disabled={loading}
          >
            Submit
          </Button>
        </Box>
      </Flex>
    </form>
  );
};

export default DelegateProposalForm;
