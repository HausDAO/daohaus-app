import React from 'react';
import { Collapse } from '@chakra-ui/transition';
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
import ContentBox from './ContentBox';
import hausImg from '../assets/img/haus_icon.svg';

const HausCard = () => {
  return (
    <ContentBox mt={3}>
      <Flex alignItems='center' justifyContent='space-between' mb='5'>
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
        <Link to='/haus'>
          <Text fontSize='lg' fontFamily='Roboto Mono' ml={3}>
            ABOUT HAUS
          </Text>
        </Link>
      </Flex>
      <Divider
        orientation='vertical'
        css={{
          border: '1px solid rgba(255, 255, 255, 0.15);',
        }}
      />
      <Flex justifyContent='space-between' mt='6'>
        <Accordion allowToggle defaultIndex={1} w='100%'>
          <AccordionItem>
            {({ isExpanded }) => (
              <Table>
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
                    <Td>0 Haus</Td>
                    <Td>$0</Td>
                    <Td />
                  </Tr>
                  <Tr>
                    <Td>Ethereum</Td>
                    <Td>0 Haus</Td>
                    <Td>$0</Td>
                    <Td />
                  </Tr>
                </Tbody>
                <Tfoot>
                  <Tr>
                    <Th>All</Th>
                    <Th>490.11 Haus</Th>
                    <Th>$15722.73</Th>
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
