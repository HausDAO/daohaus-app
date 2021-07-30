import React, { useState, useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import DateSelect from '../components/dateSelect';
import FieldWrapper from './fieldWrapper';

const DateRange = ({ maxDays }) => {
  const today = new Date();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState();
  const [maxDate, setMaxDate] = useState();

  useEffect(() => {
    if (!startDate) {
      setMaxDate(null);
    } else {
      const newDate = new Date(startDate);
      newDate.setDate(newDate.getDate() + maxDays);
      setMaxDate(newDate);
    }
  }, [startDate]);

  return (
    <FieldWrapper>
      <Flex flexDir='row' justify='space-between'>
        <DateSelect
          width='48%'
          placeholderText='Start DateTime'
          showTimeInput
          selected={startDate}
          onChange={date => {
            setStartDate(date);
          }}
          minDate={today}
        />
        <DateSelect
          width='48%'
          placeholderText='End DateTime'
          showTimeInput
          selected={endDate}
          onChange={date => {
            setEndDate(date);
          }}
          minDate={startDate}
          maxDate={maxDate}
        />
      </Flex>
    </FieldWrapper>
  );
};

export default DateRange;
