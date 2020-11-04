import React from 'react';
import { Button } from '@chakra-ui/core';
import { useTheme } from '../contexts/PokemolContext';

export const PrimaryButton = ({ onClick, children, ...others }) => {
  const [theme] = useTheme();

  return (
    <Button
      onClick={onClick}
      bg={theme.colors.brand[500]}
      textTransform='uppercase'
      fontWeight='400'
      px={25}
      _hover={{ bg: theme.colors.brand[400] }}
      _active={{
        bg: theme.colors.brand[400],
      }}
      _focus={{
        boxShadow: '0 0 1px 2px' + theme.colors.background[500],
        outline: 'none',
      }}
      {...others}
    >
      {children}
    </Button>
  );
};

export const SecondaryButton = ({ onClick, children, ...others }) => {
  const [theme] = useTheme();

  return (
    <Button
      onClick={onClick}
      bg='transparent'
      border={`1px solid ${theme.colors.brand[500]}`}
      color={theme.colors.brand[500]}
      textTransform='uppercase'
      px={15}
      _hover={{
        bg: 'transparent',
        color: theme.colors.brand[400],
        borderColor: theme.colors.brand[400],
      }}
      _active={{
        bg: theme.colors.brand[400],
      }}
      _focus={{
        boxShadow: '0 0 1px 2px' + theme.colors.background[500],
      }}
      {...others}
    >
      {children}
    </Button>
  );
};
