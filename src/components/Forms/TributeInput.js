import {
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
} from '@chakra-ui/core';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDao, useTheme } from '../../contexts/PokemolContext';

const TributeInput = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  // const [token, setToken] = useState();
  const [tokenData, setTokenData] = useState();
  const [dao] = useDao();
  const [theme] = useTheme();

  const {
    register,
    // formState
  } = useForm();

  useEffect(() => {
    if (dao && dao.graphData) {
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
    console.log('tokenData', tokenData);
  }, []);

  const unlock = async (token) => {
    setLoading(true);
    const ul = await dao.daoService.token.unlock(token);
    console.log(ul);

    setUnlocked(true);
    setLoading(false);
  };

  const checkUnlocked = async (token, amount) => {
    if (amount === '') {
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

  //   useEffect(() => {
  //     const runCheck = async () => {
  //       await checkUnlocked(token, field.value);
  //       await getMax(token);
  //       return true;
  //     };
  //     runCheck();
  //     // eslint-disable-next-line
  //   }, [token]);

  return (
    <InputGroup>
      <FormLabel
        htmlFor='tributeOffered'
        color='white'
        fontFamily={theme.fonts.heading}
        textTransform='uppercase'
        fontSize='xs'
        fontWeight={700}
      >
        Token Tribute
      </FormLabel>
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
      />
      <InputRightAddon>
        <Select
          name='tributeToken'
          defaultValue='0xd0a1e359811322d97991e03f863a0c30c2cf029c'
          ref={register}
        >
          <option default value='0xd0a1e359811322d97991e03f863a0c30c2cf029c'>
            WETH
          </option>
          <option value='dai'>Dai</option>
          <option value='usdc'>USDC</option>
        </Select>
      </InputRightAddon>
    </InputGroup>
  );
};

export default TributeInput;

// <FieldContainer
// className={field.value !== '' ? 'Field HasValue' : 'Field '}
// >
// <label>{props.label}</label>
// <input
//   type="number"
//   {...field}
//   {...props}
//   onBlur={(e) => {
//     field.onBlur(e);
//     checkUnlocked(token, field.value);
//   }}
// />
// <div className="MaxLabel">Max: {balance.toFixed(4)}</div>
// {field.value && field.value !== 0 && !unlocked ? (
//   <div className="UnlockButton" onClick={() => unlock(token)}>
//     {!loading ? <span>! Unlock </span> : <TinyLoader />}
//   </div>
// ) : null}
// </FieldContainer>
