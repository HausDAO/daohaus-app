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
  Icon,
} from '@chakra-ui/core';
import { FaChevronDown } from 'react-icons/fa';
import { useTheme } from '../../contexts/CustomThemeContext';

import ContentBox from '../Shared/ContentBox';

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
    <Box>
      <Flex justify='space-between'>
        <Menu>
          <MenuButton>
            Showing: All <Icon as={FaChevronDown} h='12px' w='12px' />
          </MenuButton>
          <MenuList>
            <MenuItem>All</MenuItem>
            <MenuItem>Your Share</MenuItem>
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton>
            Time Frame: 7 days <Icon as={FaChevronDown} h='12px' w='12px' />
          </MenuButton>
          <MenuList>
            <MenuItem>7 day</MenuItem>
            <MenuItem>30 day</MenuItem>
            <MenuItem>90 day</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <ContentBox minH='260px' w='100%'>
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
      </ContentBox>
    </Box>
  );
};

export default BankOverviewChart;
