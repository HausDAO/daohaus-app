import React, { useState, useEffect } from 'react';
import { Flex, Text } from '@chakra-ui/react';

import TokenListCard from './TokenListCard';
import ContentBox from '../../Shared/ContentBox';
import TextBox from '../../Shared/TextBox';

const TokenList = ({ tokenList, isMember, isBank, version }) => {
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
          if (version === '2.1') {
            return token.contractBalances.token !== token.contractBalances.babe;
          } else {
            return (
              +token.tokenBalance > 0 &&
              token.contractBalances.token !== token.contractBalances.babe
            );
          }
        });

      setHasAction(hasBalance || needsSync);

      setIsLoaded(true);
    }
  }, [tokenList, isMember, isBank, version]);

  return (
    <>
      <ContentBox mt={6}>
        <Flex>
          <TextBox w='15%' size='xs'>
            Asset
          </TextBox>
          <TextBox w='55%' size='xs'>
            {isMember ? 'Internal Balance' : 'Balance'}
          </TextBox>
          <TextBox w='15%' size='xs'>
            Price
          </TextBox>
          <TextBox w='15%' size='xs'>
            Value
          </TextBox>
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
                version={version}
              />
            );
          })
        ) : (
          <Text mt='5'>No unclaimed balances</Text>
        )}
      </ContentBox>
    </>
  );
};

export default TokenList;
