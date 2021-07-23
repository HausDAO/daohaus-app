import React, { useEffect, useState } from 'react';
import deepEqual from 'deep-eql';
import { Box, Text, Flex, Button, Icon, Select, Image } from '@chakra-ui/react';
import { RiAddFill } from 'react-icons/ri';
import { useDao } from '../contexts/DaoContext';
import { useOverlay } from '../contexts/OverlayContext';
import GenericModal from '../modals/genericModal';
import FieldWrapper from './fieldWrapper';

const NftSelect = ({ label, ...props }) => {
  const { setGenericModal } = useOverlay();
  const { daoVaults } = useDao();
  const [nftData, setNftData] = useState();
  const [nfts, setNfts] = useState();
  const [selected, setSelected] = useState();
  const [collections, setCollections] = useState();
  const [filter, setFilter] = useState();

  useEffect(() => {
    if (nfts) {
      setCollections(
        nfts.reduce((acc, item) => {
          if (acc.indexOf(item.name) === -1) {
            return [...acc, item.name];
          }
          return acc;
        }, []),
      );
    }
  }, [nfts]);

  useEffect(() => {
    if (daoVaults) {
      const data = daoVaults.reduce((acc, item) => [...acc, ...item.nfts], []);
      setNftData(data);
      setNfts(data);
    }
  }, [daoVaults]);

  useEffect(() => {
    if (nftData && filter) {
      const filtered = nftData.filter(item => {
        if (filter !== '') {
          return filter === item.name;
        }
        return true;
      });
      if (!deepEqual(filtered, nfts)) {
        setNfts(filtered);
      }
    }
  }, [filter, nfts]);

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
        <Select
          placeholder='Filter by Collection'
          onChange={e => setFilter(e.nativeEvent.target.value)}
        >
          {collections?.map(collection => (
            <option value={collection} key={collection}>
              {collection}
            </option>
          ))}
        </Select>
        {nfts?.map((nft, i) => (
          <Box key={i} mt={5}>
            <Flex mb={5} alignItems='center' justify='space-between'>
              <Text textTransform='uppercase' fontFamily='header'>
                {nft.metadata.name}
              </Text>
              <Button
                onClick={() => {
                  setGenericModal({});
                  setSelected(nft);
                }}
              >
                Select
              </Button>
            </Flex>
            <Image src={nft.metadata.image} />
          </Box>
        ))}
      </Box>
    </GenericModal>
  );

  return (
    <FieldWrapper {...props}>
      <Box>
        <Text mb={3}>{label}</Text>
        {selected ? (
          <Image
            onClick={() => {
              setGenericModal({ nftSelect: true });
            }}
            _hover={{
              opacity: 0.5,
              cursor: 'pointer',
            }}
            src={selected.metadata.image}
            w='300px'
            h='300px'
          />
        ) : (
          <Button
            variant='nftSelect'
            onClick={() => {
              setGenericModal({ nftSelect: true });
            }}
          >
            <Icon w={50} h={50} color='primary.500' as={RiAddFill} />
          </Button>
        )}
      </Box>
      {selectModal}
    </FieldWrapper>
  );
};

export default NftSelect;
