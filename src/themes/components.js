import React from 'react';
import { Button } from '@chakra-ui/core';

import { useTheme } from '../contexts/PokemolContext';

export const PrimaryButton = ({ onClick, children, ...others }) => {
  const [theme] = useTheme();

  return (
    <Button
      onClick={onClick}
      background={theme.colors.brand[50]}
      textTransform='uppercase'
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
      background='transparent'
      border={`1px solid ${theme.colors.brand[50]}`}
      color={theme.colors.brand[50]}
      textTransform='uppercase'
      {...others}
    >
      {children}
    </Button>
  );
};
