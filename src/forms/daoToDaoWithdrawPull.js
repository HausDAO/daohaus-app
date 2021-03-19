import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  FormControl,
  Flex,
  Icon,
  Box,
  useBreakpointValue,
  Select,
  FormLabel,
  InputGroup,
  Input,
  FormHelperText,
  Spinner,
} from '@chakra-ui/react';
import { RiErrorWarningLine } from 'react-icons/ri';

import { useOverlay } from '../contexts/OverlayContext';
import { displayBalance, valToDecimalString } from '../utils/tokenValue';
// import { detailsToJSON } from '../utils/general';
import styled from '@emotion/styled';
import {
  UBERHAUS_ADDRESS,
  UBERHAUS_STAKING_TOKEN,
  UBERHAUS_STAKING_TOKEN_SYMBOL,
} from '../utils/uberhaus';
import TextBox from '../components/TextBox';
import { useParams } from 'react-router-dom';
import { createPoll } from '../services/pollService';
import { UberHausMinionService } from '../services/uberHausMinionService';
import { useUser } from '../contexts/UserContext';
import { useTX } from '../contexts/TXContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { TokenService } from '../services/tokenService';

const FormWrapper = styled.form`
  width: 100%;
`;

const WithdrawPullForm = ({
  uberMembers,
  uberHausMinion,
  uberDelegate,
  uberOverview,
}) => {
  const [currentView, setCurrentView] = useState('withdraw');

  const BothForms = () => (
    <>
      <WithdrawForm uberMembers={uberMembers} uberHausMinion={uberHausMinion} />
      <PullForm
        uberDelegate={uberDelegate}
        uberHausMinion={uberHausMinion}
        uberOverview={uberOverview}
      />
    </>
  );
  const getCurrentMobileForm = (currentView) => {
    return currentView === 'withdraw' ? (
      <WithdrawForm uberMembers={uberMembers} uberHausMinion={uberHausMinion} />
    ) : (
      <PullForm
        uberDelegate={uberDelegate}
        uberHausMinion={uberHausMinion}
        uberOverview={uberOverview}
      />
    );
  };

  const mobileForm = getCurrentMobileForm(currentView);
  const formLayout = useBreakpointValue({
    lg: <BothForms />,
    md: mobileForm,
    sm: mobileForm,
    base: mobileForm,
  });

  const switchView = (e) => {
    if (e?.target?.value) {
      setCurrentView(e.target.value);
    }
  };

  return (
    <Flex width='100%' mt={-4} flexDirection={['column', null, null, 'row']}>
      <Flex mb={6} display={['flex', null, null, 'none']}>
        <Button
          size='sm'
          variant={currentView === 'withdraw' ? 'solid' : 'outline'}
          value='withdraw'
          onClick={switchView}
          borderRadius='6px 0 0 6px'
          _hover={{ scale: '1' }}
          outline='none'
        >
          Withdraw
        </Button>
        <Button
          size='sm'
          variant={currentView === 'pull' ? 'solid' : 'outline'}
          value='pull'
          onClick={switchView}
          borderRadius='0 6px 6px 0'
          _hover={{ scale: '1' }}
          outline='none'
        >
          Pull Funds
        </Button>
      </Flex>
      {formLayout}
    </Flex>
  );
};

export default WithdrawPullForm;

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

const PullForm = ({
  uberHausMinion,
  uberDelegate,
  uberTokens,
  uberOverview,
}) => {
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

const temporaryTokenOptions = [
  { name: UBERHAUS_STAKING_TOKEN_SYMBOL, value: UBERHAUS_STAKING_TOKEN },
];

const TokenSelect = ({
  selectProps = {},
  label = 'token',
  id,
  register,
  name,
  disabled,
}) => {
  return (
    <Box>
      <TextBox as={FormLabel} size='xs' htmlFor={id} mb={2}>
        {label}
      </TextBox>
      <Select
        {...selectProps}
        id={id}
        ref={register}
        name={name}
        placeholder='--Select Token--'
        color='whiteAlpha.900'
        disabled={disabled}
      >
        {temporaryTokenOptions.map((token) => (
          <option key={token.value} value={token.value}>
            {token.name}
          </option>
        ))}
      </Select>
    </Box>
  );
};

const MaxOutInput = ({
  label = 'labelPlaceholder',
  setValue,
  register,
  name,
  helperText,
  max,
  id,
  containerProps = {},
  validationPattern = {},
  disabled,
}) => {
  const setMax = () => {
    setValue(name, max);
  };
  return (
    <Box {...containerProps}>
      <TextBox as={FormLabel} size='xs' htmlFor={id} mb={2}>
        {label}
      </TextBox>
      <InputGroup>
        <Button
          onClick={setMax}
          size='xs'
          position='absolute'
          right='0'
          top='-30px'
          variant='outline'
          disabled={disabled}
        >
          Max: {max}
        </Button>
        <Input
          name={name}
          placeholder='0'
          id={id}
          ref={register({
            pattern: validationPattern,
          })}
          color='white'
          focusBorderColor='secondary.500'
          disabled={disabled}
        />
      </InputGroup>
      <FormHelperText>{helperText}</FormHelperText>
    </Box>
  );
};
