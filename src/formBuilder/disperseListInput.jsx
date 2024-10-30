import React, { useEffect, useState } from 'react';
import { BigNumber, utils } from 'ethers';
import { Spinner } from '@chakra-ui/react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useFormConditions } from '../utils/formBuilder';
import GenericTextArea from './genericTextArea';

const DisperseListInput = props => {
  const { localForm, localValues, formCondition, disperseType } = props;
  const { register, watch, setValue } = localForm;
  const [loading, setLoading] = useState(false);
  const [availableBalance, setAvailableBalance] = useState();
  const [displayTotal, setDisplayTotal] = useState();
  const [inputError, setInputError] = useState();

  const { injectedProvider } = useInjectedProvider();
  const [fundingType] = useFormConditions({
    values: [disperseType],
    condition: formCondition,
  });
  const disperseList = watch('disperseList');
  const tokenAddress = watch('tokenAddress');
  const tokenDecimals = watch('selectedTokenDecimals');
  const tokenBalance = watch('selectedTokenBalance');
  const selectedSafeAddress =
    localValues?.safeAddress || watch('selectedSafeAddress');

  useEffect(() => {
    register('userList');
    register('amountList');
    register('disperseTotal');
  }, []);

  useEffect(() => {
    const getVaultBalance = async () => {
      setLoading(true);
      setAvailableBalance(
        fundingType === 'eth'
          ? await injectedProvider.eth.getBalance(selectedSafeAddress)
          : tokenAddress
          ? tokenBalance
          : BigNumber.from(0),
      );
      setLoading(false);
    };
    if (selectedSafeAddress) {
      getVaultBalance();
    }
  }, [fundingType, selectedSafeAddress, tokenAddress, tokenBalance]);

  useEffect(() => {
    const filterInput = async (input, zeroPadding) => {
      const rawList = input?.split(/\r?\n/);
      const userList = [];
      const amountList = [];
      let disperseTotal = BigNumber.from(0);

      rawList.forEach(item => {
        const address = item.match(/0x[a-fA-F0-9]{40}/)?.[0];
        const rawAmount = item
          .replace(address, '')
          ?.match(/(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/)?.[0];
        if (rawAmount) {
          try {
            const paddedAmount = utils.parseUnits(rawAmount, zeroPadding);
            userList.push(address);
            amountList.push(paddedAmount.toString());
            disperseTotal = disperseTotal.add(paddedAmount);
          } catch (err) {
            console.error(err);
          }
        }
      });

      if (
        userList?.length > 0 &&
        amountList?.length === userList.length &&
        disperseTotal.gt(availableBalance)
      ) {
        setValue('userList', null);
        setValue('amountList', null);
        setInputError('Total Exceeds Minion Balance!');
      } else if (
        userList?.length > 0 &&
        amountList?.length === userList.length &&
        disperseTotal.gt(0)
      ) {
        setInputError(null);
        setValue('userList', userList);
        setValue('amountList', amountList);
        setValue('disperseTotal', disperseTotal.toString());
        setDisplayTotal(utils.formatUnits(disperseTotal, zeroPadding));
      } else {
        setInputError(null);
        setValue('userList', null);
        setValue('amountList', null);
        setValue('disperseTotal', null);
        setDisplayTotal(null);
      }
    };

    if (disperseList && availableBalance) {
      if (fundingType === 'token' && !tokenAddress) {
        setInputError('Please Select a Token First!');
      } else {
        filterInput(disperseList, fundingType === 'token' ? tokenDecimals : 18);
      }
    } else {
      setInputError(null);
    }
  }, [disperseList, availableBalance]);

  return (
    <GenericTextArea
      info='Accepts a distribution list where each line should have an address followed by a single amount. Addresses and amounts can be seperated by any form of delimeter.'
      {...props}
      helperText={
        loading ? (
          <Spinner size='xs' />
        ) : (
          inputError ?? (displayTotal && `Total: ${displayTotal}`)
        )
      }
    />
  );
};

export default DisperseListInput;
