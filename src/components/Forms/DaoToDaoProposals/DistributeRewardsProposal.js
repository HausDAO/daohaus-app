import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, FormControl, Flex, Icon, Box } from '@chakra-ui/react';
import { utils } from 'web3';
import { RiErrorWarningLine } from 'react-icons/ri';

import {
  useDao,
  useTxProcessor,
  useUser,
  useModals,
} from '../../../contexts/PokemolContext';
import TextBox from '../../Shared/TextBox';
import RageInput from '../Shared/RageInput';

import { detailsToJSON } from '../../../utils/proposal-helper';

const StakeProposalForm = () => {
  const [loading, setLoading] = useState(false);
  const [user] = useUser();
  const [dao] = useDao();
  const [txProcessor, updateTxProcessor] = useTxProcessor();
  const [currentError, setCurrentError] = useState(null);
  const { closeModals } = useModals();

  const { handleSubmit, errors, register, setValue } = useForm();

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

    const details = detailsToJSON(values);
    try {
      dao.daoService.moloch.submitProposal(
        values.sharesRequested ? values.sharesRequested?.toString() : '0',
        values.lootRequested ? values.lootRequested?.toString() : '0',
        values.tributeOffered
          ? utils.toWei(values.tributeOffered?.toString())
          : '0',
        values.tributeToken || dao.graphData.depositToken.tokenAddress,
        values.paymentRequested
          ? utils.toWei(values.paymentRequested?.toString())
          : '0',
        values.paymentToken || dao.graphData.depositToken.tokenAddress,
        details,
        values?.applicantHidden?.startsWith('0x')
          ? values.applicantHidden
          : values?.applicant
          ? values.applicant
          : user.username,
        txCallBack,
      );
    } catch (err) {
      setLoading(false);
      console.log('error: ', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex justify='space-between'>
        <Box>
          <TextBox colorScheme='secondary.500' size='xs'>
            DAO Rewards
          </TextBox>
          <TextBox variant='data' colorScheme='whiteAlpha.900' size='2xl'>
            420 $HAUS
          </TextBox>
        </Box>
        <Box>
          <TextBox colorScheme='secondary.500' size='xs'>
            Delegate Rewards
          </TextBox>
          <TextBox variant='data' colorScheme='whiteAlpha.900' size='2xl'>
            69 $HAUS
          </TextBox>
        </Box>
        <Box>
          <TextBox colorScheme='secondary.500' size='xs'>
            Pending Rewards
          </TextBox>
          <TextBox variant='data' colorScheme='whiteAlpha.900' size='2xl'>
            42.0 $HAUS
          </TextBox>
        </Box>
      </Flex>
      <FormControl
        isInvalid={errors.name}
        display='flex'
        flexDirection='column'
        w='50%'
        my={3}
      >
        <RageInput
          register={register}
          setValue={setValue}
          label='Claim DAO Rewards'
          type='daoRewards'
          max='42.0'
        />
        <RageInput
          register={register}
          setValue={setValue}
          label='Distro Delegate Rewards'
          type='delegateRewards'
          max='69'
        />
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

export default StakeProposalForm;
