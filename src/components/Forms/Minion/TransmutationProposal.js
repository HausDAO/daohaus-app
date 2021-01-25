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
import { utils } from 'web3';
import { RiErrorWarningLine } from 'react-icons/ri';

import {
  useDao,
  useModals,
  useTxProcessor,
  useUser,
  useWeb3Connect,
} from '../../../contexts/PokemolContext';

import GraphFetch from '../../Shared/GraphFetch';
import { GET_TRANSMUTATION } from '../../../utils/apollo/boost-queries';
import { TransmutationService } from '../../../utils/transmutation-service';
import { TokenService } from '../../../utils/token-service';
import AddressInput from '../Shared/AddressInput';

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
  const { closeModals } = useModals();

  const {
    handleSubmit,
    errors,
    register,
    reset,
    setValue,
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

  const txCallBack = (txHash, details) => {
    if (txProcessor && txHash) {
      txProcessor.setTx(txHash, user.username, details, true, false, false);
      txProcessor.forceCheckTx = true;
      console.log('force update changed');
      updateTxProcessor({ ...txProcessor });
      reset();
      // close model here
      closeModals();
    }
    if (!txHash) {
      console.log('error: ', details);
    }
  };

  useEffect(() => {
    if (!dao || !transmutationData || !user) {
      return;
    }
    if (!dao?.boosts.transmutation) {
      return;
    }
    const setupValues = {
      ...dao.boosts.transmutation.metadata,
      ...transmutationData[0],
    };

    const ts = new TransmutationService(
      web3Connect.web3,
      user.username,
      setupValues,
      txCallBack,
    );
    setTransmutationService(ts);
    // eslint-disable-next-line
  }, [transmutationData]);

  useEffect(() => {
    const getGiveTokenBalance = async () => {
      const token = await transmutationData[0].giveToken;

      const tokenService = new TokenService(web3Connect.web3, token);

      const _balance = await tokenService.balanceOf(
        transmutationData[0].transmutation,
      );
      console.log(utils.fromWei(_balance));
      setBalance(utils.fromWei(_balance));
      const symbol = await tokenService.getSymbol();
      setSymbol(symbol);
    };
    if (web3Connect.web3 && transmutationService) {
      getGiveTokenBalance();
    }

    // eslint-disable-next-line
  }, [transmutationService]);

  // get getToken
  useEffect(() => {
    const getGetTokenBalance = async () => {
      const getTokenAddress = transmutationData[0].getToken;
      const tokenArray = dao.graphData.tokenBalances.filter(
        (token) =>
          token.token.tokenAddress === getTokenAddress.toLowerCase() &&
          token.guildBank,
      );

      if (!tokenArray) {
        setTokenData([]);
        return;
      }
      setTokenData(
        tokenArray
          .filter((token) => token)
          .map((token) => ({
            label: token.token.symbol || token.token.tokenAddress,
            value: token.token.tokenAddress,
            decimals: token.token.decimals,
            balanceWei: token.tokenBalance,
            balance: utils.fromWei(token.tokenBalance),
          })),
      );
    };
    if (transmutationService) {
      getGetTokenBalance();
    }
    // eslint-disable-next-line
  }, [balance]);

  const displayTribute = (val) => {
    return utils.fromWei('' + val);
  };

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await transmutationService.propose(
        values.applicant,
        values.paymentRequested,
        values.description,
        txCallBack,
      );
    } catch (e) {
      console.error(`Error processing proposal: ${e.toString()}`);
    }
  };

  return (
    <>
      {transmutationData && transmutationData.length ? (
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
            <AddressInput
              name='applicant'
              register={register}
              setValue={setValue}
              watch={watch}
              member={true}
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
              placeholder='100'
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
            <>
              <Button
                onClick={() => {
                  setValue('paymentRequested', tokenData[0].balance);
                }}
              >
                DAO Balance:{' '}
                {tokenData[0] && tokenData[0].balance.substring(0, 6)}{' '}
                {tokenData[0] && tokenData[0].label}
              </Button>

              <Box>
                <Text>
                  Exchange Rate: 1 {tokenData[0] && tokenData[0].label} ={' '}
                  {dao.boosts.transmutation.metadata.exchangeRate} {symbol}
                </Text>
              </Box>
              <Box>
                <h5>Will Return</h5>
                <Heading as='h2'>
                  {displayTribute(
                    transmutationService
                      .calcTribute(watch('paymentRequested'))
                      .toString(),
                  )}{' '}
                  {symbol}
                </Heading>
                <Text>
                  Balance: {balance} {symbol}
                </Text>
              </Box>
            </>
          )}
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
