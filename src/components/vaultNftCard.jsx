import React from 'react';
import { Box, Flex, Image } from '@chakra-ui/react';

import ContentBox from './ContentBox';
import AddressAvatar from './addressAvatar';

const VaultNftCard = ({ nft }) => {
  return (
    <ContentBox w='100%' mt={5}>
      <Flex
        direction='row'
        align='center'
        justify='space-between'
        w='100%'
        mb={5}
      >
        <Box size='xs'>{nft.name}</Box>

        <Box size='xs' color='secondary.500'>
          View
        </Box>
      </Flex>
      <Flex justify='center' w='100%' mb={5}>
        <Image src={nft.imageUrl} height='200px' />
      </Flex>

      <Flex
        direction='row'
        align='center'
        justify='space-between'
        w='100%'
        mt={5}
      >
        <Box size='xs' fontFamily='mono'>
          Creator
          <AddressAvatar addr={nft.creator} hideCopy alwaysShowName />
        </Box>
        <Box size='xs' fontFamily='mono'>
          Last Price
          <Box>{nft.lastPrice} ETH</Box>
        </Box>
      </Flex>
    </ContentBox>
  );
};

export default VaultNftCard;
