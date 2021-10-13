import React from 'react';
import { Flex, Box, Spinner, Stack } from '@chakra-ui/react';

import TextBox from './TextBox';

const Loading = ({ message }) => (
  <Flex w='100%' justify='center' mt='15%'>
    <Stack spacing='20%' align='center'>
      {message && (
        <>
          <Box d={['none', 'none', 'block', 'block']}>
            <TextBox size='lg'>{message}</TextBox>
          </Box>
          <Box
            d={['block', 'block', 'none', 'none']}
            maxW='80%'
            m='auto'
            textAlign='center'
          >
            <TextBox>{message}</TextBox>
          </Box>
        </>
      )}
      <Spinner size='xl' color='secondary.400' />
    </Stack>
  </Flex>
);

export default Loading;
