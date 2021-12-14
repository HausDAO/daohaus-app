import React, { useEffect } from 'react';

import { useDao } from '../contexts/DaoContext';
import { useFormConditions } from '../utils/formBuilder';
import GenericTextArea from './genericTextArea';
import { safeAddZeros, fixScientificNotation } from '../utils/tokenValue';

const DisperseListInput = props => {
  const { daoOverview } = useDao();
  const { localForm, formCondition, disperseType } = props;
  const { register, watch, setValue } = localForm;

  const [fundingType] = useFormConditions({
    values: [disperseType],
    condition: formCondition,
  });
  const disperseList = watch('disperseList');
  const tokenAddress = watch('tokenAddress');

  useEffect(() => {
    register('userList');
    register('amountList');
    register('disperseTotal');
  }, []);

  useEffect(() => {
    const filterInput = (input, zeroPadding) => {
      const rawList = input?.split(/\r?\n/);
      const userList = [];
      const amountList = [];
      let disperseTotal = 0;

      rawList.forEach(item => {
        const address = item.match(/0x[a-fA-F0-9]{40}/)?.[0];
        const rawAmount = item
          .replace(address, '')
          ?.match(/(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/)?.[0];
        if (rawAmount) {
          try {
            const paddedAmount = safeAddZeros(Number(rawAmount), zeroPadding);
            userList.push(address);
            amountList.push(paddedAmount);
            disperseTotal += Number(paddedAmount);
          } catch (err) {
            console.error(err);
          }
        }
      });

      if (
        userList?.length > 0 &&
        amountList?.length === userList.length &&
        disperseTotal > 0
      ) {
        setValue('userList', userList);
        setValue('amountList', amountList);
        setValue('disperseTotal', fixScientificNotation(disperseTotal));
      }
    };

    if (disperseList && fundingType === 'token' && tokenAddress) {
      const currentToken = daoOverview.tokenBalances.find(token => {
        return (
          token.token.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()
        );
      });

      if (currentToken?.token?.decimals) {
        filterInput(disperseList, currentToken.token.decimals);
      }
    } else if (disperseList && fundingType === 'eth') {
      filterInput(disperseList, 18);
    }
  }, [disperseList, tokenAddress, fundingType]);

  return (
    <GenericTextArea
      info='Accepts a distribution list where each line should have an address followed by a single amount. Addresses and amounts can be seperated by any form of delimeter.'
      {...props}
    />
  );
};

export default DisperseListInput;
