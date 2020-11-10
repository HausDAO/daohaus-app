import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
} from '@chakra-ui/core';
import React, { useState, useEffect } from 'react';
import { useDao } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';

const PaymentInput = ({ register, setValue, getValues, errors }) => {
  const [balance, setBalance] = useState(0);

  const [tokenData, setTokenData] = useState([]);
  const [dao] = useDao();
  const [theme] = useTheme();

  // const watchToken = watch('paymentToken', '');

  useEffect(() => {
    if (dao?.graphData && !tokenData.length) {
      const depositTokenAddress = dao.graphData.depositToken.tokenAddress;
      const depositToken = dao.graphData.tokenBalances.find(
        (token) =>
          token.guildBank && token.token.tokenAddress === depositTokenAddress,
      );
      const tokenArray = dao.graphData.tokenBalances.filter(
        (token) =>
          token.guildBank && token.token.tokenAddress !== depositTokenAddress,
      );

      tokenArray.unshift(depositToken);
      setTokenData(
        tokenArray.map((token) => ({
          label: token.token.symbol || token.tokenAddress,
          value: token.token.tokenAddress,
          decimals: token.token.decimals,
          balance: token.tokenBalance,
        })),
      );
    }
    // eslint-disable-next-line
  }, [dao]);

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

  const getMax = async (token) => {
    const selected = tokenData.find((item) => item.value === token);
    if (selected) {
      setBalance(selected.balance / 10 ** selected.decimals);
    }
  };

  const setMax = async () => {
    setValue('paymentRequested', balance);
  };

  const validateBalance = (value) => {
    let error;
    if (value > balance) {
      error = 'Payment Requested is more than the dao has';
    }
    return error || true;
  };

  return (
    <>
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
      <InputGroup>
        <Button
          onClick={() => setMax()}
          size='xs'
          position='absolute'
          right='0'
          top='-30px'
          variant='outline'
        >
          Max: {balance && balance.toFixed(4)}
        </Button>
        <Input
          name='paymentRequested'
          placeholder='0'
          mb={5}
          ref={register({
            pattern: {
              value: /[0-9]/,
              message: 'Payment must be a number',
            },
            validate: validateBalance,
          })}
          color='white'
          focusBorderColor='secondary.500'
        />
        <InputRightAddon>
          <Select
            name='paymentToken'
            ref={register}
            onChange={handleChange}
            color='black'
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
    </>
  );
};

export default PaymentInput;
