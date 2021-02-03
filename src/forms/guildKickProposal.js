import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Button,
  // FormLabel,
  FormControl,
  Flex,
  // Input,
  Icon,
  Box,
} from '@chakra-ui/react';
import { RiErrorWarningLine } from 'react-icons/ri';

import { useTX } from '../contexts/TXContext';
import { useUser } from '../contexts/UserContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { createHash, detailsToJSON } from '../utils/general';
import { createPoll } from '../services/pollService';
import { MolochService } from '../services/molochService';
import { useDao } from '../contexts/DaoContext';
import DetailsFields from './detailFields';
import AddressInput from './addressInput';
// import TextBox from '../components/TextBox';

const GuildKickProposalForm = () => {
  const [loading, setLoading] = useState(false);
  // const [user] = useUser();
  const { daochain, daoid } = useParams();
  const { address, injectedProvider } = useInjectedProvider();
  const [currentError, setCurrentError] = useState(null);
  const {
    errorToast,
    successToast,
    setProposalModal,
    setTxInfoModal,
  } = useOverlay();
  const { daoOverview } = useDao();
  const { refreshDao } = useTX();
  const { cachePoll, resolvePoll } = useUser();
  const location = useLocation();
  // const { closeModals } = useModals();

  const {
    handleSubmit,
    errors,
    register,
    setValue,
    watch,
    // formState
  } = useForm();

  useEffect(() => {
    // TODO: expand to work for any search param on all forms
    if (location.search && location.search.split('applicant=')[1]) {
      const applicantAddress = location.search.split('applicant=')[1];
      setValue('applicantHidden', applicantAddress);
      setValue('applicant', applicantAddress);
    }
    // eslint-disable-next-line
  }, [location]);

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

  // TODO check link is a valid link

  // dao.daoService.moloch.submitGuildKickProposal(
  //   values.memberApplicant,
  //   details,
  //   txCallBack,
  // );

  const onSubmit = async (values) => {
    setLoading(true);
    const hash = createHash();
    const details = detailsToJSON({ ...values, hash });
    const args = [values.memberApplicant, details];

    try {
      const poll = createPoll({ action: 'submitProposal', cachePoll })({
        daoID: daoid,
        chainID: daochain,
        hash,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: `There was an error.`,
            });
            resolvePoll(txHash);
            setLoading(false);
            console.error(`Could not find a matching proposal: ${error}`);
          },
          onSuccess: (txHash) => {
            successToast({
              title: 'Member Proposal Submitted to the Dao!',
            });
            refreshDao();
            resolvePoll(txHash);
            setLoading(false);
          },
        },
      });
      const onTxHash = () => {
        setProposalModal(false);
        setTxInfoModal(true);
      };
      MolochService({
        web3: injectedProvider,
        daoAddress: daoid,
        chainID: daochain,
        version: daoOverview.version,
      })('submitGuildKickProposal')({ args, address, poll, onTxHash });
    } catch (err) {
      setLoading(false);
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
          <AddressInput
            register={register}
            setValue={setValue}
            watch={watch}
            formLabel={'Member To Kick'}
            guildKick={true}
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

export default GuildKickProposalForm;
