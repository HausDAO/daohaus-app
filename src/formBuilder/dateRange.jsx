import React from 'react';
import { Flex } from '@chakra-ui/react';
import DateSelect from './dateSelect';
import FieldWrapper from './fieldWrapper';

const DateRange = props => {
  const { localForm } = props;
  const { watch } = localForm;
  const today = new Date();
  const startDate = watch('startDate');

  return (
    <FieldWrapper {...props}>
      <Flex flexDir='row' justify='space-between'>
        <DateSelect
          {...props}
          htmlFor='startDate'
          name='startDate'
          width='48%'
          placeholderText='Start DateTime'
          showTimeSelect
          minDate={today}
        />
        <DateSelect
          {...props}
          htmlFor='endDate'
          name='endDate'
          width='48%'
          placeholderText='End DateTime'
          showTimeSelect
          minDate={new Date(startDate)}
        />
      </Flex>
    </FieldWrapper>
  );
};

export default DateRange;
