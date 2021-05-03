import React from 'react';
import { Flex, Text, Box } from '@chakra-ui/react';

import TextBox from './TextBox';
import ContentBox from './ContentBox';
import HubBalanceListCard from './hubBalanceListCard';

const HubBalanceList = ({ tokens, withdraw, currentDaoTokens }) => {
  return (
    <ContentBox mt={6}>
      <Flex>
        <Box w='20%' d={['none', null, null, 'inline-block']}>
          <TextBox size='xs'>DAO</TextBox>
        </Box>
        <Box w='20%' d={['none', null, null, 'inline-block']}>
          <TextBox size='xs'>Network</TextBox>
        </Box>
        <Box w='20%' d={['none', null, null, 'inline-block']}>
          <TextBox size='xs'>Asset</TextBox>
        </Box>
        <Box w={['25%', null, null, '25%']}>
          <TextBox size='xs'>Balance</TextBox>
        </Box>

        <Box w={['45%', null, null, '45%']} />
      </Flex>
      {tokens ? (
        tokens
          .sort((a, b) => b.totalUSD - a.totalUSD)
          .map(token => {
            return (
              <HubBalanceListCard
                key={token?.id}
                token={token}
                withdraw={withdraw}
                currentDaoTokens={currentDaoTokens}
              />
            );
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
