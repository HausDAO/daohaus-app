import React from 'react';
import { Flex, Spinner } from '@chakra-ui/react';
import Icon from '@chakra-ui/icon';

import { BsCheckCircle } from 'react-icons/bs';
import { BiErrorCircle } from 'react-icons/bi';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import TextBox from './TextBox';
import ExplorerLink from './explorerLink';

const defaultIndicatorStates = {
  loading: {
    spinner: true,
    title: 'Submitting...',
    explorerLink: true,
  },
  success: {
    icon: BsCheckCircle,
    title: 'Form Submitted',
    explorerLink: true,
  },
  error: {
    icon: BiErrorCircle,
    title: 'Error Submitting Transaction',
    errorMessage: true,
  },
};

const ProgressIndicator = ({
  states = defaultIndicatorStates,
  currentState,
  txHash,
  message,
  description,
}) => {
  const { theme } = useCustomTheme();
  const { injectedChain } = useInjectedProvider();

  const currentUI = states?.[currentState];
  const msgText = message || description || currentUI?.fallbackText;

  if (!currentUI) return null;

  return (
    <Flex
      border={`2px ${theme.colors.secondary[500]} solid`}
      borderRadius='md'
      p={3}
      flexDir='column'
      mb={3}
    >
      <Flex>
        {currentUI?.spinner && <Spinner mr={3} />}
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
