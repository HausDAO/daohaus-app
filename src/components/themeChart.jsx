import React, { useState } from 'react';
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
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { FaChevronDown } from 'react-icons/fa';

import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { getTerm } from '../utils/metadata';
import { useMetaData } from '../contexts/MetaDataContext';

const bankChartTimeframes = [
  { name: 'Lifetime', value: 'lifetime' },
  { name: '1 month', value: 1 },
  { name: '3 months', value: 3 },
  { name: '6 months', value: 6 },
];

const themeChartData = [
  { x: 0, y: 0 },
  { x: 2, y: 2 },
  { x: 3, y: 2 },
  { x: 4, y: 5 },
  { x: 5, y: 7 },
];

const ThemeChart = ({ previewValues }) => {
  const { customTerms } = useMetaData();

  const [timeframe] = useState(bankChartTimeframes[0]);

  const gradient = (
    <GradientDefs>
      <linearGradient id='gradient' x1='0' x2='0' y1='0' y2='100%'>
        {/* primary[200] */}
        <stop offset='0%' stopColor={previewValues?.primary500} />
        <stop
          offset='100%'
          stopColor={previewValues?.primary500}
          stopOpacity={0}
        />
      </linearGradient>
    </GradientDefs>
  );

  return (
    <Box>
      <ContentBox minH='360px'>
        <Flex wrap='wrap' align='center' position='relative'>
          <Box position='absolute' top='0px' left='10px'>
            <TextBox size='sm'>{getTerm(customTerms, 'bank')}</TextBox>
            <Box fontFamily='heading' fontSize='2xl' fontWeight={800}>
              $1337.42
            </Box>
          </Box>

          <Box w='100%'>
            <Flex justify='flex-end'>
              <Menu>
                <MenuButton
                  color={previewValues?.secondary500}
                  fontFamily='heading'
                  _hover={{ color: previewValues?.secondary500 }}
                >
                  {`Time Frame: ${timeframe.name}`}
                  <Icon as={FaChevronDown} h='12px' w='12px' />
                </MenuButton>
                <MenuList>
                  {bankChartTimeframes.map(time => {
                    return <MenuItem key={time.value}>{time.name}</MenuItem>;
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
                data={themeChartData}
                color={previewValues?.primary500}
                style={{ fill: 'none' }}
              />
              <AreaSeries
                animate
                curve='curveNatural'
                data={themeChartData}
                fill='url(#gradient)'
                stroke='transparent'
              />
              <XAxis xType='time' tickTotal={0} />
              <YAxis tickTotal={0} />
            </FlexibleWidthXYPlot>
          </Box>
        </Flex>
      </ContentBox>
    </Box>
  );
};

export default ThemeChart;
