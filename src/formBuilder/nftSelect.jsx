import React, { useEffect, useState } from 'react';
import { Box, Text, Button, Icon, Select } from '@chakra-ui/react';
import { RiAddFill } from 'react-icons/ri';
import { useDao } from '../contexts/DaoContext';
import { useOverlay } from '../contexts/OverlayContext';
import GenericModal from '../modals/genericModal';

const NftSelect = ({ label }) => {
  const { setGenericModal } = useOverlay();
  const { daoVaults } = useDao();
  const [nfts, setNfts] = useState();
  const [collections, setCollections] = useState();

  useEffect(() => {
    if (nfts) {
      nfts.reduce((acc, item) => {
        if (acc.indexOf(item.collection) !== -1) {
          return [...acc, item.collection];
        }
        return acc;
      }, []);
    }
  }, [nfts]);

  useEffect(() => {
    if (daoVaults) {
      setNfts(daoVaults.reduce((acc, item) => [...acc, ...item.nfts], []));
    }
  }, [daoVaults]);

  const selectModal = (
    <GenericModal closeOnOverlayClick modalId='nftSelect'>
      <Box>
        <Box
          fontFamily='heading'
          textTransform='uppercase'
          fontSize='xs'
          fontWeight={700}
          color='#7579C5'
          mb={4}
        >
          Select An NFT
        </Box>
        <Select placeholder='Filter by Collection' />
      </Box>
    </GenericModal>
  );

  return (
    <>
      <Box>
        <Text mb={3}>{label}</Text>
        <Button
          variant='nftSelect'
          onClick={() => {
            setGenericModal({ nftSelect: true });
          }}
        >
          <Icon w={50} h={50} color='primary.500' as={RiAddFill} />
        </Button>
      </Box>
      {selectModal}
    </>
  );
};

export default NftSelect;
