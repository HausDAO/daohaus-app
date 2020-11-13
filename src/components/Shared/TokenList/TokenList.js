import React, { useState, useEffect } from 'react';
import { Box, Flex } from '@chakra-ui/core';

import TokenListCard from './TokenListCard';
import { defaultTokens } from '../../../utils/constants';

const TokenList = ({ tokenList }) => {
  const [localTokenList, setLocalTokenList] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (tokenList) {
      setLocalTokenList(tokenList);
      setIsLoaded(true);
    } else {
      setLocalTokenList(defaultTokens);
    }
  }, [tokenList]);

  return (
    <Box
      rounded='lg'
      bg='blackAlpha.600'
      borderWidth='1px'
      borderColor='whiteAlpha.200'
      w='100%'
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
      {localTokenList?.length > 0 &&
        localTokenList.map((token) => {
          return (
            <TokenListCard key={token?.id} token={token} isLoaded={isLoaded} />
          );
        })}
    </Box>
  );
};

export default TokenList;
