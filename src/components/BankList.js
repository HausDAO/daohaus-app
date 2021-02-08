import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import TextBox from './TextBox';
import ContentBox from './ContentBox';
import BankListCard from './bankListCard';

const BankList = ({ tokens, hasBalance }) => {
  return (
    <ContentBox mt={6}>
      <Flex>
        <TextBox w='15%' size='xs'>
          Asset
        </TextBox>
        <TextBox w='55%' size='xs'>
          {'Balance'}
        </TextBox>
        <TextBox w='15%' size='xs'>
          Price
        </TextBox>
        <TextBox w='15%' size='xs'>
          Value
        </TextBox>
        {hasBalance ? <TextBox w='15%'></TextBox> : null}
      </Flex>
      {tokens ? (
        tokens?.map((token) => {
          return (
            <BankListCard
              key={token?.id}
              token={token}
              hasBalance={hasBalance}
            />
          );
        })
      ) : (
        <Text mt='5'>No unclaimed balances</Text>
      )}
    </ContentBox>
  );
};

export default BankList;
