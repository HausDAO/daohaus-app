import React, { useEffect, useState } from 'react';
import { Flex, Text, Box } from '@chakra-ui/react';
import { useParams } from 'react-router';
import TextBox from './TextBox';
import ContentBox from './ContentBox';
import MinionTokenListCard from './minionTokenListCard';
import {
  getBlockScoutTokenData,
  getEtherscanTokenData,
} from '../utils/tokenExplorerApi';

const MinionTokenList = ({ minion, action }) => {
  const [tokens, setTokens] = useState();
  const { daochain } = useParams();

  useEffect(() => {
    const getContractBalance = async () => {
      try {
        if (daochain === '0x1' || daochain === '0x4' || daochain === '0x2a') {
          // eth chains not supported yet
          // may need to do something different for matic too
          setTokens(await getEtherscanTokenData(minion, daochain));
        } else {
          setTokens(await getBlockScoutTokenData(minion));
        }
      } catch (err) {
        console.error(err);
      }
    };
    getContractBalance();
  }, [minion]);

  return (
    <ContentBox mt={6}>
      <Flex>
        <Box w='15%' d={['none', null, null, 'inline-block']}>
          <TextBox size='xs'>Asset</TextBox>
        </Box>
        <Box w={['60%', null, null, '50%']}>
          <TextBox size='xs'>Balance</TextBox>
        </Box>
        <Box w='20%' d={['none', null, null, 'inline-block']}>
          <TextBox size='xs'>Price</TextBox>
        </Box>
        <Box w={['20%', null, null, '20%']}>
          <TextBox size='xs'>Value</TextBox>
        </Box>
        <Box w={['20%', null, null, '20%']}>
          <TextBox size='xs'>Actions</TextBox>
        </Box>
      </Flex>
      {tokens ? (
        tokens.map(token => {
          return (
            <MinionTokenListCard
              key={token?.contractAddress}
              token={token}
              action={action}
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

export default MinionTokenList;
