import React from 'react';
import { Flex, Text, Box } from '@chakra-ui/react';

import TextBox from './TextBox';
import ContentBox from './ContentBox';
import HubBalanceListCard from './hubBalanceListCard';

const HubBalanceList = ({ tokens }) => {
  return (
    <ContentBox mt={6} maxW='800px'>
      <Flex>
        <Box w={'20%'} d={['none', null, null, 'inline-block']}>
          <TextBox size='xs'>Asset</TextBox>
        </Box>
        <Box w={['45%', null, null, '45%']}>
          <TextBox size='xs'>Internal Balance</TextBox>
        </Box>

        <Box w={['25%', null, null, '20%']}></Box>
      </Flex>
      {tokens ? (
        tokens
          .sort((a, b) => b.totalUSD - a.totalUSD)
          .map((token) => {
            return <HubBalanceListCard key={token?.id} token={token} />;
          })
      ) : (
        <Text fontFamily='mono' mt='5'>
          No unclaimed balances
        </Text>
      )}
    </ContentBox>
  );
};

export default HubBalanceList;
