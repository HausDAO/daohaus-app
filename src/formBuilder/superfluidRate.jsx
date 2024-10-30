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
  const rateString = watch('rateString');

  useEffect(() => {
    register('weiRatePerSec');
    register('rateString');
  }, []);

  useEffect(() => {
    if (superfluidRate && Number(superfluidRate) > 0) {
      const newRate = parseFloat(
        Number(superfluidRate) / Number(baseRate),
      ).toFixed(10);
      const selectedToken = currentDaoTokens.find(token => {
        return token.tokenAddress === paymentToken;
      });
      const weiRatePerSec = parseInt(
        (Number(superfluidRate) * 10 ** Number(selectedToken.decimals)) /
          Number(baseRate),
      );
      setPerSecond(`${newRate} ${selectedToken.symbol}/sec`);
      setValue(
        'rateString',
        `${superfluidRate} ${
          rates.find(r => r.value === Number(baseRate)).name
        }`,
      );
      setValue('weiRatePerSec', weiRatePerSec);
    } else {
      setValue('rateString', '');
    }
  }, [superfluidRate, baseRate]);

  const handleBaseRateChange = e => {
    setBaseRate(e.target.options[e.target.options.selectedIndex].value);
  };

  return (
    <>
      <InputSelect
        {...props}
        selectName='availableRates'
        options={rates}
        selectChange={handleBaseRateChange}
        disabled={!paymentToken}
      />
      {rateString && (
        <GenericFormDisplay
          override={perSecond}
          localForm={localForm}
          label='Rate:'
          name='streamedPerSecond'
          variant='value'
        />
      )}
    </>
  );
};
export default SuperfluidRate;
