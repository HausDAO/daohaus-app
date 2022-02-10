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
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import ContentBox from './ContentBox';
import hausImg from '../assets/img/haus_icon.svg';
import { fetchBalance, fetchTokenData } from '../utils/tokenValue';

const HausCard = ({ hideLink = false }) => {
  const { address } = useInjectedProvider();
  const [gnosisChainBalance, setGnosisChainBalance] = useState(
    BigNumber.from('0'),
  );
  const [mainnetBalance, setMainnetBalance] = useState(BigNumber.from('0'));
  const [currentValue, setCurrentValue] = useState(0);
  const round = value => {
    return FixedNumber.fromString(ethers.utils.formatUnits(value), 18)
      .round(2)
      .toString();
  };

  useEffect(async () => {
    const tokenAddress = '0xb0c5f3100a4d9d9532a4cfd68c55f1ae8da987eb';
    const max = await fetchBalance({
      address,
      chainID: '0x64',
      tokenAddress,
    });
    const tokenData = await fetchTokenData();
    setCurrentValue(tokenData[tokenAddress]?.price || 0);
    setGnosisChainBalance(BigNumber.from(max));
  }, [address]);

  useEffect(async () => {
    const max = await fetchBalance({
      address,
      chainID: '0x1',
      tokenAddress: '0xf2051511b9b121394fa75b8f7d4e7424337af687',
    });
    setMainnetBalance(BigNumber.from(max));
  }, [address]);

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
              ${currentValue}
            </Text>
          </Flex>
        </Flex>
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
                    <Td>{round(gnosisChainBalance.toString())} Haus</Td>
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
