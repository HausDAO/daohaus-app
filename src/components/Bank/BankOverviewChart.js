import React, { useEffect, useState } from 'react';
import {
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  LineSeries,
  AreaSeries,
  GradientDefs,
} from 'react-vis';
import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Skeleton,
} from '@chakra-ui/react';
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

const BankOverviewChart = ({ balances, dao }) => {
  const [theme] = useTheme();
  const [prices] = usePrices();
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState(bankChartTimeframes[0]);

  useEffect(() => {
    if (balances && prices && dao) {
      const filteredBalances = balancesWithValue(balances, prices);
      if (filteredBalances[0]) {
        const dateRange = getDateRange(
          timeframe,
          filteredBalances,
          dao.graphData.summoningTime,
        );
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

        if (timeframe.value === 'lifetime') {
          data[0].y = 0;
        }

        setChartData(data);
      } else {
        setChartData([]);
      }
    }
  }, [balances, prices, timeframe, dao]);

  const handleTimeChange = (time) => {
    setChartData([]);
    setTimeframe({
      ...time,
    });
  };

  const gradient = (
    <GradientDefs>
      <linearGradient id='gradient' x1='0' x2='0' y1='0' y2='100%'>
        <stop offset='0%' stopColor={theme.colors.primary[50]} />
        <stop
          offset='100%'
          stopColor={theme.colors.primary[50]}
          stopOpacity={0}
        />
      </linearGradient>
    </GradientDefs>
  );

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
        <ContentBox minH='300px'>
          {chartData.length > 0 ? (
            <FlexibleWidthXYPlot
              height={300}
              margin={{ left: 40, right: 40, top: 40, bottom: 40 }}
              yDomain={[0, chartData[chartData.length - 1].y || 10]}
            >
              {gradient}
              <LineSeries
                animate
                curve='curveNatural'
                data={chartData}
                color={theme.colors.primary[50]}
              />
              <AreaSeries
                animate
                curve='curveNatural'
                data={chartData}
                fill={'url(#gradient)'}
                stroke='transparent'
              />
              <XAxis xType='time' tickTotal={0} />
              <YAxis tickTotal={0} />
            </FlexibleWidthXYPlot>
          ) : null}
        </ContentBox>
      </Skeleton>
    </Box>
  );
};

export default BankOverviewChart;
