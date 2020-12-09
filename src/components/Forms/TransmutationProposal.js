import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  FormLabel,
  FormControl,
  Flex,
  Input,
  Icon,
  Box,
  Textarea,
  Heading,
  Text,
} from '@chakra-ui/react';
import TextBox from '../Shared/TextBox';
import { utils } from 'web3';
import { RiAddFill, RiErrorWarningLine } from 'react-icons/ri';

import {
  useDao,
  useTxProcessor,
  useUser,
  useWeb3Connect,
} from '../../contexts/PokemolContext';

import GraphFetch from '../Shared/GraphFetch';
import { GET_TRANSMUTATION } from '../../utils/boost-queries';
import { TransmutationService } from '../../utils/transmutation-service';
import { TokenService } from '../../utils/token-service';

const TransmutationProposal = () => {
  const [loading, setLoading] = useState(false);
  const [user] = useUser();
  const [dao] = useDao();
  const [web3Connect] = useWeb3Connect();
  const [txProcessor, updateTxProcessor] = useTxProcessor();
  const [currentError, setCurrentError] = useState(null);

  const [transmutationData, setTransmutationData] = useState();
  const [transmutationService, setTransmutationService] = useState();
  const [tokenData, setTokenData] = useState([]);
  const [balance, setBalance] = useState(0);
  const [symbol, setSymbol] = useState(0);

  console.log('tansmutationData', transmutationData);
  console.log('dao', dao);

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

  // const txCallBack = (txHash, details) => {
  //   console.log('txCallBack', txProcessor);
  //   if (txProcessor && txHash) {
  //     txProcessor.setTx(txHash, user.username, details);
  //     txProcessor.forceUpdate = true;

  //     updateTxProcessor({ ...txProcessor });
  //     // close model here
  //     // onClose();
  //     // setShowModal(null);
  //     setLoading(false);
  //     reset();
  //   }
  //   if (!txHash) {
  //     console.log('error: ', details);
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (!dao || !transmutationData) {
      return;
    }
    const setupValues = {
      ...dao.boosts.transmutation.metadata,
      ...transmutationData[0],
    };
    console.log('setupValues', setupValues);

    const ts = new TransmutationService(
      web3Connect.web3,
      user.username,
      setupValues,
    );
    setTransmutationService(ts);
  }, [transmutationData]);

  useEffect(() => {
    const getBalance = async () => {
      const token = await transmutationService.giveToken();

      const tokenService = new TokenService(web3Connect.web3, token);

      const balance = await tokenService.balanceOf(
        transmutationService.setupValues.transmutation,
      );

      console.log('balance', web3Connect.web3.utils.fromWei(balance));
      setBalance(web3Connect.web3.utils.fromWei(balance));
      const symbol = await tokenService.getSymbol();
      setSymbol(symbol);
    };
    if (transmutationService) {
      getBalance();
    }

    // eslint-disable-next-line
  }, [web3Connect.web3]);

  // get getToken
  useEffect(() => {
    const getTokenBalance = async () => {
      const getTokenAddress = await transmutationService.getToken();
      console.log('getTokenAddress', getTokenAddress);
      const tokenArray = dao.moloch.tokenBalances.filter(
        (token) =>
          token.token.tokenAddress === getTokenAddress.toLowerCase() &&
          token.guildBank,
      );

      if (!tokenArray) {
        setTokenData([]);
        return;
      }
      console.log('tokenArray', tokenArray);
      setTokenData(
        tokenArray
          .filter((token) => token)
          .map((token) => ({
            label: token.token.symbol || token.token.tokenAddress,
            value: token.token.tokenAddress,
            decimals: token.token.decimals,
            balanceWei: token.tokenBalance,
            balance: web3Connect.web3.utils.fromWei(token.tokenBalance),
          })),
      );
    };
    if (dao && dao.moloch && transmutationService) {
      getTokenBalance();
    }
    // eslint-disable-next-line
  }, [dao, web3Connect]);

  const displayTribute = (val) => {
    return val && utils.fromWei('' + val);
  };

  const onSubmit = async (values) => {
    setLoading(true);

    return transmutationService.propose(
      values.applicant,
      values.paymentRequested,
      values.description,
    );
  };

  return (
    <>
      {transmutationData ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl
            isInvalid={errors.name}
            display='flex'
            flexDirection='row'
            justifyContent='space-between'
            mb={5}
            flexWrap='wrap'
          >
            <FormLabel
              htmlFor='description'
              color='white'
              fontFamily='heading'
              textTransform='uppercase'
              fontSize='xs'
              fontWeight={700}
            >
              Description
            </FormLabel>
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
            <FormLabel
              htmlFor='applicant'
              color='white'
              fontFamily='heading'
              textTransform='uppercase'
              fontSize='xs'
              fontWeight={700}
            >
              Applicant
            </FormLabel>
            <Input
              name='applicant'
              placeholder='0x'
              mb={5}
              ref={register({
                required: {
                  value: true,
                  message: 'Applicant contract is required',
                },
              })}
              color='white'
              focusBorderColor='secondary.500'
            />
            <FormLabel
              htmlFor='paymentRequested'
              color='white'
              fontFamily='heading'
              textTransform='uppercase'
              fontSize='xs'
              fontWeight={700}
            >
              Payment Requested
            </FormLabel>
            <Input
              name='paymentRequested'
              placeholder='0x'
              mb={5}
              ref={register({
                required: {
                  value: true,
                  message: 'Payment Requested is required',
                },
              })}
              color='white'
              focusBorderColor='secondary.500'
            />
          </FormControl>
          {tokenData[0] && (
            <Button
            //   onClick={() => {
            //     setFieldValue('paymentRequested', tokenData[0].balance);
            //   }}
            >
              DAO Balance:{' '}
              {tokenData[0] && tokenData[0].balance.substring(0, 6)}{' '}
              {tokenData[0] && tokenData[0].label}
            </Button>
          )}

          <Box>
            <Text>
              Exchange Rate: 1 {tokenData[0] && tokenData[0].label} ={' '}
              {transmutationService?.setupValues.exchangeRate} {symbol}
            </Text>
          </Box>
          <Box>
            <h5>Will Return</h5>
            <Heading as='h2'>
              {displayTribute(
                transmutationService
                  ?.calcTribute(getValues('paymentRequested'))
                  .toString(),
              )}{' '}
              {symbol}
            </Heading>
            <Text>{/* Balance: {balance} {symbol} */}</Text>
          </Box>
          <Flex justify='flex-end' align='center' h='60px'>
            {currentError && (
              <Box color='red.500' fontSize='m' mr={5}>
                <Icon as={RiErrorWarningLine} color='red.500' mr={2} />
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
      ) : (
        <GraphFetch
          query={GET_TRANSMUTATION}
          setRecords={setTransmutationData}
          entity='transmutations'
          isBoosts={true}
          variables={{ contractAddress: dao.address }}
        />
      )}
    </>
  );
};

export default TransmutationProposal;
