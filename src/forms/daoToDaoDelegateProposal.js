import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Button,
  FormLabel,
  FormControl,
  Flex,
  Input,
  Icon,
  Image,
  Box,
} from '@chakra-ui/react';
// import { utils } from 'web3';
import { RiErrorWarningLine } from 'react-icons/ri';
import DAOHaus from '../assets/img/Daohaus__Castle--Dark.svg';

// import {
//   useDao,
//   useTxProcessor,
//   useUser,
//   useModals,
// } from '../../../contexts/PokemolContext';
import TextBox from '../components/TextBox';
import DetailsFields from './detailFields';
import AddressInput from './addressInput';
import { createHash, detailsToJSON } from '../utils/general';
// import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import DelegateMenu from '../components/DelegateMenu';
import { useDao } from '../contexts/DaoContext';
import { UBERHAUS_ADDRESS } from '../utils/uberhaus';
import { useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { createPoll } from '../services/pollService';
import { createForumTopic } from '../utils/discourse';
import { useMetaData } from '../contexts/MetaDataContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { UberHausMinionService } from '../services/uberHausMinionService';
import { useTX } from '../contexts/TXContext';

// TODO pass delegate to delegate menu
// TODO replace delegate with user avatar
// TODO sort out term limits, emergency recall

const DelegateProposalForm = () => {
  const [loading, setLoading] = useState(false);
  const { daoid, daochain } = useParams();
  const { daoMetaData } = useMetaData();
  const { injectedProvider, address } = useInjectedProvider();
  const [currentError, setCurrentError] = useState(null);
  const {
    setD2dProposalModal,
    errorToast,
    successToast,
    setTxInfoModal,
  } = useOverlay();
  const { daoOverview } = useDao();
  const { refreshDao } = useTX();
  const { cachePoll, resolvePoll } = useUser();
  const { handleSubmit, errors, register, setValue, watch } = useForm();

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
      uberType: 'delegate',
      hash,
    });

    const args = [
      UBERHAUS_ADDRESS,
      values.memberApplicant,
      values.delegateTerm,
      details,
    ];

    try {
      const poll = createPoll({
        action: 'uberHausNominateDelegate',
        cachePoll,
      })({
        minionAddress: uberHausMinionData.minionAddress,
        chainID: daochain,
        newDelegateAddress: values?.memberApplicant,
        createdAt: now,
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
              proposalType: 'UberHAUS Delegate Proposal',
              values,
              daoid,
              daoMetaData,
            });
          },
        },
      });
      const onTxHash = () => {
        setD2dProposalModal((prevState) => !prevState);
        setTxInfoModal(true);
      };
      await UberHausMinionService({
        web3: injectedProvider,
        uberHausMinion: uberHausMinionData.minionAddress,
        chainID: daochain,
      })('nominateDelegate')({ args, address, poll, onTxHash });
    } catch (err) {
      setLoading(false);
      setD2dProposalModal((prevState) => !prevState);
      console.error('error: ', err);
      errorToast({
        title: `There was an error.`,
        details: err?.message || '',
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
          <TextBox size='xs' htmlFor='name' mb={2}>
            Current Delegate
          </TextBox>
          <Flex w='60%' align='center' justify='space-between' pb={3}>
            <Image src={DAOHaus} w='40px' h='40px' />
            <Box fontFamily='heading' fontWeight={900}>
              takashi.eth
            </Box>
            <DelegateMenu />
          </Flex>

          <AddressInput
            name='delegate'
            formLabel='Delegate Address'
            register={register}
            setValue={setValue}
            watch={watch}
            memberOnly={true}
          />
          <TextBox as={FormLabel} size='xs' htmlFor='name' mb={2}>
            Term
          </TextBox>
          <Input
            name='delegateTerm'
            placeholder='0'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'Delegate term is required for Delegate Proposals',
              },
              pattern: {
                value: /[0-9]/,
                message: 'Term must be a number in months',
              },
            })}
            color='white'
            focusBorderColor='secondary.500'
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
