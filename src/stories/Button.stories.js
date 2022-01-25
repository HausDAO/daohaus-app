import React from 'react';
import { Flex, Button as ChakraButton, HStack } from '@chakra-ui/react';

const Button = args => (
  <Flex as={HStack} spacing={2}>
    <ChakraButton variant='primary' {...args}>
      {args.label}
    </ChakraButton>
    <ChakraButton variant='outline'>{args.label}</ChakraButton>
  </Flex>
);

Button.args = {
  label: 'Test',
};

export default {
  title: 'Atoms/Button',
};

export { Button };
