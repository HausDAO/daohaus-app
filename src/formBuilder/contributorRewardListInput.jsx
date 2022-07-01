import React, { useEffect, useState } from 'react';
import { BigNumber, utils } from 'ethers';

import GenericTextArea from './genericTextArea';

const ContributorRewardListInput = props => {
  const { localForm } = props;
  const { register, watch, setValue } = localForm;
  const [displayTotal, setDisplayTotal] = useState();
  const [inputError, setInputError] = useState();

  const contributorRewardList = watch('contributorRewardList');
  const tokenAddress = watch('tokenAddress');
  const tokenDecimals = watch('selectedTokenDecimals');
  const tokenBalance = watch('selectedTokenBalance');

  const defaultDate = watch('unlockDate');

  useEffect(() => {
    register('userList');
    register('amountList');
    register('rewardTotal');
  }, []);

  useEffect(() => {
    const filterInput = (input, zeroPadding) => {
      const rawList = input?.split(/\r?\n/);
      const userList = [];
      const amountList = [];
      const dateList = [];
      let rewardTotal = BigNumber.from(0);

      rawList?.forEach(item => {
        const address = item.match(/0x[a-fA-F0-9]{40}/)?.[0];
        const rawAmount = item
          .replace(address, '')
          ?.match(/(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/)?.[0];
        const date = item
          .replace(rawAmount, '')
          ?.match(/(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/)?.[0];
        if (rawAmount) {
          try {
            const paddedAmount = utils.parseUnits(rawAmount, zeroPadding);
            userList.push(address);
            amountList.push(paddedAmount.toString());
            dateList.push(
              (
                parseInt(new Date(date).getTime() / 1000) || defaultDate
              ).toString(),
            );
            rewardTotal = rewardTotal.add(paddedAmount);
          } catch (err) {
            console.error(err);
          }
        }
      });

      if (
        userList?.length > 0 &&
        amountList?.length === userList.length &&
        dateList?.length === userList.length &&
        rewardTotal.gt(tokenBalance)
      ) {
        setValue('userList', null);
        setValue('amountList', null);
        setValue('dateList', null);
        setInputError('Total Exceeds Minion Balance!');
      } else if (
        userList?.length > 0 &&
        amountList?.length === userList.length &&
        dateList?.length === userList.length &&
        rewardTotal.gt(0)
      ) {
        const datesValid = dateList.reduce((acc, item) => {
          return acc && item && !isNaN(item) && item > 0;
        }, true);

        if (datesValid) {
          setInputError(null);
          setValue('userList', userList);
          setValue('amountList', amountList);
          setValue('dateList', dateList);
          setValue('rewardTotal', rewardTotal.toString());
          setDisplayTotal(utils.formatUnits(rewardTotal, zeroPadding));
        } else {
          setValue('userList', null);
          setValue('amountList', null);
          setValue('dateList', null);
          setInputError(
            'You must either set the Reward Unlock Date or provide an override date for each recipient',
          );
        }
      } else {
        setInputError(null);
        setValue('userList', null);
        setValue('amountList', null);
        setValue('dateList', null);
        setValue('rewardTotal', null);
        setDisplayTotal(null);
      }
    };

    if (tokenDecimals) filterInput(contributorRewardList, tokenDecimals);
  }, [
    contributorRewardList,
    tokenAddress,
    defaultDate,
    tokenBalance,
    tokenDecimals,
  ]);

  return (
    <GenericTextArea
      info='Accepts a distribution list where each line should have an address followed by a single amount followed by an optional unlock date override in the format yyyy/mm/dd. Addresses, amounts, and dates can be seperated by any form of delimeter.'
      {...props}
      helperText={inputError ?? (displayTotal && `Total: ${displayTotal}`)}
    />
  );
};

export default ContributorRewardListInput;
