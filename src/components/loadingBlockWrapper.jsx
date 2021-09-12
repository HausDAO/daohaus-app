import { Flex } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import React from 'react';
import TextBox from './TextBox';

const LoadingBlockWrapper = ({
  currentState,
  loadingContent = 'Processing...',
  successContent = 'Success',
  errorContent = 'Error',
  children,
}) => {
  if (currentState === 'loading') {
    return (
      <Flex>
        <Flex alignItems='center'>
          <Spinner />
          <TextBox>{loadingContent}</TextBox>
        </Flex>
      </Flex>
    );
  }
  if (currentState === 'error') {
    return (
      <Flex>
        <TextBox>{errorContent}</TextBox>
      </Flex>
    );
  }
  if (successContent === 'success') {
    return (
      <Flex>
        <TextBox>{errorContent}</TextBox>
      </Flex>
    );
  }
  return children;
};

export default LoadingBlockWrapper;
