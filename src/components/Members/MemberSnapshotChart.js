import React, { useEffect, useState } from 'react';
import {
  FlexibleXYPlot,
  GradientDefs,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineSeries,
  AreaSeries,
} from 'react-vis';
import { Box } from '@chakra-ui/core';
import { useTheme } from '../../contexts/CustomThemeContext';
import { useBalances } from '../../contexts/PokemolContext';
import {
  getDateRange,
  getDatesArray,
  groupBalancesMemberToDateRange,
} from '../../utils/bank-helpers';

const MemberSnapshotChart = ({ chartDimension }) => {
  const [theme] = useTheme();
  const [balances] = useBalances();
  const [chartData, setChartData] = useState([]);
  const [preppedData, setPreppedData] = useState([]);

  useEffect(() => {
    if (balances.length > 0) {
      const dateRange = getDateRange({ value: 'lifetime' }, balances);
      const dates = getDatesArray(dateRange.start, dateRange.end);
      const groupedBalances = groupBalancesMemberToDateRange(balances, dates);
      setPreppedData(groupedBalances);
    }
  }, [balances]);

  useEffect(() => {
    console.log('chartDimension', chartDimension);
    console.log('preppedData', preppedData);
    if (preppedData.length > 0 && chartDimension) {
      setTypeData(chartDimension, preppedData);
    }
  }, [chartDimension, preppedData]);

  const setTypeData = (type, balances) => {
    const data = balances.map((balance, i) => {
      return {
        x: balance.date,
        y: balance[type],
        y0: 0,
      };
    });

    setChartData(data);
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
    <Box w='95%' minH='300px'>
      <FlexibleXYPlot>
        <VerticalGridLines color='white' />
        <HorizontalGridLines color='white' />
        <XAxis xType='time' tickTotal={0} />
        <YAxis tickTotal={0} />
        {gradient}
        <LineSeries
          animate
          curve='curveNatural'
          data={chartData}
          color={theme.colors.primary[50]}
        />
        <AreaSeries
          curve='curveNatural'
          data={chartData}
          fill={'url(#gradient)'}
          stroke='transparent'
        />
      </FlexibleXYPlot>
    </Box>
  );
};

export default MemberSnapshotChart;
