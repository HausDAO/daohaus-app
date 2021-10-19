import React, { useEffect, useState } from 'react';
import { RiInformationLine } from 'react-icons/ri';
import { Flex, Icon, Text } from '@chakra-ui/react';

import { useDao } from '../contexts/DaoContext';
import InputSelect from './inputSelect';
import { handleDecimals } from '../utils/general';

const getMaxBalance = (tokenData, tokenAddress) => {
  //  Uses token select data structure
  const token = tokenData.find(t => t.value === tokenAddress);

  if (token) {
    return handleDecimals(token.balance, token.decimals);
  }
};

const PriceInput = props => {
  const { daoOverview } = useDao();
  const { localForm } = props;
  const { getValues, register, setValue, watch } = localForm;

  const [tokenName, setTokenName] = useState();
  const [daoTokens, setDaoTokens] = useState([]);
  const [, setBalance] = useState(null);

  const paymentToken = watch('paymentToken');
  const orderPrice = watch('orderPrice');

  useEffect(() => {
    register('market');
    register('orderType');
    setValue('market', 'Rarible');
    setValue('orderType', 'sell');
  }, []);

  useEffect(() => {
    if (daoOverview) {
      const depTokenAddress = daoOverview.depositToken?.tokenAddress;
      const depositToken = daoOverview.tokenBalances?.find(
        token =>
          token.guildBank && token.token.tokenAddress === depTokenAddress,
      );
      const nonDepTokens = daoOverview.tokenBalances.filter(
        token =>
          token.guildBank && token.token.tokenAddress !== depTokenAddress,
      );

      setDaoTokens(
        [depositToken, ...nonDepTokens]
          .filter(token => token.token.symbol)
          .map(token => ({
            value: token.token.tokenAddress,
            name: token.token.symbol || token.token.tokenAddress,
            decimals: token.token.decimals,
            balance: token.tokenBalance,
          })),
      );
    }
  }, [daoOverview]);

  useEffect(() => {
    const tokenAddr = paymentToken || getValues('paymentToken');
    if (daoTokens?.length && tokenAddr) {
      const bal = getMaxBalance(daoTokens, tokenAddr);
      setTokenName(
        daoTokens.filter(token => token.value === tokenAddr)[0].name,
      );
      setBalance(bal);
    }
  }, [daoTokens, paymentToken]);

  return (
    <>
      <InputSelect {...props} selectName='paymentToken' options={daoTokens} />
      <Flex align='center'>
        <Icon m={2} as={RiInformationLine} />
        <Text fontSize='xs'>
          Service fee <b>2.5%</b>
          <br />
          You will receive{' '}
          <b>
            {orderPrice ? Number(orderPrice) * 0.975 : 0} {tokenName}
          </b>
        </Text>
      </Flex>
    </>
  );
};

export default PriceInput;
