import React, { useEffect, useState } from 'react';
import { RiInformationLine } from 'react-icons/ri';
import { Flex, Icon, Text } from '@chakra-ui/react';

import { useDao } from '../contexts/DaoContext';
import InputSelect from './inputSelect';
import ModButton from './modButton';
import { handleDecimals } from '../utils/general';
import { addZeros } from '../utils/tokenValue';

const getMaxBalance = (tokenData, tokenAddress) => {
  //  Uses token select data structure
  const token = tokenData.find(t => t.value === tokenAddress);

  if (token) {
    return handleDecimals(token.balance, token.decimals);
  }
};

const SellOrderFees = ({ orderPrice, serviceFeePercentage, tokenName }) => {
  return (
    <Flex align='center'>
      <Icon m={2} as={RiInformationLine} />
      <Text fontSize='xs'>
        Service fee <b>{`${serviceFeePercentage}%`}</b>
        <br />
        You will receive{' '}
        <b>
          {orderPrice
            ? Number(orderPrice) * (1 - serviceFeePercentage / 100)
            : 0}{' '}
          {tokenName}
        </b>
      </Text>
    </Flex>
  );
};

// TODO: calculate fees using Rarible SDK
// Source: https://github.com/rarible/protocol-ethereum-sdk/blob/d340e34d510e441edf3645f0942deab36c2d2738/packages/protocol-ethereum-sdk/src/order/fill-order/rarible-v2.ts#L86
const BuyOrderFees = ({
  orderPrice,
  originFeePercentage = 0,
  protocolFeePercentage = 0,
  tokenName,
}) => {
  const totalFees = protocolFeePercentage + originFeePercentage;
  return (
    <Flex align='center'>
      <Icon m={2} as={RiInformationLine} />
      <Text fontSize='xs'>
        Buy Fees: Protocol (<b>{`${protocolFeePercentage}`}%</b>) + Origin (
        <b>{`${originFeePercentage}`}%</b>) Fees
        <br />
        You will pay{' '}
        <b>
          {orderPrice ? Number(orderPrice) * (1 + totalFees / 100) : 0}{' '}
          {tokenName}
        </b>
      </Text>
    </Flex>
  );
};

const PriceInput = props => {
  const { daoOverview } = useDao();
  const { localForm, orderType } = props;
  const { getValues, register, setValue, watch } = localForm;

  const [tokenName, setTokenName] = useState();
  const [daoTokens, setDaoTokens] = useState([]);
  const [balance, setBalance] = useState(null);

  const paymentToken = watch('paymentToken');
  const orderPrice = watch('orderPrice');

  const maxBtnDisplay =
    (balance !== '--' && balance) || balance === 0
      ? `Max: ${balance.toFixed(4)}`
      : 'Error: Not found.';

  // TODO: get fees from protocol contracts
  const protocolFeePerc = 0;
  const originFeePerc = 0;
  const serviceFeePerc = 2.5;

  useEffect(() => {
    register('market');
    register('orderType');
    register('totalOrderPrice');
    setValue('market', 'Rarible');
    setValue('orderType', orderType || 'sell');
  }, []);

  useEffect(() => {
    const currentToken = daoOverview.tokenBalances.find(token => {
      return token.token.tokenAddress === paymentToken;
    });
    if (currentToken && orderPrice) {
      const finalOrderPrice = addZeros(
        orderType === 'buy'
          ? (() => {
              const totalFees = protocolFeePerc + originFeePerc;
              return Number(orderPrice) * (1 + totalFees / 100);
            })()
          : orderPrice,
        currentToken.token.decimals,
      );
      setValue('totalOrderPrice', finalOrderPrice);
    }
  }, [orderPrice, paymentToken]);

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

  const setMax = () => {
    setValue('orderPrice', balance);
  };

  return (
    <>
      <InputSelect
        {...props}
        selectName='paymentToken'
        options={daoTokens}
        btn={
          orderType === 'buy' && <ModButton text={maxBtnDisplay} fn={setMax} />
        }
      />
      {(!orderType || orderType === 'sell') && (
        <SellOrderFees
          serviceFeePercentage={serviceFeePerc}
          orderPrice={orderPrice}
          tokenName={tokenName}
        />
      )}
      {orderType === 'buy' && (
        <BuyOrderFees
          orderPrice={orderPrice}
          originFeePercentage={originFeePerc}
          protocolFeePercentage={protocolFeePerc}
          tokenName={tokenName}
        />
      )}
    </>
  );
};

export default PriceInput;
