import React, { useEffect, useState } from 'react';
import { Collapse } from '@chakra-ui/transition';
import { ethers, BigNumber, FixedNumber } from 'ethers';
import {
  Avatar,
  Flex,
  Divider,
  Text,
  Accordion,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  AccordionItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tfoot,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useAccordion } from '@chakra-ui/accordion';
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  LineSeries,
  AreaSeries,
  GradientDefs,
} from 'react-vis';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import ContentBox from './ContentBox';
import hausImg from '../assets/img/haus_icon.svg';
import { fetchBalance } from '../utils/tokenValue';

const HausCard = ({ showChart = false }) => {
  const chartData = [
    { x: 0, y: 8 },
    { x: 1, y: 5 },
    { x: 2, y: 4 },
    { x: 3, y: 9 },
    { x: 4, y: 1 },
    { x: 5, y: 7 },
    { x: 6, y: 6 },
    { x: 7, y: 3 },
    { x: 8, y: 2 },
    { x: 9, y: 0 },
  ];

  const gradient = (
    <GradientDefs>
      <linearGradient id='gradient' x1='0' x2='0' y1='0' y2='100%'>
        <stop offset='0%' stopColor='#FFFFFF' />
        <stop offset='100%' stopColor='#FFFFFF' stopOpacity={0} />
      </linearGradient>
    </GradientDefs>
  );

  console.log(showChart);
  const { address } = useInjectedProvider();
  const [gnosisChainBalance, setGnosisChainBalance] = useState(
    BigNumber.from('0'),
  );
  const [mainnetBalance, setMainnetBalance] = useState(BigNumber.from('0'));
  const currentValue = 32.08;
  const round = value => {
    console.log('Hello');
    console.log(value);
    return FixedNumber.fromString(ethers.utils.formatUnits(value), 18)
      .round(2)
      .toString();
  };

  useEffect(async () => {
    const max = await fetchBalance({
      address,
      chainID: '0x64',
      tokenAddress: '0xb0c5f3100a4d9d9532a4cfd68c55f1ae8da987eb',
    });
    console.log('max');
    setGnosisChainBalance(BigNumber.from(max));
  }, []);

  useEffect(async () => {
    const max = await fetchBalance({
      address,
      chainID: '0x1',
      tokenAddress: '0xf2051511b9b121394fa75b8f7d4e7424337af687',
    });
    console.log('max');
    setMainnetBalance(BigNumber.from(max));
  }, []);

  return (
    <ContentBox mt={3} p={1}>
      <Flex alignItems='center' justifyContent='space-between' padding={6}>
        <Flex alginItems='center'>
          <Avatar name='Haus logo' src={hausImg} size='lg' />
          <Flex direction='column'>
            <Text fontSize='md' fontFamily='Roboto Mono' ml={3}>
              Haus
            </Text>
            <Text fontSize='md' fontFamily='Roboto Mono' ml={3}>
              $32.08
            </Text>
          </Flex>
        </Flex>
        {!showChart ? (
          <Link to='/haus'>
            <Text fontSize='lg' fontFamily='Roboto Mono' ml={3}>
              ABOUT HAUS
            </Text>
          </Link>
        ) : (
          <Text fontSize='lg' fontFamily='Roboto Mono' ml={3} color='#FE1D5B'>
            7D ▼
          </Text>
        )}
      </Flex>
      {showChart ? (
        <Flex justify='center'>
          <Flex w='100%' minH='300px' justify='center'>
            <FlexibleXYPlot
              yDomain={[0, chartData[chartData.length - 1].y || 10]}
              margin={{
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }}
            >
              <XAxis xType='time' tickTotal={0} />
              <YAxis tickTotal={0} />
              {gradient}
              <LineSeries
                animate
                curve='curveNatural'
                data={chartData}
                color='#FE1D5B'
                style={{ fill: 'none' }}
              />
              <AreaSeries
                animate
                curve='curveNatural'
                data={chartData}
                fill='url(#gradient)'
                stroke='transparent'
              />
            </FlexibleXYPlot>
          </Flex>
        </Flex>
      ) : (
        <></>
      )}
      {!showChart ? (
        <Divider
          orientation='vertical'
          css={{
            border: '1px solid rgba(255, 255, 255, 0.15);',
          }}
        />
      ) : (
        <></>
      )}
      <Flex justifyContent='space-between' mt='6'>
        <Accordion allowToggle defaultIndex={1} w='100%' border='none'>
          <AccordionItem>
            {({ isExpanded }) => (
              <Table variant='unstyled'>
                <Thead>
                  <Tr>
                    <Th>Network</Th>
                    <Th>Balance</Th>
                    <Th>Value</Th>
                    <Th>
                      <AccordionButton w='auto'>
                        <AccordionIcon />
                      </AccordionButton>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody
                  css={{
                    display: `${isExpanded ? 'table-row-group' : 'none'}`,
                  }}
                >
                  <Tr>
                    <Td>Gnosis Chain</Td>
                    <Td>
                      {round(gnosisChainBalance.toString())}
                      Haus
                    </Td>
                    <Td>
                      $
                      {(
                        round(gnosisChainBalance.toString()) * currentValue
                      ).toFixed(2)}
                    </Td>
                    <Td />
                  </Tr>
                  <Tr>
                    <Td>Ethereum</Td>
                    <Td>{round(mainnetBalance.toString())} Haus</Td>
                    <Td>
                      {(
                        round(mainnetBalance.toNumber()) * currentValue
                      ).toFixed(2)}
                    </Td>
                    <Td />
                  </Tr>
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th>All</Th>
                    <Th>
                      {round(mainnetBalance.add(gnosisChainBalance).toString())}{' '}
                      Haus
                    </Th>
                    <Th>
                      $
                      {(
                        round(
                          mainnetBalance.add(gnosisChainBalance).toString(),
                        ) * currentValue
                      ).toFixed(2)}
                    </Th>
                    <Th />
                  </Tr>
                </Tfoot>
              </Table>
            )}
          </AccordionItem>
        </Accordion>
      </Flex>
    </ContentBox>
  );
};

export default HausCard;
