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
  Avatar,
  Box,
  Flex,
  Icon,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
  Spinner,
  Text,
} from '@chakra-ui/react';

import { useCustomTheme } from '../contexts/CustomThemeContext';
import ContentBox from './ContentBox';
import TextBox from './TextBox';
import hausImg from '../assets/img/haus_icon.svg';

export const chartTimeframes = [
  { name: '7D', value: 7, interval: 'days' },
  { name: '1M', value: 30, interval: 'weeks' },
  { name: '6M', value: 180, interval: 'months' },
  { name: 'Lifetime', value: 'lifetime', interval: 'quarters' },
];

const HausChart = ({ address, balanceData, fetchBalanceData, tokenPrice }) => {
  const { theme } = useCustomTheme();
  const [error, setError] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [currentValue, setCurrentValue] = useState(0);
  const [timeframe, setTimeframe] = useState(chartTimeframes[0]);

  useEffect(() => {
    if (balanceData.error) {
      setError(true);
      return;
    }
    if (balanceData.data) {
      setTimeframe(balanceData.timeframe);
      if (balanceData.data.every(bal => bal.y === 0)) {
        setChartData(
          balanceData.data.map(b => {
            return { ...b, y0: -100 };
          }),
        );
        return;
      }
      setChartData(balanceData.data);
    }
  }, [balanceData]);

  useEffect(() => {
    if (tokenPrice) {
      setCurrentValue(tokenPrice);
    }
  }, [tokenPrice]);

  const handleTimeChange = time => {
    setError(false);
    setChartData([]);
    setTimeframe({
      ...time,
    });
    fetchBalanceData(time);
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
    <Box>
      <ContentBox minH='360px'>
        <Flex wrap='wrap' align='center' position='relative'>
          <Flex alignItems='center'>
            <Avatar name='Haus logo' src={hausImg} size='lg' />
            <Flex direction='column'>
              <Text fontSize='md' fontFamily='Roboto Mono' ml={3}>
                Haus
              </Text>
              <Text fontSize='md' fontFamily='Roboto Mono' ml={3}>
                ${currentValue.toFixed(2)}
              </Text>
            </Flex>
          </Flex>
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
                      {chartTimeframes.map(time => {
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
            ) : !address ? (
              <Flex
                as={ContentBox}
                w='100%'
                h='350px'
                align='center'
                justify='center'
                border='none'
              >
                <TextBox align='center'>
                  Connect your wallet to check your balance history
                </TextBox>
              </Flex>
            ) : error ? (
              <Flex
                as={ContentBox}
                w='100%'
                h='350px'
                align='center'
                justify='center'
              >
                <TextBox>--</TextBox>
              </Flex>
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
    </Box>
  );
};

export default HausChart;
