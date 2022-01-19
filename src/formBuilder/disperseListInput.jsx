import React, { useEffect, useState } from 'react';
import { BigNumber, utils } from 'ethers';

import { useDao } from '../contexts/DaoContext';
import { useFormConditions } from '../utils/formBuilder';
import GenericTextArea from './genericTextArea';

const DisperseListInput = props => {
  const { daoOverview } = useDao();
  const { localForm, formCondition, disperseType } = props;
  const { register, watch, setValue } = localForm;
  const [displayTotal, setDisplayTotal] = useState();

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
        disperseTotal > 0
      ) {
        setValue('userList', userList);
        setValue('amountList', amountList);
        setValue('disperseTotal', disperseTotal.toString());
        setDisplayTotal(utils.formatUnits(disperseTotal, zeroPadding));
      } else {
        setValue('userList', null);
        setValue('amountList', null);
        setValue('disperseTotal', null);
        setDisplayTotal(null);
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
      helperText={displayTotal && `Total: ${displayTotal}`}
    />
  );
};

export default DisperseListInput;
