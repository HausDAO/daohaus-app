import {
  Button,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
} from '@chakra-ui/react';
import TextBox from '../../Shared/TextBox';
import React, { useState, useEffect } from 'react';
import { useDao } from '../../../contexts/PokemolContext';

const TributeInput = ({ register, setValue, getValues }) => {
  const [unlocked, setUnlocked] = useState(true);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState([]);
  const [dao] = useDao();

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
    // eslint-disable-next-line
  }, [tokenData]);

  const handleChange = async () => {
    const tributeToken = getValues('tributeToken');
    const tributeOffered = getValues('tributeOffered');
    await checkUnlocked(tributeToken, tributeOffered);
    await getMax(tributeToken);
    return true;
  };

  const unlock = async () => {
    setLoading(true);
    const token = getValues('tributeToken');
    try {
      await dao.daoService.token.unlock(token);
      setUnlocked(true);
    } catch (err) {
      console.log('error:', err);
    }
    setLoading(false);
  };

  const checkUnlocked = async (token, amount) => {
    console.log('check', token, amount);
    if (amount === '' || !token) {
      return;
    }
    const amountApproved = await dao.daoService.token.unlocked(token);
    const isUnlocked = amountApproved > amount;
    setUnlocked(isUnlocked);
  };

  const getMax = async (token) => {
    const max = await dao.daoService.token.balanceOfToken(token);
    setBalance(max);
  };

  const setMax = async () => {
    setValue('tributeOffered', balance);
  };

  return (
    <>
      <TextBox as={FormLabel} size='xs'>
        Token Tribute
      </TextBox>
      <InputGroup>
        {!unlocked && (
          <Button
            onClick={() => unlock()}
            isLoading={loading}
            size='xs'
            position='absolute'
            right='0'
            bottom='-10px'
          >
            Unlock
          </Button>
        )}
        <Button
          onClick={() => setMax()}
          size='xs'
          variant='outline'
          position='absolute'
          right='0'
          top='-30px'
        >
          Max: {balance && balance.toFixed(4)}
        </Button>
        <Input
          name='tributeOffered'
          placeholder='0'
          mb={5}
          ref={register({
            pattern: {
              value: /[0-9]/,
              message: 'Tribute must be a number',
            },
          })}
          color='white'
          focusBorderColor='secondary.500'
          onChange={handleChange}
        />
        <InputRightAddon background='primary.500' p={0}>
          <Select
            name='tributeToken'
            defaultValue='0xd0a1e359811322d97991e03f863a0c30c2cf029c'
            ref={register}
            onChange={handleChange}
            color='white'
            background='primary.500'
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
    </>
  );
};

export default TributeInput;
