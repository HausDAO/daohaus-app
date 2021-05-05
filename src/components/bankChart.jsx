import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  Icon,
  MenuButton,
  Menu,
  Spinner,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { FaChevronDown } from 'react-icons/fa';

import { fetchBankValues } from '../utils/theGraph';
import {
  getDateRange,
  balancesWithValue,
  getDatesArray,
  groupBalancesToDateRange,
  subtractDays,
} from '../utils/charts';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { getTerm } from '../utils/metadata';
import BankTotal from './bankTotal';

const bankChartTimeframes = [
  { name: 'Lifetime', value: 'lifetime' },
  { name: '1 month', value: 1 },
  { name: '3 months', value: 3 },
  { name: '6 months', value: 6 },
];

const BankChart = ({ overview, customTerms, currentDaoTokens }) => {
  const { daochain, daoid } = useParams();
  const [daoBalances, setDaoBalances] = useSessionStorage(
    `balances-${daoid}`,
    null,
  );
  const { theme } = useCustomTheme();
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState(bankChartTimeframes[0]);

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
    if (daoBalances?.length && currentDaoTokens) {
      const prices = currentDaoTokens.reduce((priceMap, token) => {
        priceMap[token.tokenAddress] = token;
        return priceMap;
      }, {});

      const filteredBalances = balancesWithValue(daoBalances, prices);
      if (filteredBalances[0]) {
        const dateRange = getDateRange(
          timeframe,
          filteredBalances,
          overview.summoningTime,
        );

        const dates = getDatesArray(dateRange.start, dateRange.end);
        const groupedBalances = groupBalancesToDateRange(
          filteredBalances,
          dates,
        );

        const data = groupedBalances.map(balance => {
          return {
            x: balance.date,
            y: balance.value,
            y0: 0,
          };
        });

        if (timeframe.value === 'lifetime' || data.length === 1) {
          data.unshift({
            x: subtractDays(data[0].x, 7),
            y: 0,
            y0: 0,
          });
        }

        if (data.every(bal => bal.y === 0)) {
          setChartData(
            data.map(b => {
              return { ...b, y0: -100 };
            }),
          );
        } else {
          setChartData(data);
        }
      } else {
        setChartData([]);
      }
    }
  }, [daoBalances, currentDaoTokens, timeframe]);

  const handleTimeChange = time => {
    setChartData([]);
    setTimeframe({
      ...time,
    });
  };

  const gradient = (
    <GradientDefs>
      <linearGradient id='gradient' x1='0' x2='0' y1='0' y2='100%'>
        <stop offset='0%' stopColor={theme.colors.primary[200]} />
        <stop
          offset='100%'
          stopColor={theme.colors.primary[200]}
          stopOpacity={0}
        />
      </linearGradient>
    </GradientDefs>
  );

  return (
    <div>
      <Box>
        {daoBalances?.length ? (
          <ContentBox minH='360px'>
            <Flex wrap='wrap' align='center' position='relative'>
              <Box position='absolute' top='0px' left='10px'>
                <TextBox size='sm'>{getTerm(customTerms, 'bank')}</TextBox>
                <BankTotal tokenBalances={currentDaoTokens} />
              </Box>

              <Box w='100%'>
                {chartData.length ? (
                  <>
                    <Flex justify='flex-end'>
                      <Menu>
                        <MenuButton
                          color='secondary.500'
                          fontFamily='heading'
                          _hover={{ color: 'secondary.400' }}
                        >
                          {`Time Frame: ${timeframe.name}`}
                          <Icon as={FaChevronDown} h='12px' w='12px' />
                        </MenuButton>
                        <MenuList>
                          {bankChartTimeframes.map(time => {
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
                    <FlexibleWidthXYPlot
                      height={300}
                      margin={{
                        left: 0,
                        right: 0,
                        top: 40,
                        bottom: 40,
                      }}
                    >
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
                        fill='url(#gradient)'
                        stroke='transparent'
                      />
                      <XAxis xType='time' tickTotal={0} />
                      <YAxis tickTotal={0} />
                    </FlexibleWidthXYPlot>
                  </>
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
            <TextBox>Waiting on more balance data.</TextBox>
          </Flex>
        )}
      </Box>
    </div>
  );
};

export default BankChart;
