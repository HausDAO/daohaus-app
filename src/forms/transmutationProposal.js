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
import { RiErrorWarningLine } from 'react-icons/ri';
import { useParams } from 'react-router-dom';

import { useDao } from '../contexts/DaoContext';
import { useMetaData } from '../contexts/MetaDataContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { graphQuery } from '../utils/apollo';
import { getGraphEndpoint } from '../utils/chain';
import { TransmutationService } from '../services/transmutationService';
import { TokenService } from '../services/tokenService';
import AddressInput from './addressInput';
import { GET_TRANSMUTATION } from '../graphQL/boost-queries';
import { useUser } from '../contexts/UserContext';
import { useTX } from '../contexts/TXContext';
import { useOverlay } from '../contexts/OverlayContext';
import { createPoll } from '../services/pollService';
import { createHash, detailsToJSON } from '../utils/general';
import { createForumTopic } from '../utils/discourse';

const TransmutationProposal = () => {
  const [loading, setLoading] = useState(false);
  const { daochain, daoid } = useParams();
  const { address, injectedProvider } = useInjectedProvider();
  const { daoOverview } = useDao();
  const { daoMetaData } = useMetaData();
  const [currentError, setCurrentError] = useState(null);

  const [transmutationData, setTransmutationData] = useState();
  const [tokenData, setTokenData] = useState([]);
  const [balance, setBalance] = useState(0);
  const [symbol, setSymbol] = useState(0);
  const [transmutationValues, setTransmutationValues] = useState(null);
  const [tributeReturned, setTributeReturned] = useState(null);
  const { cachePoll, resolvePoll } = useUser();
  const {
    errorToast,
    successToast,
    setProposalModal,
    setTxInfoModal,
  } = useOverlay();
  const { refreshDao } = useTX();
  // const { closeModals } = useModals();

  const {
    handleSubmit,
    errors,
    register,
    // reset,
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

  useEffect(() => {
    if (!daoMetaData || !transmutationData || !address) {
      return;
    }
    if (!daoMetaData?.boosts.transmutation) {
      return;
    }
    const setupValues = {
      ...daoMetaData.boosts.transmutation.metadata,
      ...transmutationData[0],
    };
    setTransmutationValues(setupValues);
    // eslint-disable-next-line
  }, [transmutationData]);

  useEffect(() => {
    const getGiveTokenBalance = async () => {
      const token = transmutationData[0].giveToken;
      const tokenService = TokenService({
        tokenAddress: token,
        chainID: daochain,
      });
      const _balance = await tokenService('balanceOf')(
        transmutationData[0].transmutation,
      );
      // console.log(injectedProvider?.utils.fromWei(_balance));
      setBalance(injectedProvider?.utils.fromWei(_balance));
      const symbol = await tokenService('symbol')();
      setSymbol(symbol);
    };
    if (transmutationData) {
      getGiveTokenBalance();
    }
    // eslint-disable-next-line
  }, [transmutationData]);

  useEffect(() => {
    const getTributeReturned = async () => {
      const paymentRequested = watch('paymentRequested');
      const tribute = await TransmutationService({
        setupValues: transmutationValues,
        chainID: daochain,
      })('calcTribute')({ paymentRequested });
      setTributeReturned(tribute);
    };
    if (watch('paymentRequested')) {
      getTributeReturned();
    }
  }, [watch('paymentRequested')]);

  // get getToken
  useEffect(() => {
    const getGetTokenBalance = async () => {
      const getTokenAddress = transmutationData[0].getToken;
      const tokenArray = daoOverview?.tokenBalances.filter(
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
            balance: injectedProvider?.utils.fromWei(token.tokenBalance),
          })),
      );
    };
    if (transmutationData) {
      getGetTokenBalance();
    }
    // eslint-disable-next-line
  }, [transmutationData]);

  const displayTribute = (val) => {
    if (val) {
      return injectedProvider?.utils.fromWei('' + val).toString();
    }
    return null;
  };

  const onSubmit = async (values) => {
    setLoading(true);
    const now = (new Date().getTime() / 1000).toFixed();
    const hash = createHash();
    const details = `${values.description}", "hash": "${hash}`;

    const args = [
      values.applicant,
      tributeReturned.toString(),
      injectedProvider.utils.toWei('' + values.paymentRequested),
      details,
    ];

    try {
      const poll = createPoll({ action: 'transmutationProposal', cachePoll })({
        daoID: daoid,
        chainID: daochain,
        hash,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: `There was an error creating the proposal.`,
            });
            resolvePoll(txHash);
            console.error(`Could not find a matching proposal: ${error}`);
          },
          onSuccess: (txHash) => {
            successToast({
              title: 'Transmutation proposal created.',
            });
            refreshDao();
            resolvePoll(txHash);
            createForumTopic({
              chainID: daochain,
              daoID: daoid,
              afterTime: now,
              proposalType: 'Transmutation Proposal',
              values,
              applicant: values.applicant,
              daoMetaData,
            });
          },
        },
      });
      const onTxHash = () => {
        setProposalModal(false);
        setTxInfoModal(true);
      };
      await TransmutationService({
        web3: injectedProvider,
        transmutation: transmutationData[0].transmutation,
        setupValues: transmutationValues,
        chainID: daochain,
      })('propose')({ args, address, poll, onTxHash });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getTransmutationRecords = async () => {
      const records = await graphQuery({
        endpoint: getGraphEndpoint(daochain, 'boosts_graph_url'),
        query: GET_TRANSMUTATION,
        variables: {
          contractAddress: daoid,
        },
      });

      setTransmutationData(records.transmutations);
    };
    if (daoid) {
      getTransmutationRecords();
    }
  }, [daoid]);

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
                  {daoMetaData?.boosts.transmutation.metadata.exchangeRate}{' '}
                  {symbol}
                </Text>
              </Box>
              <Box>
                <h5>Will Return</h5>
                <Heading as='h2'>
                  {displayTribute(tributeReturned)} {symbol}
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
        // <GraphFetch
        //   query={GET_TRANSMUTATION}
        //   setRecords={setTransmutationData}
        //   entity='transmutations'
        //   isBoosts={true}
        //   variables={{ contractAddress: dao.address }}
        // />
        <Box>Records</Box>
      )}
    </>
  );
};

export default TransmutationProposal;
