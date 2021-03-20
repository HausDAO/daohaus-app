import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  FormControl,
  Flex,
  Icon,
  Box,
  Spinner,
} from '@chakra-ui/react';
import { RiErrorWarningLine } from 'react-icons/ri';

import { useOverlay } from '../contexts/OverlayContext';
import { displayBalance, valToDecimalString } from '../utils/tokenValue';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';
import { createPoll } from '../services/pollService';
import { UberHausMinionService } from '../services/uberHausMinionService';
import { useUser } from '../contexts/UserContext';
import { useTX } from '../contexts/TXContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { TokenService } from '../services/tokenService';
import MaxOutInput from '../components/maxInput';
import TokenSelect from './tokenSelect';

const FormWrapper = styled.form`
  width: 100%;
`;

const PullForm = ({ uberHausMinion, uberDelegate, uberOverview }) => {
  const { injectedProvider, address } = useInjectedProvider();
  const { daochain } = useParams();
  const { cachePoll, resolvePoll } = useUser();

  const {
    errorToast,
    successToast,
    setD2dProposalModal,
    setTxInfoModal,
  } = useOverlay();
  const { refreshDao } = useTX();

  // const { setD2dProposalModal } = useOverlay();

  const [currentError, setCurrentError] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [selectedToken, setSelectedToken] = useState(null);

  const [loadToken, setLoadToken] = useState(false);
  const [balance, setBalance] = useState({ readable: 0, real: 0 });

  const { handleSubmit, errors, register, watch, setValue } = useForm();
  const pullToken = watch('pullToken');

  const isDelegate = address === uberDelegate?.toLowerCase();

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
    if (!uberHausMinion || !pullToken) return;

    const getTokenBalance = async () => {
      try {
        setLoadToken(true);

        const tokenService = TokenService({
          chainID: daochain,
          tokenAddress: pullToken,
        });

        const balance = await tokenService('balanceOf')(
          uberHausMinion.minionAddress,
        );

        const tokenDecimals = await tokenService('decimals')();
        const readableBalance = displayBalance(balance, tokenDecimals);

        setBalance({ readable: readableBalance || 0, real: balance || 0 });
        setLoadToken(false);
      } catch (error) {
        console.error(error);
      }
    };
    if (uberHausMinion && pullToken) {
      getTokenBalance();
    }
  }, [uberHausMinion, pullToken]);

  const onSubmit = async (values) => {
    setLoading(true);

    const tokenAddress = values.pullToken.toLowerCase();
    const uberTokens = uberOverview.tokenBalances;

    const withdrawAmt = values.pull
      ? valToDecimalString(values.pull, tokenAddress, uberTokens)
      : '0';
    console.log('withDrawAmt', withdrawAmt.length);
    const args = [tokenAddress, withdrawAmt];
    const expectedBalance = +balance.real - +withdrawAmt;

    try {
      const poll = createPoll({ action: 'pullGuildFunds', cachePoll })({
        tokenAddress,
        uberMinionAddress: uberHausMinion.minionAddress,
        chainID: daochain,
        expectedBalance,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: `There was an error.`,
            });
            resolvePoll(txHash);
            console.error(`Could not pull funds: ${error}`);
          },
          onSuccess: (txHash) => {
            successToast({
              title: 'Pulled funds from UberHausMinion',
            });
            refreshDao();
            resolvePoll(txHash);
          },
        },
      });
      const onTxHash = () => {
        setD2dProposalModal((prevState) => !prevState);
        setTxInfoModal(true);
      };
      await UberHausMinionService({
        web3: injectedProvider,
        uberHausMinion: uberHausMinion.minionAddress,
        chainID: daochain,
      })('pullGuildFunds')({ args, address, poll, onTxHash });
    } catch (err) {
      setD2dProposalModal((prevState) => !prevState);
      setLoading(false);
      console.error('error: ', err);
      errorToast({
        title: `There was an error.`,
        description: err.message || '',
      });
    }
    setD2dProposalModal((prevState) => !prevState);
  };

  const inputHelperText = () => {
    if (!isDelegate) {
      return 'Must be DAO delegate in order to withdraw funds';
    } else if (loadToken) {
      return 'Loading token data...';
    } else if (!pullToken) {
      return 'Select a token';
    } else {
      return null;
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        isInvalid={errors.name}
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        mb={5}
        flexWrap='wrap'
        px={8}
      >
        <Flex flexDirection='column'>
          <Box
            color='#C4C4C4'
            mb={2}
            fontFamily='heading'
            fontWeight={900}
            fontSize='2xl'
          >
            Pull Guild Funds
          </Box>
          <Box color='#C4C4C4' mb={4}>
            Transfer funds from minion to your DAO
          </Box>
        </Flex>

        <Box w='100%'>
          <TokenSelect
            selectProps={{ mb: '6' }}
            label='Token'
            id='PullSelect'
            name='pullToken'
            register={register}
            disabled={!isDelegate}
          />
          <MaxOutInput
            register={register}
            max={loadToken ? <Spinner size='1.6rem' /> : balance.readable}
            label='Pull'
            name='pull'
            id='pull'
            disabled={!pullToken || loadToken || !isDelegate}
            helperText={inputHelperText()}
            setValue={setValue}
          />

          <Flex justify='center' mt={8} flexDir='column' alignItems='center'>
            <Button
              type='submit'
              loadingText='Submitting'
              isLoading={loading}
              disabled={loading || !isDelegate}
            >
              Submit
            </Button>
            {currentError && (
              <Box color='secondary.300' fontSize='m' mt={4}>
                <Icon as={RiErrorWarningLine} color='secondary.300' mr={2} />
                {currentError.message}
              </Box>
            )}
          </Flex>
        </Box>
      </FormControl>
    </FormWrapper>
  );
};
export default PullForm;
