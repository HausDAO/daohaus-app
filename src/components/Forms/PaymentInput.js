import {
  Button,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
} from '@chakra-ui/core';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDao, useTheme } from '../../contexts/PokemolContext';

const PaymentInput = () => {
  const [balance, setBalance] = useState(0);

  const [tokenData, setTokenData] = useState([]);
  const [dao] = useDao();
  const [theme] = useTheme();

  const {
    register,
    watch,
    setValue,
    // formState
  } = useForm();

  const watchToken = watch('paymentToken', '');

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
    const getMax = async (token) => {
      const selected = tokenData.find((item) => item.value === token);
      if (selected) {
        setBalance(selected.balance / 10 ** selected.decimals);
      }
    };

    if (tokenData.length && watchToken) {
      getMax(watchToken);
    }
    // eslint-disable-next-line
  }, [watchToken, tokenData]);

  const setMax = async () => {
    setValue('paymentRequested', balance);
  };

  return (
    <>
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
          <Select name='paymentToken' ref={register}>
            {' '}
            {tokenData.map((token, idx) => (
              <option key={idx} default={!idx} value={token.value}>
                {token.label}
              </option>
            ))}
          </Select>
        </InputRightAddon>
      </InputGroup>
      <Button onClick={() => setMax()}>
        Max: {balance && balance.toFixed(4)}
      </Button>
    </>
  );
};

export default PaymentInput;
