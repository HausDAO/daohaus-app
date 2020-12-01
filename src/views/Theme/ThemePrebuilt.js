import React from 'react';
import { Box, ButtonGroup, Flex, Button } from '@chakra-ui/react';

import {
  mcvTheme,
  raidGuildTheme,
  yearnTheme,
} from '../../themes/theme-defaults';

const ThemePrebuilt = ({ handleThemeUpdate }) => {
  const handleUpdate = (values) => {
    handleThemeUpdate(values);
  };

  return (
    <Flex justify='center' direction='column'>
      <Box fontSize='xl' fontFamily='heading' textAlign='center'>
        Pre-built
      </Box>
      <Flex justify='center'>
        <ButtonGroup>
          <Button
            onClick={() => handleUpdate(raidGuildTheme)}
            bg='#ff3864'
            border='1px solid #ff3864'
            _hover={{
              color: '#ff3864',
              bg: 'black',
              border: '1px solid #ff3864',
            }}
          >
            RaidGuild
          </Button>
          <Button
            onClick={() => handleUpdate(mcvTheme)}
            bg='black'
            border='1px solid #C93C4F'
            _hover={{ bg: '#C93C4F', border: '1px solid black' }}
          >
            MCV
          </Button>
          <Button
            onClick={() => handleUpdate(yearnTheme)}
            bg='#007bff'
            border='1px solid white'
            _hover={{
              color: '#007bff',
              bg: 'white',
              border: '1px solid #007bff',
            }}
          >
            Yearn
          </Button>
        </ButtonGroup>
      </Flex>
    </Flex>
  );
};

export default ThemePrebuilt;
