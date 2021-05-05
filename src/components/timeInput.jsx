import {
  Flex,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { calcSeconds } from '../utils/general';

const units = [
  { name: 'Seconds', value: 'seconds' },
  { name: 'Minutes', value: 'minutes' },
  { name: 'Hours', value: 'hours' },
  { name: 'Days', value: 'days' },
  { name: 'Weeks', value: 'weeks' },
];

const TimeInput = ({
  register,
  errors,
  watch,
  setError,
  setTimePeriod,
  clearErrors,
  inputName,
  label,
  displayTotalSeconds = true,
}) => {
  const [unitDisplay, setUnitDisplay] = useState('seconds');
  const [totalSeconds, setTotalSeconds] = useState(null);
  const currentUnit = watch('units');
  const amt = watch(inputName);

  useEffect(() => {
    if (amt && isNaN(amt)) {
      setError('enforceNumber', {
        type: 'manual',
        message: 'Must be a number',
      });
    } else {
      clearErrors(['enforceNumber']);
    }
    if (currentUnit) {
      setUnitDisplay(currentUnit);
    }
    if (currentUnit && amt && !errors.enforceNumber) {
      const seconds = calcSeconds(amt, currentUnit);
      setTimePeriod(seconds);
      console.log(seconds);
      setTotalSeconds(seconds);
    } else {
      setTimePeriod(0);
      setTotalSeconds(null);
    }
  }, [currentUnit, amt]);

  const shouldDisplayTotalSeconds =
    totalSeconds > 0 && currentUnit !== 'seconds' && displayTotalSeconds;

  const defaultLabel = `How many ${unitDisplay} per period?`;
  return (
    <Flex flexDir='column'>
      {label || defaultLabel}
      <InputGroup>
        <Input
          className='inline-field'
          name={inputName}
          ref={register({
            required: true,
            pattern: /^-?\d*\.?\d*$/,
          })}
        />
        <InputRightAddon background='primaryAlpha' p={0}>
          <Select width='100%' ref={register} border='none' name='units'>
            {units.map(unit => (
              <option key={unit.value} value={unit.value}>
                {unit.name}
              </option>
            ))}
          </Select>
        </InputRightAddon>
      </InputGroup>
      {shouldDisplayTotalSeconds && (
        <Text color='whiteAlpha.600'>
          TotalSeconds:
          {totalSeconds}
        </Text>
      )}
      {errors.periodDuration?.type === 'required' && (
        <span className='required-field'>required</span>
      )}
      {errors.enforceNumber && (
        <span className='required-field'>{errors.enforceNumber.message}</span>
      )}
    </Flex>
  );
};

export default TimeInput;
