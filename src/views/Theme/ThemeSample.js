import React, { useEffect, useState } from 'react';
import {
  Box,
  ButtonGroup,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  Button,
} from '@chakra-ui/core';

import { useTheme } from '../../contexts/CustomThemeContext';
import BrandOverride from '../../assets/themes/raidTheme/raidguild__swords.svg';
import BgOverride from '../../assets/themes/raidTheme/raid__fantasy--bg.jpg';

const ThemeSample = () => {
  const [theme, setTheme] = useTheme();
  const [themeValues, setThemeValues] = useState({
    primary500: theme.colors.primary[500],
    secondary500: theme.colors.secondary[500],
    bg500: theme.colors.background[500],
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    e.persist();
    setThemeValues((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleReset = () => {
    setTheme();
  };

  const handleSet = () => {
    setTheme({
      primary500: themeValues.primary500 || '#e50651',
      secondary500: themeValues.secondary500 || '#6153ff',
      bg500: themeValues.bg500 || '#121212',
      brandImg: BrandOverride,
      bgImg: BgOverride,
      bgOverlayOpacity: '0.5',
      primaryFont: 'Space Mono', // only temporary
      bodyFont: 'Rubik',
      daoMeta: {
        proposals: 'Quests',
        proposal: 'Quest',
        bank: 'Inventory',
        members: 'Players',
        member: 'Player',
        discord: 'https://discord.gg/WqwQGgeeFd',
        medium: '',
        telegram: '',
        website: '',
        other: '',
      },
    });
  };

  console.log('themeValue', themeValues);

  return (
    <>
      <Flex>
        <Box variant='standard'>Content</Box>
      </Flex>
      <Flex direction='column'>
        <Flex direction='row' w='100%' my={6} align='center'>
          <Text>Inputs</Text>
          <InputGroup>
            <InputLeftAddon bg='primary.500'>primary.500</InputLeftAddon>
            <Input
              name='primary500'
              defaultValue={theme.colors.primary[500]}
              onChange={handleChange}
            />
          </InputGroup>
          <InputGroup>
            <InputLeftAddon bg='secondary.500'>secondary.500</InputLeftAddon>
            <Input
              name='secondary500'
              defaultValue={theme.colors.secondary[500]}
              onChange={handleChange}
            />
          </InputGroup>
          <InputGroup>
            <InputLeftAddon bg='bg.500'>background.500</InputLeftAddon>
            <Input
              name='bg500'
              defaultValue={theme.colors.background[500]}
              onChange={handleChange}
            />
          </InputGroup>
        </Flex>
        <Flex direction='row' w='100%' my={6} align='center'>
          <Text>Buttons</Text>
          <ButtonGroup>
            <Button onClick={handleSet}>Change (Base)</Button>
            <Button onClick={handleReset} mb={3} variant='outline'>
              Reset (Outline)
            </Button>
            <Button onClick={handleReset} mb={3} variant='primary'>
              Reset (Primary)
            </Button>
          </ButtonGroup>
        </Flex>
      </Flex>
      <Flex>
        <Flex direction='column' p={6}>
          <h3 fontSize='l'>Primary</h3>
          <Box w='200px' bg='primary.50' p={6}>
            <Text>primary[50]</Text>
          </Box>
          <Box w='200px' bg='primary.100' p={6}>
            <Text>primary[100]</Text>
          </Box>
          <Box w='200px' bg='primary.200' p={6}>
            <Text>primary[200]</Text>
          </Box>
          <Box w='200px' bg='primary.300' p={6}>
            <Text>primary[300]</Text>
          </Box>
          <Box w='200px' bg='primary.400' p={6}>
            <Text>primary[400]</Text>
          </Box>
          <Box w='200px' bg='primary.500' p={6}>
            <Text>primary[500]</Text>
          </Box>
          <Box w='200px' bg='primary.600' p={6}>
            <Text>primary[600]</Text>
          </Box>
          <Box w='200px' bg='primary.700' p={6}>
            <Text>primary[700]</Text>
          </Box>
          <Box w='200px' bg='primary.800' p={6}>
            <Text>primary[800]</Text>
          </Box>
          <Box w='200px' bg='primary.900' p={6}>
            <Text>primary[900]</Text>
          </Box>
        </Flex>
        <Flex direction='column' p={6}>
          <h3 fontSize='l'>Secondary</h3>
          <Box w='200px' bg='secondary.50' p={6}>
            <Text>secondary[50]</Text>
          </Box>
          <Box w='200px' bg='secondary.100' p={6}>
            <Text>secondary[100]</Text>
          </Box>
          <Box w='200px' bg='secondary.200' p={6}>
            <Text>secondary[200]</Text>
          </Box>
          <Box w='200px' bg='secondary.300' p={6}>
            <Text>secondary[300]</Text>
          </Box>
          <Box w='200px' bg='secondary.400' p={6}>
            <Text>secondary[400]</Text>
          </Box>
          <Box w='200px' bg='secondary.500' p={6}>
            <Text>secondary[500]</Text>
          </Box>
          <Box w='200px' bg='secondary.600' p={6}>
            <Text>secondary[600]</Text>
          </Box>
          <Box w='200px' bg='secondary.700' p={6}>
            <Text>secondary[700]</Text>
          </Box>
          <Box w='200px' bg='secondary.800' p={6}>
            <Text>secondary[800]</Text>
          </Box>
          <Box w='200px' bg='secondary.900' p={6}>
            <Text>secondary[900]</Text>
          </Box>
        </Flex>
        <Flex direction='column' p={6}>
          <h3 fontSize='l'>Background</h3>
          <Box w='200px' bg='background.50' p={6}>
            <Text>background[50]</Text>
          </Box>
          <Box w='200px' bg='background.100' p={6}>
            <Text>background[100]</Text>
          </Box>
          <Box w='200px' bg='background.200' p={6}>
            <Text>background[200]</Text>
          </Box>
          <Box w='200px' bg='background.300' p={6}>
            <Text>background[300]</Text>
          </Box>
          <Box w='200px' bg='background.400' p={6}>
            <Text>background[400]</Text>
          </Box>
          <Box w='200px' bg='background.500' p={6}>
            <Text>background[500]</Text>
          </Box>
          <Box w='200px' bg='background.600' p={6}>
            <Text>background[600]</Text>
          </Box>
          <Box w='200px' bg='background.700' p={6}>
            <Text>background[700]</Text>
          </Box>
          <Box w='200px' bg='background.800' p={6}>
            <Text>background[800]</Text>
          </Box>
          <Box w='200px' bg='background.900' p={6}>
            <Text>background[900]</Text>
          </Box>
        </Flex>
      </Flex>
    </>
  );
};

export default ThemeSample;
