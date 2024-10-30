import React, { useState } from 'react';
import {
  Image,
  Center,
  Flex,
  Box,
  Modal,
  ModalOverlay,
  ModalCloseButton,
  Link,
} from '@chakra-ui/react';
import { rgba } from 'polished';

import { useOverlay } from '../contexts/OverlayContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import AddressAvatar from '../components/addressAvatar';

import NFTImage from '../assets/img/nft-placeholder.png';

const NftViewModal = () => {
  const { nftViewModal, setNftViewModal } = useOverlay();
  const { theme } = useCustomTheme();

  const closeModal = () => setNftViewModal({});

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Modal
      isOpen={nftViewModal}
      closeOnEsc={false}
      onClose={closeModal}
      closeOnOverlayClick
      isCentered
    >
      {nftViewModal && Object.keys(nftViewModal).length > 0 && (
        <ModalOverlay
          bgColor={rgba(theme.colors.background[500], 0.8)}
          style={{ backdropFilter: 'blur(6px)' }}
        >
          <Flex
            w='100%'
            h='100%'
            alignItems='center'
            justifyContent='center'
            overflow='scroll'
          >
            <Flex
              alignItems='start'
              justifyContent='center'
              flexDir={['column', 'column', 'row']}
            >
              <Flex direction='column'>
                <Image
                  p={5}
                  maxHeight={['100%', '50vh']}
                  maxWidth={['100%', '50vh']}
                  fit='contain'
                  objectFit='contain'
                  src={
                    imageLoaded && !imageError && nftViewModal?.image
                      ? nftViewModal.image
                      : NFTImage
                  }
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
                {imageError && (
                  <Center>
                    <Box marginTop='-120px'>Could not load image</Box>
                  </Center>
                )}
              </Flex>
              <Flex
                w='100%'
                d='column'
                alignItems='center'
                justifyContent='center'
              >
                <Flex
                  minWidth={['100%', '200px']}
                  maxWidth={['100%', '50vh', '400px']}
                  p={5}
                  alignItems='center'
                  justifyContent='start'
                >
                  <Box w='100%' pos='relative'>
                    <Flex
                      fontFamily='body'
                      textTransform='uppercase'
                      fontSize='xl'
                      fontWeight={400}
                      color='white'
                      dir='row'
                      mb={5}
                    >
                      {nftViewModal.name}
                      <ModalCloseButton ml='auto' top={0} right={0} />
                    </Flex>
                    <Box
                      fontFamily='body'
                      textTransform='uppercase'
                      fontSize='m'
                      fontWeight={400}
                      color='white'
                      lineHeight={2}
                      mb={5}
                    >
                      {nftViewModal.metadata?.description}
                    </Box>
                    <Flex
                      direction='row'
                      align='center'
                      justify='space-between'
                      w='100%'
                      mt={5}
                      mb={5}
                    >
                      {nftViewModal.creator && (
                        <Box size='xs' fontFamily='mono'>
                          Creator
                          <AddressAvatar
                            addr={nftViewModal.creator}
                            hideCopy
                            alwaysShowName
                          />
                        </Box>
                      )}
                      {nftViewModal.lastPrice && (
                        <Box size='xs' fontFamily='mono'>
                          Last Price
                          <Box>{nftViewModal.lastPrice} ETH</Box>
                        </Box>
                      )}
                      {!nftViewModal.lastPrice && nftViewModal.name && (
                        <Box size='xs' fontFamily='mono'>
                          Created on
                          <Box>{nftViewModal.name}</Box>
                        </Box>
                      )}
                    </Flex>
                    {nftViewModal.name && nftViewModal.metadata?.external_url && (
                      <Box
                        as={Link}
                        href={nftViewModal.metadata?.external_url}
                        isExternal
                        size='xl'
                        color='secondary.500'
                        _hover={{ cursor: 'pointer' }}
                      >
                        View on {nftViewModal.name}
                      </Box>
                    )}
                  </Box>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </ModalOverlay>
      )}
    </Modal>
  );
};

export default NftViewModal;
