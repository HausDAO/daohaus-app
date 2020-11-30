import React, { useState, useEffect } from 'react';
import { Flex } from '@chakra-ui/core';

import TokenListCard from './TokenListCard';
import { defaultTokens } from '../../../utils/constants';
import ContentBox from '../../Shared/ContentBox';
import TextBox from '../../Shared/TextBox';

const TokenList = ({ tokenList, isMember }) => {
  const [localTokenList, setLocalTokenList] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasBalance, setHasBalance] = useState();

  useEffect(() => {
    if (tokenList) {
      console.log('tokenList', tokenList);
      setLocalTokenList(tokenList);
      setHasBalance(
        isMember && tokenList.some((token) => token.tokenBalance > 0),
      );
      setIsLoaded(true);
    } else {
      setLocalTokenList(defaultTokens);
    }
  }, [tokenList, isMember]);

  return (
    <ContentBox mt={6}>
      <Flex>
        <TextBox w='15%'>Asset</TextBox>
        <TextBox w='55%'>Balance</TextBox>
        <TextBox w='15%'>Price</TextBox>
        <TextBox w='15%'>Value</TextBox>
        {hasBalance ? <TextBox w='15%'></TextBox> : null}
      </Flex>
      {localTokenList?.length > 0 &&
        localTokenList.map((token) => {
          return (
            <TokenListCard
              key={token?.id}
              token={token}
              isLoaded={isLoaded}
              hasBalance={hasBalance}
            />
          );
        })}
    </ContentBox>
  );
};

export default TokenList;
