import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button, FormControl, Flex, Icon, Box } from '@chakra-ui/react';
import { RiErrorWarningLine } from 'react-icons/ri';

import { useOverlay } from '../contexts/OverlayContext';
import { displayBalance, valToDecimalString } from '../utils/tokenValue';
import styled from '@emotion/styled';
import { UBERHAUS_ADDRESS } from '../utils/uberhaus';
import { useParams } from 'react-router-dom';
import { createPoll } from '../services/pollService';
import { UberHausMinionService } from '../services/uberHausMinionService';
import { useUser } from '../contexts/UserContext';
import { useTX } from '../contexts/TXContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import MaxOutInput from '../components/maxInput';
import TokenSelect from './tokenSelect';

const FormWrapper = styled.form`
  width: 100%;
`;

const WithdrawForm = ({ uberMembers, uberHausMinion }) => {
  const { successToast, errorToast, setTxInfoModal } = useOverlay();
  const { cachePoll, resolvePoll } = useUser();
  const { refreshDao } = useTX();
  const { injectedProvider, address } = useInjectedProvider();
  const { daochain } = useParams();
  const { handleSubmit, errors, register, watch, setValue } = useForm();

  const [loading, setLoading] = useState(false);
  const [currentError, setCurrentError] = useState(null);
  const { setD2dProposalModal } = useOverlay();
  const [selectedToken, setSelectedToken] = useState(null);
  const [balance, setBalance] = useState(0);
  const [uberTokens, setUberTokens] = useState(null);

  const withdrawToken = watch('withdrawToken');

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
    if (!uberMembers || !uberHausMinion || !withdrawToken) return;

    const uberMinionMember = uberMembers.find(
      (member) => member.memberAddress === uberHausMinion.minionAddress,
    );
    if (uberMinionMember) {
      const tokenBalances = uberMinionMember.tokenBalances;
      const token = tokenBalances.find(
        ({ token }) => token.tokenAddress === withdrawToken?.toLowerCase(),
      );
      console.log(tokenBalances);
      const readableBalance = displayBalance(
        token?.tokenBalance,
        token?.token?.decimals,
      );
      setSelectedToken(token);
      setBalance(readableBalance || 0);
      setUberTokens(tokenBalances);
    } else {
      // do something when not found ?
    }
  }, [uberMembers, uberHausMinion, withdrawToken]);

  const onSubmit = async (values) => {
    setLoading(true);
    console.log('formValues', values);

    const tokenAddress = selectedToken?.token?.tokenAddress;
    const currentBalance = selectedToken?.tokenBalance;
    const withdrawAmt = values.withdraw
      ? valToDecimalString(values.withdraw, tokenAddress, uberTokens)
      : '0';
    const args = [UBERHAUS_ADDRESS, tokenAddress, withdrawAmt];
    const expectedBalance = +currentBalance - +withdrawAmt;

    try {
      const poll = createPoll({ action: 'withdrawBalance', cachePoll })({
        tokenAddress,
        memberAddress: uberHausMinion.minionAddress,
        chainID: daochain,
        uber: true,
        expectedBalance,
        daoID: UBERHAUS_ADDRESS,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: `There was an error.`,
            });
            resolvePoll(txHash);
            console.error(`Could not withdraw funds: ${error}`);
          },
          onSuccess: (txHash) => {
            successToast({
              title: 'Withdrew funds from UberHAUS!',
            });
            refreshDao();
            // refreshAllies();
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
      })('doWithdraw')({ args, address, poll, onTxHash });
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

  return (
    <FormWrapper onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        isInvalid={errors.name}
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        mb={5}
        p={0}
        flexWrap='wrap'
        width='100%'
        px={8}
        borderRight={['none', null, null, '1px solid rgba(255,255,255,0.2)']}
      >
        <Flex flexDirection='column'>
          <Box
            color='#C4C4C4'
            mb={2}
            fontFamily='heading'
            fontWeight={900}
            fontSize='2xl'
          >
            Withdraw
          </Box>
          <Box color='#C4C4C4' mb={4}>
            Withdraw tokens into the minion
          </Box>
        </Flex>
        <Box w='100%'>
          <TokenSelect
            selectProps={{ mb: '6' }}
            label='Token'
            id='withdrawSelect'
            name='withdrawToken'
            register={register}
          />
          <MaxOutInput
            register={register}
            max={balance}
            label='Withdraw'
            name='withdraw'
            id='withdraw'
            disabled={!withdrawToken}
            helperText={!withdrawToken && 'Select a token'}
            setValue={setValue}
          />
          <Flex justify='center' mt={8}>
            <Button
              type='submit'
              loadingText='Submitting'
              isLoading={loading}
              disabled={loading}
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

export default WithdrawForm;
