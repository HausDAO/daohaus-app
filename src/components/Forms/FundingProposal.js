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
  InputRightAddon,
  Icon,
  Stack,
  Select,
  Box,
  Text,
  Textarea,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  FormHelperText,
} from '@chakra-ui/core';
import { utils } from 'web3';
import { RiAddFill, RiErrorWarningLine } from 'react-icons/ri';

import {
  useDao,
  useTheme,
  useTxProcessor,
  useUser,
  useEns,
} from '../../contexts/PokemolContext';
import { PrimaryButton } from '../../themes/components';
import { set } from 'date-fns';

const FundingProposalForm = () => {
  const [loading, setLoading] = useState(false);
  const [showShares, setShowShares] = useState(false);
  const [showLoot, setShowLoot] = useState(false);
  const [showTribute, setShowTribute] = useState(false);
  const [showApplicant, setShowApplicant] = useState(false);
  const [ensAddr, setEnsAddr] = useState('');
  const [theme] = useTheme();
  const [user] = useUser();
  const [dao] = useDao();
  const [ens] = useEns();
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
        values.tributeToken || '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
        values.paymentRequested
          ? utils.toWei(values.paymentRequested?.toString())
          : '0',
        values.paymentToken ||
          values.tributeToken ||
          '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
        details,
        ensAddr.startsWith('0x') ? ensAddr : values.applicant,
        txCallBack,
      );
    } catch (err) {
      setLoading(false);
      console.log('error: ', err);
    }
  };

  const handleChange = async (e) => {
    if (e.target.value.endsWith('.eth')) {
      const address = await ens.provider.resolveName(e.target.value);
      if (address) {
        setEnsAddr(address);
      } else {
        setEnsAddr('No ENS set');
      }
    } else {
      setEnsAddr(null);
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
          <FormControl>
            <FormLabel
              htmlFor='applicant'
              color='white'
              fontFamily={theme.fonts.heading}
              textTransform='uppercase'
              fontSize='xs'
              fontWeight={700}
            >
              Applicant
            </FormLabel>
            <FormHelperText fontSize='xs' id='applicant-helper-text'>
              {ensAddr ? `${ensAddr}` : 'Use ETH address or ENS'}
            </FormHelperText>
            <Input
              name='applicant'
              placeholder='0x'
              mb={5}
              ref={register({
                required: {
                  value: true,
                  message: 'Applicant is required',
                },
              })}
              color='white'
              focusBorderColor='secondary.500'
              onChange={handleChange}
            />
          </FormControl>
          <FormLabel
            htmlFor='paymentRequested'
            color='white'
            fontFamily={theme.fonts.heading}
            textTransform='uppercase'
            fontSize='xs'
            fontWeight={700}
          >
            Payment Requested
          </FormLabel>
          <InputGroup>
            <Input
              name='paymentRequested'
              placeholder='0'
              mb={5}
              ref={register({
                pattern: {
                  value: /[0-9]/,
                  message: 'Payment must be a number',
                },
              })}
              color='white'
              focusBorderColor='secondary.500'
            />
            <InputRightAddon>
              <Select
                name='paymentToken'
                defaultValue='0xd0a1e359811322d97991e03f863a0c30c2cf029c'
                ref={register}
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
          {showShares && (
            <>
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
                fontFamily={theme.fonts.heading}
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
            <>
              <FormLabel
                htmlFor='tributeOffered'
                color='white'
                fontFamily={theme.fonts.heading}
                textTransform='uppercase'
                fontSize='xs'
                fontWeight={700}
              >
                Token Tribute
              </FormLabel>
              <InputGroup>
                <Input
                  name='tributeOffered'
                  placeholder='0'
                  mb={5}
                  ref={register({
                    pattern: {
                      value: /[0-9]/,
                      message: 'Tribute must be a number',
                    },
                  })}
                  color='white'
                  focusBorderColor='secondary.500'
                />
                <InputRightAddon>
                  <Select
                    name='tributeToken'
                    defaultValue='0xd0a1e359811322d97991e03f863a0c30c2cf029c'
                    ref={register}
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
            </>
          )}
          {(!showShares || !showLoot || !showTribute) && (
            <Menu color='white' textTransform='uppercase'>
              <MenuButton
                as={Button}
                rightIcon={<Icon as={RiAddFill} color='primary.500' />}
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
                    Request Payment
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          )}
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

export default FundingProposalForm;
