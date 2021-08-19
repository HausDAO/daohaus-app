import React, { useEffect } from 'react';
import { Flex, Text, Box } from '@chakra-ui/react';
import { useParams } from 'react-router';

import PaymentInput from './paymentInput';

const BuyoutPaymentInput = props => {
  const { localForm } = props;
  const { setValue, watch, register } = localForm;

  return (
    <Flex direction='column'>
      <Box
        borderColor='mode.900'
        borderStyle='solid'
        borderWidth='1px'
        borderRadius={8}
        padding={4}
        marginBottom={4}
        marginTop={4}
      >
        <Text fontSize='sm' fontFamily='heading' color='mode.900'>
          Your Shares and Loot
        </Text>
        <Text fontSize='xs' fontFamily='mono' color='mode.200' marginBottom={4}>
          {1020} ({1.5}% of total)
        </Text>
        <Text fontSize='sm' fontFamily='heading' color='mode.900'>
          Estimated Exit Value on Ragequit
        </Text>
        <Text fontSize='xs' fontFamily='mono' color='mode.200'>
          {300} DAI
        </Text>
      </Box>
      <PaymentInput {...props} />
      <Text color='secondary.500' fontFamily='heading' fontSize='sm'>
        ! IF the proposal passes, the Funds will only be available after you
        ragequit
      </Text>
    </Flex>
  );
};
export default BuyoutPaymentInput;
