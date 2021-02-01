import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import TextBox from './TextBox';
import ContentBox from './ContentBox';
import BankListCard from './bankListCard';

const BankList = ({ tokens }) => {
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
        {/* {false ? <TextBox w='15%'></TextBox> : null} */}
      </Flex>
      {tokens ? (
        Object.values(tokens).map((token) => {
          return <BankListCard key={token?.id} token={token} />;
        })
      ) : (
        <Text mt='5'>No unclaimed balances</Text>
      )}
    </ContentBox>
    // <div>
    //   {tokens &&
    //     Object.values(tokens).map((token) => {
    //       return (
    //         <div key={token.id}>
    //           <p>{token.symbol}</p>
    //           {token.logoUri && (
    //             <Image src={token.logoUri} height='35px' mr='15px' />
    //           )}
    //           <p>
    //             Balance:{' '}
    //             {parseFloat(
    //               +token.tokenBalance / 10 ** +token.decimals,
    //             ).toFixed(4)}{' '}
    //             {token.symbol}
    //           </p>
    //           <p>Price: ${token.usd}</p>
    //           <p>Value: ${token.totalUSD}</p>
    //         </div>
    //       );
    //     })}
    // </div>
  );
};

export default BankList;
