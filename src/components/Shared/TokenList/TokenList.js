import React, { useState, useEffect } from 'react';
import { Flex } from '@chakra-ui/react';

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
      setLocalTokenList(tokenList);

      const hasBalance =
        isMember && tokenList.some((token) => token.tokenBalance > 0);

      const needsSync =
        isBank &&
        tokenList.some(
          (token) => token.contractTokenBalance !== token.contractBabeBalance,
        );

      setHasAction(hasBalance || needsSync);

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
        {hasAction ? <TextBox w='15%'></TextBox> : null}
      </Flex>
      {localTokenList?.length > 0 &&
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
        })}
    </ContentBox>
  );
};

export default TokenList;
