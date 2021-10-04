import React, { useEffect, useState } from 'react';
import { useToken } from '../contexts/TokenContext';

import GenericFormDisplay from './genericFormDisplay';
import InputSelect from './inputSelect';

const rates = [
  // { name: 'one time', value: 1 },
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
    register('rateString');
  }, []);

  useEffect(() => {
    if (superfluidRate && +superfluidRate > 0) {
      const newRate = parseFloat(+superfluidRate / +baseRate).toFixed(10);
      const selectedTokenDecimals = currentDaoTokens.find(token => {
        return token.tokenAddress === paymentToken;
      }).decimals;
      const weiRatePerSec = parseInt(
        (+superfluidRate * 10 ** +selectedTokenDecimals) / +baseRate,
      );
      setPerSecond(newRate);
      setValue(
        'rateString',
        `${superfluidRate} ${rates.find(r => r.value === +baseRate).name}`,
      );
      setValue('weiRatePerSec', weiRatePerSec);
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
