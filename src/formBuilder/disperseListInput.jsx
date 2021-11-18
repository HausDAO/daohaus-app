import React, { useEffect } from 'react';

import { useDao } from '../contexts/DaoContext';
import GenericTextArea from './genericTextArea';
import { addZeros } from '../utils/tokenValue';

const DisperseListInput = props => {
  const { daoOverview } = useDao();
  const { localForm } = props;
  const { register, watch, setValue } = localForm;

  const disperseList = watch('disperseList');
  const tokenAddress = watch('tokenAddress');

  useEffect(() => {
    register('userList');
    register('amountList');
    register('disperseTotal');
  }, []);

  useEffect(() => {
    if (disperseList && tokenAddress) {
      const currentToken = daoOverview.tokenBalances.find(token => {
        return (
          token.token.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()
        );
      });

      if (currentToken?.token?.decimals) {
        const rawList = disperseList?.split(/\r?\n/);
        const userList = [];
        const amountList = [];
        let disperseTotal = 0;

        rawList.forEach(item => {
          const rawAmount = item.match(
            /(?<=(0x[a-fA-F0-9]{40}).)([0-9]+).*([0-9]*)/,
          )?.[0];
          if (rawAmount) {
            const paddedAmount = Number(
              addZeros(rawAmount, currentToken.token.decimals),
            );
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
      }
    }
  }, [disperseList, tokenAddress]);

  return <GenericTextArea {...props} />;
};

export default DisperseListInput;
