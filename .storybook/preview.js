import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { createTheme } from '../src/themes/theme';

const memory = (StoryFn) => (
  <MemoryRouter initialEntries={['/']}>
    <StoryFn />
  </MemoryRouter>);

const themeWrapper = (storyFn) => {
  return (
    <ChakraProvider theme={createTheme({})}>
      <Box p={3}>
        {storyFn()}
      </Box>
    </ChakraProvider>
  )
};

export const decorators = [
  memory,
  themeWrapper,
]

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};
