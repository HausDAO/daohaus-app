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
  Text,
  InputGroup,
  Spinner,
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
import { GET_TRANSMUTATION } from '../graphQL/boost-queries';
import { useUser } from '../contexts/UserContext';
import { useTX } from '../contexts/TXContext';
import { useOverlay } from '../contexts/OverlayContext';
import { createPoll } from '../services/pollService';
import { createHash, detailsToJSON } from '../utils/general';
import { createForumTopic } from '../utils/discourse';
import { useSessionStorage } from '../hooks/useSessionStorage';
import AddressInput from './addressInput';

const TransmutationProposal = () => {
  const { handleSubmit, errors, register, setValue, watch } = useForm();

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
  const [transmutationValues, setTransmutationValues] = useSessionStorage(
    `${daoid}-transmutations`,
    null,
  );
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
  const paymentRequested = watch('paymentRequested');

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
  }, [transmutationData, daoMetaData, transmutationData, address]);

  useEffect(() => {
    const getGiveTokenBalance = async () => {
      const token = transmutationData[0].distributionToken;
      try {
        const tokenService = TokenService({
          tokenAddress: token,
          chainID: daochain,
        });
        const localBalance = await tokenService('balanceOf')(
          transmutationData[0].transmutation,
        );

        if (localBalance) {
          // console.log(injectedProvider?.utils.fromWei(localBalance));
          setBalance(injectedProvider?.utils.fromWei(localBalance.toString()));
          const symbol = await tokenService('symbol')();
          setSymbol(symbol);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (transmutationData?.length) {
      getGiveTokenBalance();
    }
  }, [transmutationData, injectedProvider]);

  useEffect(() => {
    const getTributeReturned = async () => {
      const tribute = await TransmutationService({
        setupValues: transmutationValues,
        chainID: daochain,
      })('calcTribute')({ paymentRequested });
      setTributeReturned(tribute);
    };
    if (paymentRequested) {
      getTributeReturned();
    } else {
      setTributeReturned('0');
    }
  }, [paymentRequested]);

  // get getToken
  useEffect(() => {
    const getGetTokenBalance = async () => {
      try {
        console.log('transmutationData', transmutationData);
        const getTokenAddress = transmutationData[0].capitalToken;
        const tokenArray = daoOverview?.tokenBalances.filter(
          token =>
            token.token.tokenAddress === getTokenAddress.toLowerCase() &&
            token.guildBank,
        );
        if (!tokenArray) {
          setTokenData([]);
          return;
        }
        setTokenData(
          tokenArray
            // .filter((token) => token)
            .map(token => ({
              label: token.token.symbol || token.token.tokenAddress,
              value: token.token.tokenAddress,
              decimals: token.token.decimals,
              balanceWei: token.tokenBalance,
              balance: injectedProvider?.utils.fromWei(token.tokenBalance),
            })),
        );
      } catch (error) {
        console.error(error);
      }
    };
    if (transmutationData?.length) {
      getGetTokenBalance();
    }
  }, [transmutationData, daoOverview]);

  const displayTribute = val => {
    if (val) {
      return injectedProvider?.utils.fromWei(`${val}`).toString();
    }
    return null;
  };

  const onSubmit = async values => {
    console.log(values);
    setLoading(true);
    const now = (new Date().getTime() / 1000).toFixed();
    const hash = createHash();
    const details = detailsToJSON({
      ...values,
      hash,
      isTransmutation: true,
    });

    const applicant = values?.applicantHidden?.startsWith('0x')
      ? values.applicantHidden
      : values?.applicant
      ? values.applicant
      : values?.memberApplicant
      ? values.memberApplicant
      : address;

    const args = [
      applicant,
      tributeReturned.toString(),
      injectedProvider.utils.toWei(`${values.paymentRequested}`),
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
              title: 'There was an error creating the proposal.',
            });
            resolvePoll(txHash);
            console.error(`Could not find a matching proposal: ${error}`);
          },
          onSuccess: txHash => {
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
              minion: transmutationData[0].minion,
              applicant: address,
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
      })('propose')({
        args,
        address,
        poll,
        onTxHash,
      });
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
      console.log(records);
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
          <FormControl>
            <FormLabel
              htmlFor='title'
              color='white'
              fontFamily='heading'
              textTransform='uppercase'
              fontSize='xs'
              fontWeight={700}
            >
              Proposal Title
            </FormLabel>
            <Input
              name='title'
              placeholder='Title Name'
              mb={5}
              ref={register({
                required: {
                  value: true,
                  message: 'Proposal needs a title',
                },
              })}
              color='white'
              focusBorderColor='secondary.500'
            />
          </FormControl>
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
              color='white'
              fontFamily='heading'
              htmlFor='paymentRequested'
              textTransform='uppercase'
              fontSize='xs'
              fontWeight={700}
            >
              Payment Requested
            </FormLabel>
            <InputGroup onSubmit={handleSubmit(onSubmit)}>
              <Button
                size='xs'
                position='absolute'
                right='0'
                top='-30px'
                variant='outline'
                onClick={() => {
                  setValue('paymentRequested', tokenData[0].balance);
                }}
              >
                {`DAO Balance: 
                ${tokenData[0] && tokenData[0].balance.substring(0, 6)} 
                ${tokenData[0] && tokenData[0].label}`}
              </Button>
              <Input
                name='paymentRequested'
                autoComplete='off'
                id='paymentRequested'
                placeholder='100'
                ref={register({
                  required: {
                    value: true,
                    message: 'Payment Requested is required',
                  },
                })}
                color='white'
                focusBorderColor='secondary.500'
              />
            </InputGroup>

            <Box mt={5} width='100%'>
              <AddressInput
                name='applicant'
                register={register}
                setValue={setValue}
                watch={watch}
              />
            </Box>
          </FormControl>
          {tokenData[0] && (
            <Flex flexDir='column'>
              <Box>
                <Text>
                  {`Exchange Rate: 1 ${tokenData[0] && tokenData[0].label} =&gt;
                  ${
                    daoMetaData?.boosts.transmutation.metadata.exchangeRate
                  } ${symbol}`}
                </Text>
              </Box>
              <Box>
                <Text>
                  {`Returns: ${displayTribute(tributeReturned)} ${symbol}`}
                </Text>

                <Text>
                  {`${symbol} Balance:
                  ${balance}`}
                </Text>
              </Box>
            </Flex>
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
        <Flex
          alignItems='center'
          justifyContent='center'
          flexDirection='column'
        >
          <Spinner mb={5} />
          <Box>Fetching transmutation data</Box>
        </Flex>
      )}
    </>
  );
};

export default TransmutationProposal;
