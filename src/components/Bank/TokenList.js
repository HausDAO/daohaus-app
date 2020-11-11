import React, { useState, useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/core';

import { useDaoGraphData } from '../../contexts/PokemolContext';
import TokenListCard from './TokenListCard';
import { defaultTokens } from '../../utils/constants';

const TokenList = () => {
  const [dao] = useDaoGraphData();
  const [tokenList, setTokenList] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  console.log(dao);

  useEffect(() => {
    if (dao?.tokenBalances) {
      console.log(dao?.tokenBalances);
      setTokenList(dao?.tokenBalances);
      setIsLoaded(true);
    } else {
      setTokenList(defaultTokens);
    }
  }, [dao]);

  return (
    <Box
      rounded='lg'
      bg='blackAlpha.600'
      borderWidth='1px'
      borderColor='whiteAlpha.200'
      p={6}
      m={6}
    >
      <Flex mb={5}>
        <Box
          w='15%'
          textTransform='uppercase'
          fontFamily='heading'
          fontSize='sm'
          fontWeight={700}
        >
          Asset
        </Box>
        <Box
          w='55%'
          textTransform='uppercase'
          fontFamily='heading'
          fontSize='sm'
          fontWeight={700}
        >
          Balance
        </Box>
        <Box
          w='15%'
          textTransform='uppercase'
          fontFamily='heading'
          fontSize='sm'
          fontWeight={700}
        >
          Price
        </Box>
        <Box
          w='15%'
          textTransform='uppercase'
          fontFamily='heading'
          fontSize='sm'
          fontWeight={700}
        >
          Value
        </Box>
      </Flex>
      {tokenList?.length > 0 &&
        tokenList.map((token) => {
          return (
            <TokenListCard key={token?.id} token={token} isLoaded={isLoaded} />
          );
        })}
    </Box>
  );
};

export default TokenList;
