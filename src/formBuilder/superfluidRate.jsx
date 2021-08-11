import React, { useEffect, useState } from 'react';
import { useToken } from '../contexts/TokenContext';

import GenericFormDisplay from './genericFormDisplay';
import InputSelect from './inputSelect';

const rates = [
  { name: 'one time', value: 1 },
  { name: 'per hour', value: 3600 },
  { name: 'per day', value: 3600 * 24 },
  { name: 'per week', value: 3600 * 24 * 7 },
  { name: 'per month', value: 3600 * 24 * 30 },
  { name: 'per year', value: 3600 * 24 * 365 },
];

const SuperfluidRate = props => {
  const { localForm } = props;
  const { watch, setValue, register } = localForm;
  const { currentDaoTokens } = useToken();
  const [perSecond, setPerSecond] = useState();
  const [baseRate, setBaseRate] = useState(rates[0].value);

  const superfluidRate = watch('superfluidRate');
  const paymentToken = watch('paymentToken');

  useEffect(() => {
    register('weiRatePerSec');
  }, []);

  useEffect(() => {
    if (superfluidRate && +superfluidRate > 0) {
      const newRate = parseFloat(+superfluidRate / +baseRate).toFixed(10);
      const selectedTokenDecimals = currentDaoTokens.find(token => {
        return token.tokenAddress === paymentToken;
      }).decimals;
      const weiRatePerSec = parseInt(
        (newRate * 10 ** +selectedTokenDecimals) / +baseRate,
      );

      console.log('selectedTokenDecimals', selectedTokenDecimals);

      console.log('newRate', newRate);
      setPerSecond(newRate);
      setValue('weiRatePerSec', weiRatePerSec);

      console.log('weiRatePerSec', weiRatePerSec);

      // TODO: some general validation on if the minion has a stream
      //    = maybe on minion select or paymentToken when it changes or minion changes
      // TODO: what/where are balances needed - in minion at all or just treasury
    }
  }, [superfluidRate, baseRate]);

  const handleBaseRateChange = e => {
    setBaseRate(e.target.options[e.target.options.selectedIndex].value);
  };

  return (
    <>
      <InputSelect
        {...props}
        selectName='paymentToken'
        options={rates}
        selectChange={handleBaseRateChange}
      />
      <GenericFormDisplay
        override={perSecond}
        localForm={localForm}
        label='Tokens Streamed Per Second'
        variant='value'
      />
    </>
  );
};
export default SuperfluidRate;
