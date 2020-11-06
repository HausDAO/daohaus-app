import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  FormLabel,
  FormControl,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Icon,
  Stack,
  Box,
  Text,
  Textarea,
} from '@chakra-ui/core';
import { utils } from 'web3';
import { RiErrorWarningLine } from 'react-icons/ri';

import {
  useDao,
  useTheme,
  useTxProcessor,
  useUser,
} from '../../contexts/PokemolContext';
import { PrimaryButton } from '../../themes/components';

const WhitelistProposalForm = () => {
  const [loading, setLoading] = useState(false);
  const [theme] = useTheme();
  const [user] = useUser();
  const [dao] = useDao();
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

  // TODO check tribute token < currentWallet.token.balance & unlock
  // TODO check payment token < dao.token.balance
  // TODO check link is a valid link

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

    const details = JSON.stringify({
      title: values.title,
      description: values.description,
      link: 'https://' + values.link,
    });

    try {
      dao.daoService.moloch.submitProposal(
        values.sharesRequested
          ? utils.toWei(values.sharesRequested?.toString())
          : '0',
        values.lootRequested
          ? utils.toWei(values.lootRequested?.toString())
          : '0',
        values.tributeOffered
          ? utils.toWei(values.tributeOffered?.toString())
          : '0',
        values.tributeToken,
        values.paymentRequested
          ? utils.toWei(values.paymentRequested?.toString())
          : '0',
        values.paymentToken || values.tributeToken,
        details,
        user.username,
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
            htmlFor='title'
            color='white'
            fontFamily={theme.fonts.heading}
            textTransform='uppercase'
            fontSize='xs'
            fontWeight={700}
          >
            Details
          </FormLabel>
          <Stack spacing={4}>
            <Input
              name='ticker'
              placeholder='Token Ticker'
              mb={5}
              ref={register({
                required: {
                  value: true,
                  message: 'Ticker is required',
                },
              })}
              color='white'
              focusBorderColor='secondary.500'
            />
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
            htmlFor='tokenAddress'
            color='white'
            fontFamily={theme.fonts.heading}
            textTransform='uppercase'
            fontSize='xs'
            fontWeight={700}
          >
            Token Address
          </FormLabel>
          <Input
            name='tokenAddress'
            placeholder='0x'
            mb={5}
            ref={register}
            color='white'
            focusBorderColor='secondary.500'
          />
          <InputGroup>
            <InputLeftAddon>https://</InputLeftAddon>
            <Input
              name='link'
              placeholder='daolink.club'
              color='white'
              focusBorderColor='secondary.500'
              ref={register({
                required: {
                  value: true,
                  message: 'Reference Link is required',
                },
              })}
            />
          </InputGroup>
        </Box>
      </FormControl>
      <Flex justify='flex-end' align='center' h='60px'>
        {currentError && (
          <Text color='secondary.300' fontSize='m' mr={5}>
            <Icon as={RiErrorWarningLine} color='secondary.300' mr={2} />
            {currentError.message}
          </Text>
        )}
        <Box>
          <PrimaryButton
            color='white'
            type='submit'
            loadingText='Submitting'
            isLoading={loading}
            disabled={loading}
          >
            Submit
          </PrimaryButton>
        </Box>
      </Flex>
    </form>
  );
};

export default WhitelistProposalForm;
