import React, { useEffect } from 'react';

import { useDao } from '../contexts/DaoContext';
import { useFormConditions } from '../utils/formBuilder';
import GenericTextArea from './genericTextArea';
import { addZeros } from '../utils/tokenValue';

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
        const rawAmount = item.match(
          /(?<=(0x[a-fA-F0-9]{40}).)([0-9]+).*([0-9]*)/,
        )?.[0];
        if (rawAmount) {
          const paddedAmount = Number(addZeros(rawAmount, zeroPadding));
          userList.push(item.match(/0x[a-fA-F0-9]{40}/)?.[0]);
          amountList.push(paddedAmount.toString());
          disperseTotal += paddedAmount;
        }
      });

      if (
        userList?.length > 0 &&
        amountList?.length === userList.length &&
        disperseTotal > 0
      ) {
        setValue('userList', userList);
        setValue('amountList', amountList);
        setValue('disperseTotal', disperseTotal.toString());
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
