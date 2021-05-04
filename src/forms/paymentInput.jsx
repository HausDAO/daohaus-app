import React, { useState, useEffect } from 'react';
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
  Tooltip,
  Icon,
  FormControl,
} from '@chakra-ui/react';
import { RiInformationLine } from 'react-icons/ri';

import TextBox from '../components/TextBox';
import { useDao } from '../contexts/DaoContext';

const PaymentInput = ({
  errors,
  setValue,
  formLabel = 'Payment Requested',
  getValues,
  isTrade,
  register,
  validateGtZero = false,
}) => {
  const [balance, setBalance] = useState(0);

  const [tokenData, setTokenData] = useState([]);
  const { daoOverview } = useDao();

  // const watchToken = watch('paymentToken', '');

  useEffect(() => {
    if (daoOverview && !tokenData.length) {
      const depositTokenAddress = daoOverview.depositToken.tokenAddress;
      const depositToken = daoOverview.tokenBalances.find(
        token =>
          token.guildBank && token.token.tokenAddress === depositTokenAddress,
      );
      const tokenArray = daoOverview.tokenBalances.filter(
        token =>
          token.guildBank && token.token.tokenAddress !== depositTokenAddress,
      );
      tokenArray.unshift(depositToken);
      setTokenData(
        tokenArray.map(token => ({
          label: token.token.symbol || token.tokenAddress,
          value: token.token.tokenAddress,
          decimals: token.token.decimals,
          balance: token.tokenBalance,
        })),
      );
    }
  }, [daoOverview]);

  const getMax = async token => {
    const selected = tokenData.find(item => item.value === token);
    if (selected) {
      setBalance(selected.balance / 10 ** selected.decimals);
    }
  };

  const setMax = async () => {
    setValue('paymentRequested', balance);
  };

  useEffect(() => {
    if (tokenData.length) {
      const depositToken = tokenData[0];
      getMax(depositToken.value);
      setMax();
    }
  }, [tokenData]);

  const handleChange = async () => {
    const paymentToken = getValues('paymentToken');
    if (tokenData.length && paymentToken) {
      getMax(paymentToken);
    }
  };

  const validateBalance = value => {
    if (validateGtZero && value <= 0) {
      return 'Payment Requested must be greater than zero';
    }
    if (value > balance) {
      return 'Payment Requested is more than the dao has';
    }
    return true;
  };

  return (
    <FormControl>
      <Tooltip
        hasArrow
        shouldWrapChildren
        label='Request funds from the DAO'
        placement='top'
      >
        {isTrade && <TextBox size='xs'>Trade For</TextBox>}
        <TextBox as={FormLabel} size='xs' d='flex' alignItems='center' mt={1}>
          {formLabel}
          <Icon as={RiInformationLine} ml={2} />
        </TextBox>
      </Tooltip>
      <InputGroup>
        <Button
          onClick={() => setMax()}
          size='xs'
          position='absolute'
          right='0'
          top='-30px'
          variant='outline'
        >
          {`Max: ${balance && balance.toFixed(4)}`}
        </Button>
        <Input
          name='paymentRequested'
          placeholder='0'
          ref={register({
            pattern: {
              value: /[0-9]/,
              message: 'Payment must be a number',
            },
            validate: validateBalance,
          })}
        />
        <InputRightAddon background='primary.500' p={0}>
          <Select
            name='paymentToken'
            ref={register}
            onChange={handleChange}
            color='white'
            background='primary.500'
            w='100%'
          >
            {' '}
            {tokenData.map((token, idx) => (
              <option key={idx} default={!idx} value={token.value}>
                {token.label}
              </option>
            ))}
          </Select>
        </InputRightAddon>
      </InputGroup>

      <FormErrorMessage>
        {errors.paymentToken && errors.paymentToken.message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default PaymentInput;
