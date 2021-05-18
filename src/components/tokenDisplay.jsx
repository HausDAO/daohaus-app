import React, { useEffect, useState } from 'react';
import { Flex } from '@chakra-ui/layout';

import TokenIndicator from './tokenIndicator';

import { getTokenData } from '../utils/tokenValue';

const TokenDisplay = ({ tokenAddress }) => {
  const [tokenData, setTokenData] = useState(null);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const data = await getTokenData(tokenAddress);
        console.log(data);
        setTokenData(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (tokenAddress) {
      fetchTokenData();
    }
  }, [tokenAddress]);
  return (
    <Flex w='100%' justify='space-between' mt={6} wrap='wrap'>
      <TokenIndicator tokenDataFromParent={tokenData} />
    </Flex>
  );
};

export default TokenDisplay;
