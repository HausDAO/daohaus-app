import React, { useState } from 'react';
import { Flex, Box, Input, Text } from '@chakra-ui/react';
import DateSelect from '../components/dateSelect';
import FieldWrapper from './fieldWrapper';

const DateRange = props => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  return (
    <FieldWrapper>
      <Flex flexDir='row' justify='space-between'>
        <DateSelect
          width='48%'
          placeholderText='Start DateTime'
          showTimeInput
          selected={startDate}
          onChange={date => {
            console.log(date);
            setStartDate(date);
          }}
          minDate={new Date()}
        />
        <DateSelect
          width='48%'
          placeholderText='End DateTime'
          showTimeInput
          selected={endDate}
          onChange={date => {
            setEndDate(date);
          }}
        />
      </Flex>
    </FieldWrapper>
  );
};

export default DateRange;
