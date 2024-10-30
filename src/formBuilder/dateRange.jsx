import React from 'react';
import { Flex } from '@chakra-ui/react';

import DateSelect from './dateSelect';
import FieldWrapper from './fieldWrapper';

const DateRange = props => {
  const { localForm } = props;
  const { watch } = localForm;
  const today = new Date();
  const startDate = watch('startDate');

  // remove label prop from date selects
  const { label: _l, ...selectProps } = props;

  return (
    <FieldWrapper {...props}>
      <Flex flexDir='row' justify='space-between'>
        <DateSelect
          {...selectProps}
          htmlFor='startDate'
          name='startDate'
          width='48%'
          placeholderText='Start DateTime'
          showTimeSelect
          minDate={today}
        />
        <DateSelect
          {...selectProps}
          htmlFor='endDate'
          name='endDate'
          width='48%'
          placeholderText='End DateTime'
          showTimeSelect
          minDate={new Date(startDate * 1000)}
        />
      </Flex>
    </FieldWrapper>
  );
};

export default DateRange;
