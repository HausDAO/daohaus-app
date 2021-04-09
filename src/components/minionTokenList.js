import React from 'react';
import { Flex, Text, Box } from '@chakra-ui/react';
import TextBox from './TextBox';
import ContentBox from './ContentBox';
import MinionTokenListCard from './minionTokenListCard';

const MinionTokenList = ({ tokens }) => {
  return (
    <ContentBox mt={6}>
      <Flex>
        <Box w={'15%'} d={['none', null, null, 'inline-block']}>
          <TextBox size='xs'>Asset</TextBox>
        </Box>
        <Box w={['60%', null, null, '50%']}>
          <TextBox size='xs'>Balance</TextBox>
        </Box>
        <Box w={'20%'} d={['none', null, null, 'inline-block']}>
          <TextBox size='xs'>Price</TextBox>
        </Box>
        <Box w={['40%', null, null, '20%']}>
          <TextBox size='xs'>Value</TextBox>
        </Box>
      </Flex>
      {tokens ? (
        tokens
          .sort((a, b) => b.balance - a.balance)
          .map((token) => {
            return (
              <MinionTokenListCard key={token?.contractAddress} token={token} />
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

export default MinionTokenList;
