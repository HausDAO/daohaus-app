import React from 'react';
import {
  Flex,
  Text,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from '@chakra-ui/react';

import TextBox from './TextBox';
import ContentBox from './ContentBox';
import CrossDaoInternalBalanceListCard from './crossDaoInternalBalanceListCard';

const CrossDaoInternalBalanceList = ({
  tokens,
  currentDaoTokens,
  isMinion,
}) => {
  return (
    <ContentBox mt={6}>
      <Accordion allowToggle defaultIndex={0} border='none' borderWidth='0'>
        <AccordionItem border='none'>
          <AccordionButton>
            <Flex direction='row' width='100%' justify='space-between'>
              <TextBox size='xs' mb={6}>
                {`${isMinion ? 'Minion ' : ''}Internal Balances`}
              </TextBox>
              <AccordionIcon />
            </Flex>
          </AccordionButton>
          <AccordionPanel>
            <Flex>
              <Box w='30%' d={['none', null, null, 'inline-block']}>
                <TextBox size='xs'>DAO</TextBox>
              </Box>
              <Box w='15%' d={['none', null, null, 'inline-block']}>
                <TextBox size='xs'>Network</TextBox>
              </Box>
              <Box w='20%' d={['none', null, null, 'inline-block']}>
                <TextBox size='xs'>Asset</TextBox>
              </Box>
              <Box w={['40%', null, null, '25%']}>
                <TextBox size='xs'>Balance</TextBox>
              </Box>

              <Box w={['35%', null, null, '35%']} />
            </Flex>
            {tokens?.length > 0 ? (
              tokens
                .sort((a, b) => b.totalUSD - a.totalUSD)
                .map(token => {
                  return (
                    <CrossDaoInternalBalanceListCard
                      key={token?.id}
                      token={token}
                      currentDaoTokens={currentDaoTokens}
                    />
                  );
                })
            ) : (
              <Text fontFamily='mono' mt='5'>
                No unclaimed internal balances
              </Text>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </ContentBox>
  );
};

export default CrossDaoInternalBalanceList;
