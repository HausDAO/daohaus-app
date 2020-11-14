import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  FormLabel,
  FormControl,
  Flex,
  Input,
  Icon,
  Stack,
  Box,
  Textarea,
} from '@chakra-ui/core';
import { RiErrorWarningLine } from 'react-icons/ri';

import {
  useDao,
  useTxProcessor,
  useUser,
  useWeb3Connect,
} from '../../contexts/PokemolContext';
import { MinionService } from '../../utils/minion-service';

const MinionProposalForm = () => {
  const [loading, setLoading] = useState(false);
  const [user] = useUser();
  const [dao] = useDao();
  const [web3Connect] = useWeb3Connect();

  const [txProcessor, updateTxProcessor] = useTxProcessor();
  const [currentError, setCurrentError] = useState(null);
  console.log(dao);

  const {
    handleSubmit,
    errors,
    register,
    // formState
  } = useForm();

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
      txProcessor.setTx(txHash, user.username, details, true, false);
      txProcessor.forceUpdate = true;

      updateTxProcessor(txProcessor);
      // close model here
      // onClose();
      // setShowModal(null);
    }
    if (!txHash) {
      console.log('error: ', details);
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);

    console.log(values);
    const setupValues = {
      minion: values.minionContract,
      actionVlaue: 0,
    };
    const minionService = new MinionService(
      web3Connect.web3,
      user.username,
      setupValues,
    );

    try {
      minionService.propose(
        values.targetContract,
        setupValues.actionVlaue,
        values.dataValue,
        values.description,
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
      >
        <Box w='48%'>
          <FormLabel
            htmlFor='minionContract'
            color='white'
            fontFamily='heading'
            textTransform='uppercase'
            fontSize='xs'
            fontWeight={700}
          >
            Minion Contract
          </FormLabel>
          <Input
            name='minionContract'
            placeholder='0x36473d5bbfa176733898019245a603d915171b7c'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'Minion contract is required',
              },
            })}
            color='white'
            focusBorderColor='secondary.500'
          />
          <FormLabel
            htmlFor='targetContract'
            color='white'
            fontFamily='heading'
            textTransform='uppercase'
            fontSize='xs'
            fontWeight={700}
          >
            Target Contract
          </FormLabel>
          <Input
            name='targetContract'
            placeholder='0x'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'Target contract is required',
              },
            })}
            color='white'
            focusBorderColor='secondary.500'
          />
          <Stack spacing={4}>
            <Textarea
              name='description'
              placeholder='Short Description'
              type='textarea'
              mb={5}
              h={10}
              ref={register({
                required: {
                  value: true,
                  message: 'Description is required',
                },
              })}
              color='white'
              focusBorderColor='secondary.500'
            />
          </Stack>
        </Box>
        <Box w='48%'>
          <FormLabel
            htmlFor='dataValue'
            color='white'
            fontFamily='heading'
            textTransform='uppercase'
            fontSize='xs'
            fontWeight={700}
          >
            Data
          </FormLabel>
          <Textarea
            name='dataValue'
            placeholder='Raw Hex Data'
            type='textarea'
            mb={5}
            rows={10}
            ref={register({
              required: {
                value: true,
                message: 'Data hex value is required',
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

export default MinionProposalForm;
