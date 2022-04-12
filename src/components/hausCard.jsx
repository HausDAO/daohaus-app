import React, { useEffect, useState } from 'react';
import {
  Flex,
  Divider,
  Text,
  Accordion,
  AccordionButton,
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
import ETHDater from '@santteegt/ethereum-block-by-date';
import { Link } from 'react-router-dom';
import { subDays } from 'date-fns';
import Web3 from 'web3';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import ContentBox from './ContentBox';
import HausChart, { chartTimeframes } from './hausChart';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { fetchBalance, fetchTokenData } from '../utils/tokenValue';
import { numberWithCommas, fromWeiToFixedDecimal } from '../utils/general';
import { LOCAL_ABI } from '../utils/abi';
import { chainByID } from '../utils/chain';
import { createContract } from '../utils/contract';
import { fetchTokenTransferHistory } from '../utils/tokenExplorerApi';

const HAUS_GCHAIN_ADDRESS = '0xb0c5f3100a4d9d9532a4cfd68c55f1ae8da987eb';
const HAUS_GCHAIN_START_BLOCKNO = 11830581;
const HAUS_MAINNET_ADDRESS = '0xf2051511b9b121394fa75b8f7d4e7424337af687';
const HAUS_MAINNET_START_BLOCKNO = 10795803;

const getStartDate = async ({ daochain, timeframeDays, startBlockNo }) => {
  if (timeframeDays !== 'lifetime') {
    return subDays(new Date(), timeframeDays);
  }
  const web3Provider = new Web3(
    new Web3.providers.HttpProvider(chainByID(daochain).rpc_url),
  );
  const blockInfo =
    startBlockNo && (await web3Provider.eth.getBlock(startBlockNo));
  return new Date(blockInfo.timestamp * 1000);
};

const fillSeries = (balances, indexes) => {
  return indexes
    .map(idx => {
      return {
        x: idx,
        y: balances.find(b => b.x === idx)?.y,
      };
    })
    .reduce(
      (prev, b, i) => [
        ...prev,
        { x: b.x, y: !b.y ? prev[i - 1]?.y || 0 : b.y },
      ],
      [],
    );
};

const HausCard = ({ hideLink = false }) => {
  const { address } = useInjectedProvider();
  const [gnosisChainBalance, setGnosisChainBalance] = useState(0);
  const [mainnetBalance, setMainnetBalance] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [hausHoldings, setHausHoldings] = useSessionStorage(`haus-${address}`, {
    timeframe: chartTimeframes[0],
    data: [],
  });

  const fetchHausHistoricHoldings = async chartTimeframe => {
    try {
      // ====== Mainnet
      const startDate = await getStartDate({
        daochain: '0x1',
        timeframeDays: chartTimeframe.value,
        startBlockNo: HAUS_MAINNET_START_BLOCKNO,
      });
      const mainnetProvider = new Web3(
        new Web3.providers.HttpProvider(chainByID('0x1').rpc_url),
      );
      const dater = new ETHDater(mainnetProvider);
      const startBlockInfo0x1 = await dater.getDate(startDate);
      const transferEvents0x1 = await fetchTokenTransferHistory(
        '0x1',
        address,
        startBlockInfo0x1.block,
        HAUS_MAINNET_ADDRESS,
        1,
        10000,
      );
      const balance0x1 = await fetchBalance({
        address,
        chainID: '0x1',
        tokenAddress: HAUS_MAINNET_ADDRESS,
      });

      const historicBalancesPre0x1 = [
        {
          x: Math.round(new Date().getTime() / 1000),
          value: balance0x1,
        },
        ...(transferEvents0x1?.reverse() || []),
      ];
      const historicBalances0x1 = historicBalancesPre0x1.reduce(
        (prev, ev, i) => {
          if (i > 0) {
            const prevBalance = prev[i - 1].y;
            return [
              ...prev,
              {
                x:
                  Number(historicBalancesPre0x1[i + 1]?.timeStamp) ||
                  Number(ev.timeStamp) - 1,
                y:
                  prevBalance +
                  (ev.from === address || !historicBalancesPre0x1[i + 1]
                    ? -1
                    : 1) *
                    (Number(ev.value) / 1e18),
              },
            ];
          }
          return [
            ...prev,
            {
              x:
                Number(historicBalancesPre0x1[i + 1]?.timeStamp) ||
                historicBalancesPre0x1[i].x,
              y: Number(historicBalancesPre0x1[i].value) / 1e18,
            },
          ];
        },
        [],
      );

      // ==== GnosisCHhain
      const gcStartDate = await getStartDate({
        daochain: '0x64',
        timeframeDays: chartTimeframe.value,
        startBlockNo: HAUS_GCHAIN_START_BLOCKNO,
      });
      const gcProvider = new Web3(
        new Web3.providers.HttpProvider(chainByID('0x64').rpc_url),
      );
      const gcDater = new ETHDater(gcProvider);
      const endBlockNo = await gcProvider.eth.getBlockNumber();
      const endDate = new Date();

      const blocksInterval = [
        ...(await gcDater.getEvery(
          chartTimeframe.interval,
          gcStartDate,
          endDate,
        )),
        {
          block: endBlockNo,
          date: endDate.toISOString(),
          timestamp: Math.round(endDate.getTime() / 1000),
        },
      ];

      const erc20GChain = createContract({
        address: HAUS_GCHAIN_ADDRESS,
        abi: LOCAL_ABI.ERC_20,
        web3: new Web3(
          new Web3.providers.HttpProvider(chainByID('0x64').archive_node_url),
        ),
      });
      const historicBalances0x64 = await Promise.all(
        blocksInterval.map(async b => {
          return {
            x: b.timestamp,
            y:
              Number(
                await erc20GChain.methods.balanceOf(address).call({}, b.block),
              ) / 1e18,
          };
        }),
      );

      // ==== build timeseries
      const indexes = [
        ...new Set([
          ...historicBalances0x1.map(b => b.x),
          ...historicBalances0x64.map(b => b.x),
        ]),
      ].sort();
      const historicBalancesMainnet = fillSeries(historicBalances0x1, indexes);
      const historicBalancesGChain = fillSeries(historicBalances0x64, indexes);

      setHausHoldings({
        timeframe: chartTimeframe,
        data: indexes.map(i => {
          return {
            x: i,
            y:
              (historicBalancesMainnet.find(b => b.x === i)?.y || 0) +
              (historicBalancesGChain.find(b => b.x === i)?.y || 0),
            y0: 0,
          };
        }),
      });
    } catch (error) {
      console.log('Error trying to fetch historical balances', error);
      setHausHoldings({
        timeframe: chartTimeframe,
        data: [],
        error: true,
      });
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchBalances = async () => {
      const tokenData = await fetchTokenData();
      setCurrentValue(tokenData[HAUS_GCHAIN_ADDRESS]?.price || 0);
      const gnosisChainMax = await fetchBalance({
        address,
        chainID: '0x64',
        tokenAddress: HAUS_GCHAIN_ADDRESS,
      });
      setGnosisChainBalance(fromWeiToFixedDecimal(gnosisChainMax));
      const mainnetMax = await fetchBalance({
        address,
        chainID: '0x1',
        tokenAddress: HAUS_MAINNET_ADDRESS,
      });
      setMainnetBalance(fromWeiToFixedDecimal(mainnetMax));
    };

    if (address) {
      fetchBalances();
      fetchHausHistoricHoldings(chartTimeframes[0]);
    }
    return () => controller?.abort();
  }, [address]);

  return (
    <ContentBox mt={3} mb={6} p={1}>
      <HausChart
        address={address}
        balanceData={hausHoldings}
        fetchBalanceData={fetchHausHistoricHoldings}
        tokenPrice={currentValue}
      />
      <Flex alignItems='center' justifyContent='space-between' padding={6}>
        {!hideLink ? (
          <Link to='/haus'>
            <Text fontSize='lg' fontFamily='Roboto Mono' ml={3}>
              ABOUT HAUS
            </Text>
          </Link>
        ) : (
          <></>
        )}
      </Flex>
      <Divider
        orientation='vertical'
        css={{
          border: '1px solid rgba(255, 255, 255, 0.15);',
        }}
      />
      <Flex justifyContent='space-between' mt='5'>
        <Accordion
          allowToggle
          defaultIndex={1}
          w='100%'
          css={{
            border: 'transparent',
          }}
        >
          <AccordionItem>
            {({ isExpanded }) => (
              <Table variant='unstyled'>
                <Thead color='rgba(255, 255, 255, 0.75)'>
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
                    <Td>
                      <span>Gnosis Chain</span>
                    </Td>
                    <Td>{numberWithCommas(gnosisChainBalance)} Haus</Td>
                    <Td>
                      $
                      {numberWithCommas(
                        (gnosisChainBalance * currentValue).toFixed(2),
                      )}
                    </Td>
                    <Td />
                  </Tr>
                  <Tr>
                    <Td>Ethereum</Td>
                    <Td>{numberWithCommas(mainnetBalance)} Haus</Td>
                    <Td>
                      $
                      {numberWithCommas(
                        (mainnetBalance * currentValue).toFixed(2),
                      )}
                    </Td>
                    <Td />
                  </Tr>
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Td>All</Td>
                    <Td>
                      {numberWithCommas(mainnetBalance + gnosisChainBalance)}{' '}
                      Haus
                    </Td>
                    <Td>
                      $
                      {numberWithCommas(
                        (
                          (mainnetBalance + gnosisChainBalance) *
                          currentValue
                        ).toFixed(2),
                      )}
                    </Td>
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
