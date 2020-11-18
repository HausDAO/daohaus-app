import React, { useEffect, useState } from 'react';
import { FlexibleWidthXYPlot, XAxis, YAxis, AreaSeries } from 'react-vis';
import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Skeleton,
} from '@chakra-ui/core';
import { FaChevronDown } from 'react-icons/fa';
import { useTheme } from '../../contexts/CustomThemeContext';

import ContentBox from '../Shared/ContentBox';
import {
  balancesWithValue,
  getDateRange,
  getDatesArray,
  groupBalancesToDateRange,
} from '../../utils/bank-helpers';
import { usePrices } from '../../contexts/PokemolContext';
import { bankChartTimeframes } from '../../content/chart-content';

const BankOverviewChart = ({ balances }) => {
  const [theme] = useTheme();
  const [prices] = usePrices();
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState(bankChartTimeframes[0]);

  useEffect(() => {
    if (balances && prices) {
      const filteredBalances = balancesWithValue(balances, prices);
      if (filteredBalances[0]) {
        const dateRange = getDateRange(timeframe, filteredBalances);
        const dates = getDatesArray(dateRange.start, dateRange.end);
        const groupedBalances = groupBalancesToDateRange(
          filteredBalances,
          dates,
        );

        const data = groupedBalances.map((balance, i) => {
          return {
            x: balance.date,
            y: balance.value,
            y0: 0,
          };
        });

        setChartData(data);
      } else {
        setChartData([]);
      }
    }
  }, [balances, prices, timeframe]);

  const handleTimeChange = (time) => {
    setTimeframe({
      ...time,
    });
  };

  return (
    <Box>
      <Skeleton isLoaded={chartData.length > 0}>
        <Flex justify='flex-end'>
          <Menu>
            <MenuButton>
              Time Frame: {timeframe.name}{' '}
              <Icon as={FaChevronDown} h='12px' w='12px' />
            </MenuButton>
            <MenuList>
              {bankChartTimeframes.map((time) => {
                return (
                  <MenuItem
                    key={time.value}
                    onClick={() => handleTimeChange(time)}
                  >
                    {time.name}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
        </Flex>
        <ContentBox minH='260px' w='100%'>
          <FlexibleWidthXYPlot height={300}>
            <AreaSeries
              curve='curveNatural'
              data={chartData}
              color={theme.colors.primary[50]}
            />
            <XAxis xType='time' tickTotal={0} />
            <YAxis tickTotal={0} />
          </FlexibleWidthXYPlot>
        </ContentBox>
      </Skeleton>
    </Box>
  );
};

export default BankOverviewChart;
