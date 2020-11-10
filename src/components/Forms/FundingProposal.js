import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  FormLabel,
  FormControl,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Icon,
  Stack,
  Box,
  Textarea,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/core';
import { utils } from 'web3';
import { RiAddFill, RiErrorWarningLine } from 'react-icons/ri';

import { useDao, useTxProcessor, useUser } from '../../contexts/PokemolContext';

import TributeInput from './TributeInput';
import PaymentInput from './PaymentInput';
import AddressInput from './AddressInput';

const FundingProposalForm = () => {
  const [loading, setLoading] = useState(false);
  const [showShares, setShowShares] = useState(false);
  const [showLoot, setShowLoot] = useState(false);
  const [showTribute, setShowTribute] = useState(false);
  const [user] = useUser();
  const [dao] = useDao();
  const [txProcessor, updateTxProcessor] = useTxProcessor();
  const [currentError, setCurrentError] = useState(null);

  const {
    handleSubmit,
    errors,
    register,
    reset,
    setValue,
    getValues,
    watch,
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
      setLoading(false);
      reset();
    }
    if (!txHash) {
      console.log('error: ', details);
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);

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
        values.tributeToken || '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
        values.paymentRequested
          ? utils.toWei(values.paymentRequested?.toString())
          : '0',
        values.paymentToken ||
          values.tributeToken ||
          '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
        details,
        values?.applicantHidden.startsWith('0x')
          ? values.applicantHidden
          : values.applicant,
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
            fontFamily='heading'
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
              ref={register({
                required: {
                  value: true,
                  message: 'Title is required',
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
          </Stack>
        </Box>
        <Box w='48%'>
          <AddressInput register={register} setValue={setValue} watch={watch} />
          <PaymentInput
            register={register}
            setValue={setValue}
            getValues={getValues}
            errors={errors}
          />

          {showShares && (
            <>
              <FormLabel
                htmlFor='name'
                color='white'
                fontFamily='heading'
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
                ref={register({
                  required: {
                    value: true,
                    message:
                      'Requested shares are required for Member Proposals',
                  },
                  pattern: {
                    value: /[0-9]/,
                    message: 'Requested shares must be a number',
                  },
                })}
                color='white'
                focusBorderColor='secondary.500'
              />
            </>
          )}
          {showLoot && (
            <>
              <FormLabel
                htmlFor='lootRequested'
                color='white'
                fontFamily='heading'
                textTransform='uppercase'
                fontSize='xs'
                fontWeight={700}
              >
                Loot Requested
              </FormLabel>
              <Input
                name='lootRequested'
                placeholder='0'
                mb={5}
                ref={register({
                  pattern: {
                    value: /[0-9]/,
                    message: 'Loot must be a number',
                  },
                })}
                color='white'
                focusBorderColor='secondary.500'
              />
            </>
          )}
          {showTribute && (
            <TributeInput
              register={register}
              setValue={setValue}
              getValues={getValues}
            />
          )}
          {(!showShares || !showLoot || !showTribute) && (
            <Menu color='white' textTransform='uppercase'>
              <MenuButton
                as={Button}
                variant='outline'
                rightIcon={<Icon as={RiAddFill} />}
              >
                Additional Options
              </MenuButton>
              <MenuList>
                {!showShares && (
                  <MenuItem onClick={() => setShowShares(true)}>
                    Request Shares
                  </MenuItem>
                )}
                {!showLoot && (
                  <MenuItem onClick={() => setShowLoot(true)}>
                    Request Loot
                  </MenuItem>
                )}
                {!showTribute && (
                  <MenuItem onClick={() => setShowTribute(true)}>
                    Give Tribute
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          )}
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

export default FundingProposalForm;
