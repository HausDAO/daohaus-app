import React from 'react';
import { Flex } from '@chakra-ui/layout';
import { BsCheckCircle } from 'react-icons/bs';
import Icon from '@chakra-ui/icon';

import { Spinner } from '@chakra-ui/react';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import TextBox from './TextBox';
import ExplorerLink from './explorerLink';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

const ProgressIndicator = ({
  states,
  currentState,
  txHash,
  message,
  description,
  fallbackText,
}) => {
  const { theme } = useCustomTheme();
  const { injectedChain } = useInjectedProvider();

  const currentUI = states?.[currentState];
  const msgText = message || description || fallbackText;

  if (!currentUI) return null;

  return (
    <Flex
      border={`2px ${theme.colors.secondary[500]} solid`}
      borderRadius='md'
      p={3}
      flexDir='column'
    >
      <Flex>
        {currentUI?.spinner && <Spinner />}
        {currentUI?.icon && (
          <Icon mr={3} as={currentUI.icon} h='25px' w='25px' />
        )}
        {currentUI?.title && (
          <TextBox variant='body'>{currentUI.title}</TextBox>
        )}
        {currentUI?.explorerLink && injectedChain && txHash && (
          <ExplorerLink
            chainID={injectedChain?.id}
            isIconLink
            type='tx'
            hash={txHash}
          />
        )}
      </Flex>
      {msgText && (
        <TextBox variant='body' size='xs'>
          {msgText}
        </TextBox>
      )}
    </Flex>
  );
};
export default ProgressIndicator;
