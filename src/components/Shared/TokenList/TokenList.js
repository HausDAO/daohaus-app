import React, { useState, useEffect } from 'react';
import { Flex, Text } from '@chakra-ui/react';

import TokenListCard from './TokenListCard';
import { defaultTokens } from '../../../utils/constants';
import ContentBox from '../../Shared/ContentBox';
import TextBox from '../../Shared/TextBox';

const TokenList = ({ tokenList, isMember, isBank }) => {
  const [localTokenList, setLocalTokenList] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasAction, setHasAction] = useState();

  useEffect(() => {
    if (tokenList) {
      const sortedTokens = tokenList.sort(
        (a, b) => +b.tokenBalance - +a.tokenBalance,
      );
      setLocalTokenList(
        isBank
          ? sortedTokens
          : sortedTokens.filter((token) => +token.tokenBalance > 0),
      );
      const hasBalance =
        isMember && tokenList.some((token) => token.tokenBalance > 0);

      const needsSync =
        isBank &&
        tokenList.some((token) => {
          return (
            +token.tokenBalance > 0 &&
            token.contractTokenBalance !== token.contractBabeBalance
          );
        });

      setHasAction(hasBalance || needsSync);

      setIsLoaded(true);
    } else {
      setLocalTokenList(defaultTokens);
    }
  }, [tokenList, isMember, isBank]);

  return (
    <>
      <ContentBox mt={6}>
        <Flex>
          <TextBox w='15%'>Asset</TextBox>
          <TextBox w='55%'>{isMember ? 'Internal Balance' : 'Balance'}</TextBox>
          <TextBox w='15%'>Price</TextBox>
          <TextBox w='15%'>Value</TextBox>
          {hasAction ? <TextBox w='15%'></TextBox> : null}
        </Flex>
        {localTokenList?.length > 0 ? (
          localTokenList.map((token) => {
            return (
              <TokenListCard
                key={token?.id}
                token={token}
                isLoaded={isLoaded}
                isMember={isMember}
                isBank={isBank}
                hasAction={hasAction}
              />
            );
          })
        ) : (
          <Text mt='5'>You don&apos;t have any unclaimed balances</Text>
        )}
      </ContentBox>
    </>
  );
};

export default TokenList;
