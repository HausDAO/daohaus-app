import React, { useState, useEffect } from 'react';
import {
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
  Tooltip,
} from '@chakra-ui/react';
import { RiInformationLine } from 'react-icons/ri';

import { useDao } from '../contexts/DaoContext';
import TextBox from '../components/TextBox';

const defaultTipLabel = 'Token streaming rate';
const rates = {
  '/one-off': 1,
  '/hour': 3600,
  '/day': 3600 * 24,
  '/week': 3600 * 24 * 7,
  '/month': 3600 * 24 * 30,
  '/year': 3600 * 24 * 365,
};

const RateInput = ({
  errors,
  formLabel = 'Rate',
  getValues,
  register,
  setValue,
  tokenAddress,
  tipLabel = defaultTipLabel,
}) => {
  const [ratePerSec, setRatePerSec] = useState(0);
  const [tokenData, setTokenData] = useState();
  const { daoOverview } = useDao();

  useEffect(() => {
    if (daoOverview && (!tokenData || tokenData.value !== tokenAddress)) {
      const depositTokenAddress = daoOverview.depositToken.tokenAddress;
      const depositToken = daoOverview.tokenBalances.find(
        token =>
          token.guildBank && token.token.tokenAddress === depositTokenAddress,
      );
      const tokenArray = daoOverview.tokenBalances.filter(
        token =>
          token.guildBank && token.token.tokenAddress !== depositTokenAddress,
      );
      tokenArray.unshift(depositToken);
      const activeToken = tokenArray.find(
        token => token.token.tokenAddress === tokenAddress,
      );
      if (activeToken) {
        setTokenData({
          label: activeToken.token.symbol || activeToken.tokenAddress,
          value: activeToken.token.tokenAddress,
          decimals: activeToken.token.decimals,
          balance: activeToken.tokenBalance,
        });
      }
    }
  }, [daoOverview, tokenAddress, tokenData]);

  useEffect(() => {
    //  This is deliberately duplicated to prevent
    //  any issue with stale state.

    const handleTokenRate = () => {
      const tokenRate = getValues('tokenRate');
      if (tokenRate && tokenRate > 0) {
        const baseRate = getValues('baseRate');
        const decimals = +tokenData.decimals;
        const weiRatePerSec = parseInt(
          (tokenRate * 10 ** decimals) / rates[baseRate],
        );
        const newRate = parseFloat(tokenRate / rates[baseRate]).toFixed(10);
        setRatePerSec(newRate);
        setValue('weiRatePerSec', weiRatePerSec);
      }
    };
    if (tokenData) {
      handleTokenRate();
    }
  }, [tokenData]);

  const getTokenRate = () => {
    const tokenRate = getValues('tokenRate');
    if (tokenRate && tokenRate > 0) {
      const baseRate = getValues('baseRate');
      const decimals = +tokenData.decimals;
      const weiRatePerSec = parseInt(
        (tokenRate * 10 ** decimals) / rates[baseRate],
      );
      const newRate = parseFloat(tokenRate / rates[baseRate]).toFixed(10);
      setRatePerSec(newRate);
      setValue('weiRatePerSec', weiRatePerSec);
    }
  };

  const handleChange = () => {
    if (tokenData) {
      getTokenRate();
    }
  };

  const validateRate = value => {
    if (value <= 0) {
      return 'Rate must be greater than zero';
    }
    return true;
  };

  return (
    <>
      <Tooltip hasArrow shouldWrapChildren label={tipLabel} placement='top'>
        <TextBox
          as={FormLabel}
          size='xs'
          d='flex'
          alignItems='center'
          htmlFor='tokenRate'
        >
          {formLabel}
          <RiInformationLine style={{ marginLeft: 5 }} />
        </TextBox>
      </Tooltip>
      <InputGroup>
        <Input
          id='tokenRate'
          name='tokenRate'
          placeholder='0'
          mb={5}
          ref={register({
            pattern: {
              required: true,
              value: /[0-9]/,
              message: `${formLabel} is required & must be a number`,
            },
            validate: validateRate,
          })}
          onChange={handleChange}
          color='white'
          focusBorderColor='secondary.500'
        />
        <InputRightAddon background='primary.500' p={0}>
          <Select
            name='baseRate'
            ref={register}
            onChange={handleChange}
            color='white'
            background='primary.500'
            w='100%'
            defaultValue='/month'
          >
            {' '}
            {Object.keys(rates).map((rate, idx) => (
              <option key={idx} value={rate}>
                {rate}
              </option>
            ))}
          </Select>
        </InputRightAddon>
      </InputGroup>
      <InputGroup>
        <Input
          name='weiRatePerSec'
          ref={register}
          style={{ display: 'none' }}
        />
        <Input
          // name='ratePerSec'
          // ref={register}
          value={ratePerSec}
          readOnly
          mb={5}
          color='white'
          background='primary.500'
          style={{ opacity: 1, pointerEvents: 'none' }}
        />
        <InputRightAddon background='primary.600'>per second</InputRightAddon>
      </InputGroup>

      <FormErrorMessage>
        {errors.tokenRate && errors.tokenRate.message}
      </FormErrorMessage>
    </>
  );
};

export default RateInput;
