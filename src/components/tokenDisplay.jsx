import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Box, Flex } from '@chakra-ui/layout';

import TokenIndicator from './tokenIndicator';
import TextIndicator from './textIndicator';

import { TokenService } from '../services/tokenService';
import { getTokenData } from '../utils/tokenValue';
import { getExplorerLink } from '../utils/tokenExplorerApi';

const TokenDisplay = ({ tokenAddress }) => {
  const { daochain } = useParams();

  const [geckoData, setGeckoData] = useState(null);
  const [tokenData, setTokenData] = useState(null);

  const price = geckoData?.market_data?.current_price?.usd;
  const symbol = geckoData?.symbol?.toUpperCase() || tokenData?.symbol;
  const explorerLink = getExplorerLink(tokenAddress, daochain);
  useEffect(() => {
    const fetchGeckoData = async () => {
      try {
        const data = await getTokenData(tokenAddress);
        if (data) {
          setGeckoData(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (tokenAddress) {
      fetchGeckoData();
    }
  }, [tokenAddress]);

  useEffect(() => {
    const fetchTokenData = async () => {
      const tokenService = TokenService({ chainID: daochain, tokenAddress });
      try {
        const symbol = await tokenService('symbol')();
        const name = await tokenService('name')();
        const decimals = await tokenService('decimals')();
        const data = { symbol, name, decimals };
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
        {(geckoData || tokenData) && (
          <TokenIndicator
            tokenAddress={tokenAddress}
            parentData={geckoData || tokenData}
            explorerLink={explorerLink}
          />
        )}
      </Flex>
      <Flex w='100%' justify='space-between' mt={6} wrap='wrap'>
        {symbol && <TextIndicator label='Symbol' value={symbol} />}
        {/* Will occasionally botch decimals. Should be fixed with ProposalLegos merge */}
        {price && <TextIndicator label='USD Price' value={price} />}

        {tokenData?.decimals && (
          <TextIndicator label='decimals' value={tokenData?.decimals} />
        )}
      </Flex>
    </Box>
  );
};

export default TokenDisplay;
