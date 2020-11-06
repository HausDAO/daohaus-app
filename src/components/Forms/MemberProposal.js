import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FormLabel,
  FormControl,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Icon,
  Stack,
  Select,
  Box,
  Text,
  Textarea,
} from '@chakra-ui/core';
import { utils } from 'web3';

import {
  useDao,
  useTheme,
  useTxProcessor,
  useUser,
} from '../../contexts/PokemolContext';
import { PrimaryButton } from '../../themes/components';

const MemberProposalForm = () => {
  const [loading, setLoading] = useState(false);

  const [theme] = useTheme();
  const [user] = useUser();
  const [dao] = useDao();
  const [txProcessor, updateTxProcessor] = useTxProcessor();

  const {
    handleSubmit,
    errors,
    register,
    // formState
  } = useForm();

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
        values.sharesRequested || '0',
        0,
        utils.toWei(values.tributeOffered.toString() || '0'),
        values.tributeToken || '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
        0,
        values.tributeToken || '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
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
              name='title'
              placeholder='Proposal Title'
              mb={5}
              ref={register()}
              color='white'
              focusBorderColor='lime'
            />
            <Textarea
              name='description'
              placeholder='Short Description'
              type='textarea'
              mb={5}
              h={10}
              ref={register()}
              color='white'
              focusBorderColor='lime'
            />
            <InputGroup>
              <InputLeftAddon>https://</InputLeftAddon>
              <Input placeholder='mylink.com' color='white' focusBorderColor='lime' />
            </InputGroup>
          </Stack>
        </Box>
        <Box w='48%'>
          <FormLabel
            htmlFor='name'
            color='white'
            fontFamily={theme.fonts.heading}
            textTransform='uppercase'
            fontSize='xs'
            fontWeight={700}
          >
            Shares Requested
          </FormLabel>
          <Input
            name='sharesRequested'
            placeholder='0'
            mb={5}
            ref={register()}
            color='white'
            focusBorderColor='lime'
          />
          <FormLabel
            htmlFor='tributeOffered'
            color='white'
            fontFamily={theme.fonts.heading}
            textTransform='uppercase'
            fontSize='xs'
            fontWeight={700}
          >
            Token Tributed
          </FormLabel>
          <InputGroup>
            <Input
              name='tributeOffered'
              placeholder='0'
              mb={5}
              ref={register()}
              color='white'
              focusBorderColor='lime'
            />
            <InputRightAddon>
              <Select
                name='tributeToken'
                defaultValue='0xd0a1e359811322d97991e03f863a0c30c2cf029c'
              >
                <option
                  default
                  value='0xd0a1e359811322d97991e03f863a0c30c2cf029c'
                >
                  WETH
                </option>
                <option value='dai'>Dai</option>
                <option value='usdc'>USDC</option>
              </Select>
            </InputRightAddon>
          </InputGroup>
          <Text
            color='white'
            fontFamily={theme.fonts.heading}
            textTransform='uppercase'
            fontSize='xs'
            fontWeight={700}
          >
            Additional Options <Icon name='small-add' color='white' />
          </Text>
        </Box>
      </FormControl>
      <Flex justify='flex-end' align='center' h='60px'>
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
}

export default MemberProposalForm;