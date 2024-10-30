import React from 'react';
import { Flex, Text, Box } from '@chakra-ui/react';

import BankListCard from './bankListCard';
import ContentBox from './ContentBox';
import TextBox from './TextBox';

const BankList = ({ tokens, profile, hasBalance, needsSync }) => {
  const hasAction = hasBalance || needsSync;

  return (
    <ContentBox mt={6}>
      <Flex>
        <Box w='20%' d={['none', null, null, 'inline-block']}>
          <TextBox size='xs'>Asset</TextBox>
        </Box>
        <Box w={['45%', null, null, '45%']}>
          <TextBox size='xs'>{profile ? 'Internal Bal.' : 'Balance'}</TextBox>
        </Box>
        <Box
          w={hasAction ? '15%' : '20%'}
          d={['none', null, null, 'inline-block']}
        >
          <TextBox size='xs'>Price</TextBox>
        </Box>
        <Box
          w={[hasAction ? '30%' : '40%', null, null, hasAction ? '15%' : '20%']}
        >
          <TextBox size='xs'>Value</TextBox>
        </Box>

        {hasAction ? <Box w={['25%', null, null, '20%']} /> : null}
      </Flex>
      {tokens ? (
        tokens
          .sort((a, b) => b.totalUSD - a.totalUSD)
          .map(token => {
            return (
              <BankListCard
                key={token?.id}
                token={token}
                hasBalance={hasBalance}
                hasSync={needsSync}
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

export default BankList;
