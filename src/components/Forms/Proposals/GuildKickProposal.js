import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, FormControl, Flex, Icon, Box } from '@chakra-ui/react';
import { RiErrorWarningLine } from 'react-icons/ri';
import { useLocation } from 'react-router-dom';

import {
  useDao,
  useModals,
  useTxProcessor,
  useUser,
} from '../../../contexts/PokemolContext';
import AddressInput from '../Shared/AddressInput';
import DetailsFields from '../Shared/DetailFields';
import { detailsToJSON } from '../../../utils/proposal-helper';

const GuildKickProposalForm = () => {
  const [loading, setLoading] = useState(false);
  const [user] = useUser();
  const [dao] = useDao();
  const [txProcessor, updateTxProcessor] = useTxProcessor();
  const [currentError, setCurrentError] = useState(null);
  const location = useLocation();
  const { closeModals } = useModals();

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

  const txCallBack = (txHash, details) => {
    console.log('txCallBack', txProcessor);
    if (txProcessor && txHash) {
      txProcessor.setTx(txHash, user.username, details);
      txProcessor.forceUpdate = true;

      updateTxProcessor({ ...txProcessor });
      // close model here
      closeModals();
    }
    if (!txHash) {
      console.log('error: ', details);
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);

    console.log(values);

    const details = detailsToJSON(values);

    try {
      dao.daoService.moloch.submitGuildKickProposal(
        values.memberApplicant,
        details,
        txCallBack,
      );
    } catch (err) {
      setLoading(false);
      console.log('error: ', err);
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
