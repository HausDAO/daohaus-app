import React, { useMemo } from 'react';
import { Box, Flex, Image } from '@chakra-ui/react';

import ContentBox from './ContentBox';
import AddressAvatar from './addressAvatar';
import { hydrateNftCard } from '../utils/nftVaults';
import NftCardActionMenu from './nftCardActionMenu';

const VaultNftCard = ({ nft }) => {
  const hydratedNft = useMemo(() => {
    if (nft) {
      return hydrateNftCard(nft);
    }
  }, [nft]);

  return (
    <ContentBox w='100%' mt={5}>
      <Flex
        direction='row'
        align='center'
        justify='space-between'
        w='100%'
        mb={5}
      >
        <Box size='xs'>{hydratedNft.name}</Box>

        {/* <Box size='xs' color='secondary.500'>
          View
        </Box> */}
        <NftCardActionMenu nft={hydratedNft} />
      </Flex>
      <Flex justify='center' w='100%' mb={5}>
        <Image src={hydratedNft?.metadata?.image} height='200px' />
      </Flex>

      <Flex
        direction='row'
        align='center'
        justify='space-between'
        w='100%'
        mt={5}
      >
        {hydratedNft.creator && (
          <Box size='xs' fontFamily='mono'>
            Creator
            <AddressAvatar addr={hydratedNft.creator} hideCopy alwaysShowName />
          </Box>
        )}
        {hydratedNft.lastPrice && (
          <Box size='xs' fontFamily='mono'>
            Last Price
            <Box>{hydratedNft.lastPrice} ETH</Box>
          </Box>
        )}
      </Flex>
    </ContentBox>
  );
};

export default VaultNftCard;
