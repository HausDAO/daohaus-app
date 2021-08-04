import React, { useMemo } from 'react';
import { Box, Flex, Image } from '@chakra-ui/react';

import { useOverlay } from '../contexts/OverlayContext';
import ContentBox from './ContentBox';
import AddressAvatar from './addressAvatar';
import NftViewModal from '../modals/nftViewModal';
import NftCardActionMenu from './nftCardActionMenu';
import { hydrateNftCard } from '../utils/nftVaults';

const NftCard = ({ nft, minion }) => {
  const { setNftViewModal } = useOverlay();

  const hydratedNft = useMemo(() => {
    if (nft) {
      return hydrateNftCard(nft);
    }
  }, [nft]);

  const setModal = () => {
    setNftViewModal(hydratedNft || nft);
  };

  return (
    <ContentBox w='100%' mt={5}>
      <Flex
        direction='row'
        align='center'
        justify='space-between'
        w='100%'
        mb={5}
      >
        <Box size='xs'>{hydratedNft?.metadata?.name || hydratedNft.name}</Box>

        <Box
          size='xs'
          color='secondary.500'
          ml='auto'
          mr={5}
          onClick={setModal}
          _hover={{ cursor: 'pointer' }}
        >
          View
        </Box>
        <NftCardActionMenu nft={hydratedNft} minion={minion} />
      </Flex>
      <Flex justify='center' w='100%' mb={5}>
        <Image
          src={hydratedNft?.metadata?.image}
          height={[200, null, null, 300]}
          fit='contain'
          objectFit='contain'
        />
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
        {!hydratedNft.lastPrice && hydratedNft.name && (
          <Box size='xs' fontFamily='mono'>
            Created on
            <Box>{hydratedNft.name}</Box>
          </Box>
        )}
      </Flex>
      <NftViewModal />
    </ContentBox>
  );
};

export default NftCard;
