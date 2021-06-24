import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Flex, Image, Button } from '@chakra-ui/react';

import ContentBox from './ContentBox';
import AddressAvatar from './addressAvatar';

const VaultNftCard = ({ nft }) => {
  const { daoid, daochain } = useParams();

  return (
    <ContentBox w='100%'>
      <Flex direction='row' align='center' justify='flex-start' w='100%' mb={5}>
        <Box size='s'>{nft.name}</Box>

        <Box size='s' color='secondary.500' ml='auto' mr={5}>
          View
        </Box>
        <Button pl={5} pr={5} lineHeight='50%'>
          ···
        </Button>
      </Flex>
      <Flex justify='center' w='100%' mb={5}>
        <Image src={nft.imageUrl} height={[150, 200, 200, 300]} />
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
