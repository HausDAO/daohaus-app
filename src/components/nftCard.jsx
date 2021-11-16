import React, { useState, useMemo } from 'react';
import { Box, Flex, Image, AspectRatio } from '@chakra-ui/react';

import { useOverlay } from '../contexts/OverlayContext';
import ContentBox from './ContentBox';
import AddressAvatar from './addressAvatar';
import NftViewModal from '../modals/nftViewModal';
import NftCardActionMenu from './nftCardActionMenu';
import { hydrateNftCard } from '../utils/nftData';

import NFTImage from '../assets/img/nft-placeholder.png';

const NftCard = ({ nft, minion, minionType, vault, ...props }) => {
  const { setNftViewModal } = useOverlay();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hydratedNft = useMemo(() => {
    if (nft) {
      return hydrateNftCard(nft);
    }
  }, [nft]);

  const setModal = () => {
    setNftViewModal(hydratedNft || nft);
  };

  return (
    <ContentBox mt={5} {...props}>
      <Flex
        direction='row'
        align='center'
        justify='space-between'
        w='100%'
        mb={5}
      >
        <Box size='xs' noOfLines={1}>
          {hydratedNft?.metadata?.name || hydratedNft.name}
        </Box>

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
        <NftCardActionMenu
          nft={hydratedNft}
          vault={vault}
          minion={minion}
          minionType={minionType}
        />
      </Flex>
      <AspectRatio
        ratio={1}
        maxWidth={300}
        maxHeight={300}
        m='auto'
        mb={5}
        sx={{
          '&>img': {
            objectFit: 'contain',
          },
        }}
      >
        <Flex direction='column'>
          <Image
            src={
              imageLoaded && !imageError && hydratedNft?.image
                ? hydratedNft.image
                : NFTImage
            }
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            margin='auto'
          />
          {imageError && <Box marginTop='-80px'>Could not load image</Box>}
        </Flex>
      </AspectRatio>
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
