import React, { useEffect, useState } from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { useParams } from 'react-router-dom';
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  LineSeries,
  AreaSeries,
  GradientDefs,
} from 'react-vis';
import { Box, Flex, Spinner, RadioGroup, Stack, Radio } from '@chakra-ui/react';

import { fetchBankValues } from '../utils/theGraph';
import {
  getDateRange,
  getDatesArray,
  groupBalancesMemberToDateRange,
} from '../utils/charts';
import { useDao } from '../contexts/DaoContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import ContentBox from './ContentBox';
import TextBox from './TextBox';

const MembersChart = () => {
  const { daochain, daoid } = useParams();
  const [daoBalances, setDaoBalances] = useSessionStorage(
    `balances-${daoid}`,
    null,
  );
  const { theme } = useCustomTheme();
  const { daoOverview } = useDao();
  const [preppedData, setPreppedData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartDimension, setChartDimension] = useState('currentShares');

  useEffect(() => {
    const fetchBalances = async () => {
      const data = await fetchBankValues({
        daoID: daoid,
        chainID: daochain,
      });
      setDaoBalances(data);
    };
    if (!daoBalances && daochain && daoid) {
      fetchBalances();
    }
  }, [daoBalances, setDaoBalances, daochain, daoid]);

  useEffect(() => {
    if (daoBalances?.length) {
      const dateRange = getDateRange(
        { value: 'lifetime' },
        daoBalances,
        daoOverview.summoningTime,
      );
      const dates = getDatesArray(dateRange.start, dateRange.end);
      const groupedBalances = groupBalancesMemberToDateRange(
        daoBalances,
        dates,
      );
      setPreppedData(groupedBalances);
    }
  }, [daoBalances]);

  useEffect(() => {
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
    <Box>
      {daoBalances?.length ? (
        <ContentBox minH='360px'>
          <RadioGroup
            defaultValue={chartDimension}
            onChange={setChartDimension}
            mt={4}
          >
            <Stack spacing={4} direction='row'>
              <Radio value='currentShares'>Shares</Radio>
              <Radio value='currentLoot'>Loot</Radio>
            </Stack>
          </RadioGroup>
          <Flex wrap='wrap' align='center' position='relative'>
            <Box w='100%'>
              {chartData.length ? (
                <FlexibleXYPlot
                  yDomain={[0, chartData[chartData.length - 1].y || 10]}
                  margin={{ left: 0, right: 0, top: 40, bottom: 40 }}
                >
                  <XAxis xType='time' tickTotal={0} />
                  <YAxis tickTotal={0} />
                  {gradient}
                  <LineSeries
                    animate
                    curve='curveNatural'
                    data={chartData}
                    color={theme.colors.primary[50]}
                    style={{ fill: 'none' }}
                  />
                  <AreaSeries
                    animate
                    curve='curveNatural'
                    data={chartData}
                    fill={'url(#gradient)'}
                    stroke='transparent'
                  />
                </FlexibleXYPlot>
              ) : (
                <Flex w='100%' h='100%' justify='center' align='center'>
                  <Spinner
                    thickness='6px'
                    speed='0.45s'
                    emptyColor='whiteAlpha.300'
                    color='primary.500'
                    size='xl'
                    my={20}
                  />
                </Flex>
              )}
            </Box>
          </Flex>
        </ContentBox>
      ) : (
        <Flex
          as={ContentBox}
          w='100%'
          h='350px'
          align='center'
          justify='center'
        >
          <TextBox>Waiting on more member data.</TextBox>
        </Flex>
      )}
    </Box>
  );
};

export default MembersChart;
