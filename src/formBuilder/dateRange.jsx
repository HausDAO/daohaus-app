import React from 'react';
import { Flex, Input, Text } from '@chakra-ui/react';

const DateRange = props => {
  return (
    <Flex mt={5} mb={5}>
      <Input
        flex={1}
        /* type='datetime-local' */
        placeholder='Start DateTime'
        mr={5}
      />
      <Input
        flex={1}
        /* type='datetime-local' */
        placeholder='End DateTime'
        /* color='black' */
        /* borderColor='black' */
        /* filter='invert(1)' */
      />
    </Flex>
  );
};

export default DateRange;
