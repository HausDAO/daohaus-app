import React from 'react';
import {
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  AreaSeries,
} from 'react-vis';
import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  ChevronDownIcon,
} from '@chakra-ui/core';
import { useTheme } from '../../contexts/CustomThemeContext';

const BankOverviewChart = () => {
  const [theme] = useTheme();

  const data = [
    { x: 1, y: 1 },
    { x: 2, y: 2 },
    { x: 3, y: 4 },
    { x: 4, y: 3 },
    { x: 5, y: 5 },
    { x: 6, y: 8 },
  ];

  return (
    <Box m={6}>
      <Flex justify='space-between'>
        <Menu>
          <MenuButton rightIcon={<ChevronDownIcon />}>Showing: All</MenuButton>
          <MenuList>
            <MenuItem>All</MenuItem>
            <MenuItem>Your Share</MenuItem>
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton rightIcon={<ChevronDownIcon />}>
            Time Frame: 7 days
          </MenuButton>
          <MenuList>
            <MenuItem>7 day</MenuItem>
            <MenuItem>30 day</MenuItem>
            <MenuItem>90 day</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <Box
        minH='260px'
        w='100%'
        p={4}
        bg='blackAlpha.600'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
        rounded='lg'
      >
        <FlexibleWidthXYPlot height={260}>
          <VerticalGridLines color='white' />
          <HorizontalGridLines color='white' />
          <XAxis
            title='Time'
            style={{
              line: { stroke: 'white' },
              ticks: { stroke: 'white' },
              text: {
                stroke: 'none',
                fill: 'white',
                fontSize: '9px',
                fontFamily: theme.fonts.mono,
              },
              title: { fill: 'white' },
            }}
          />
          <YAxis
            title='Tokens'
            style={{
              line: { stroke: 'white' },
              ticks: { stroke: 'white' },
              text: {
                stroke: 'none',
                fill: 'white',
                fontSize: '9px',
                fontFamily: theme.fonts.mono,
              },
              title: { fill: 'white' },
            }}
          />
          <AreaSeries
            curve='curveNatural'
            data={data}
            color={theme.colors.primary[50]}
          />
        </FlexibleWidthXYPlot>
      </Box>
    </Box>
  );
};

export default BankOverviewChart;
