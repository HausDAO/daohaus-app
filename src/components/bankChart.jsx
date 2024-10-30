import React, { useEffect, useState } from 'react';
import {
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  LineSeries,
  AreaSeries,
  GradientDefs,
} from 'react-vis';
import { FaChevronDown } from 'react-icons/fa';
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

import { useCustomTheme } from '../contexts/CustomThemeContext';
import ContentBox from './ContentBox';
import TextBox from './TextBox';
import VaultTotal from './vaultTotal';
import { getCurrentPrices } from '../utils/vaults';
import {
  getDateRange,
  balancesWithValue,
  getDatesArray,
  groupBalancesToDateRange,
  subtractDays,
} from '../utils/charts';

const bankChartTimeframes = [
  { name: 'Lifetime', value: 'lifetime' },
  { name: '1 month', value: 1 },
  { name: '3 months', value: 3 },
  { name: '6 months', value: 6 },
];

const BankChart = ({ daoVaults, balanceData, visibleVaults }) => {
  const [daoBalances, setDaoBalances] = useState(null);
  const { theme } = useCustomTheme();
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState(bankChartTimeframes[0]);

  useEffect(() => {
    if (balanceData) {
      setDaoBalances(balanceData);
    }
  }, [balanceData]);

  useEffect(() => {
    if (daoBalances?.length && visibleVaults) {
      const currentPrices = getCurrentPrices(daoVaults);
      const filteredBalances = balancesWithValue(daoBalances, currentPrices);

      if (filteredBalances[0]) {
        const dateRange = getDateRange(timeframe, filteredBalances);

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
  }, [daoBalances, timeframe, daoVaults]);

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
              <Box position='absolute' top='30px' left='10px'>
                <VaultTotal vaults={visibleVaults} />
              </Box>

              <Box w='100%'>
                {chartData.length ? (
                  <>
                    <Flex justify='flex-end'>
                      <Menu placement='bottom-end'>
                        <MenuButton
                          color='secondary.500'
                          fontFamily='heading'
                          _hover={{ color: 'secondary.400' }}
                        >
                          {`Time Frame: ${timeframe.name}`}
                          <Icon as={FaChevronDown} h='12px' w='12px' ml={1} />
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
            <TextBox>--</TextBox>
          </Flex>
        )}
      </Box>
    </div>
  );
};

export default BankChart;
