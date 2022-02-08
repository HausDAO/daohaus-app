import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/layout';

import { useToken } from '../contexts/TokenContext';
import TextIndicator from './textIndicator';
import TokenIndicator from './tokenIndicator';
import { createContract } from '../utils/contract';
import { LOCAL_ABI } from '../utils/abi';

const TokenDisplay = ({ tokenAddress }) => {
  const { daochain } = useParams();
  const { getTokenPrice } = useToken();

  const [tokenData, setTokenData] = useState(null);
  const usdPrice = getTokenPrice(tokenAddress);

  useEffect(() => {
    const fetchTokenData = async () => {
      const tokenContract = createContract({
        address: tokenAddress,
        abi: LOCAL_ABI.ERC_20,
        chainID: daochain,
      });

      try {
        const symbol = await tokenContract.methods.symbol().call();
        const decimals = await tokenContract.methods.decimals().call();
        const data = { symbol, decimals };
        setTokenData(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (tokenAddress) {
      fetchTokenData();
    }
  }, [tokenAddress, daochain]);
  return (
    <Box>
      <Flex w='100%' justify='space-between' mt={6} wrap='wrap'>
        {tokenAddress && <TokenIndicator tokenAddress={tokenAddress} />}
      </Flex>
      <Flex w='100%' justify='space-between' mt={6} wrap='wrap'>
        {tokenData?.symbol && (
          <TextIndicator label='Symbol' value={tokenData.symbol} />
        )}
        {/* Will occasionally botch decimals. Should be fixed with ProposalLegos merge */}
        {usdPrice && <TextIndicator label='USD Price' value={usdPrice} />}
        {tokenData?.decimals && (
          <TextIndicator label='decimals' value={tokenData?.decimals} />
        )}
      </Flex>
    </Box>
  );
};

export default TokenDisplay;
