import React, { useEffect, useState } from 'react';
import deepEqual from 'deep-eql';
import {
  Box,
  Text,
  Flex,
  Button,
  Icon,
  Select,
  Image,
  Input,
} from '@chakra-ui/react';
import { RiAddFill } from 'react-icons/ri';
import { useParams } from 'react-router';
import { useDao } from '../contexts/DaoContext';
import { useOverlay } from '../contexts/OverlayContext';
import GenericModal from '../modals/genericModal';
import FieldWrapper from './fieldWrapper';
import {
  buildEncodeOrder,
  encodeOrder,
  getMessageHash,
  getSignatureHash,
  pinOrderToIpfs,
} from '../utils/rarible';

const NftSelect = props => {
  const { label, localForm, htmlFor, name } = props;
  const { register, setValue, watch } = localForm;
  const { daochain, daoid } = useParams();
  const { setGenericModal } = useOverlay();
  const { daoVaults } = useDao();
  const [nftData, setNftData] = useState();
  const [nfts, setNfts] = useState();
  const [selected, setSelected] = useState();
  const [collections, setCollections] = useState();
  const [filter, setFilter] = useState();

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const paymentToken = watch('paymentToken');
  const nftSelect = watch('nftSelect');
  const sellPrice = watch('sellPrice');
  const tokenId = watch('tokenId');
  const selectedMinion = watch('selectedMinion');

  useEffect(() => {
    register('ipfsOrderHash');
    register('eip712HashValue');
    register('signatureHash');
    register('tokenId');
    register('description');
    register('image');
  }, []);

  useEffect(() => {
    const setupOrder = async () => {
      const orderObj = buildEncodeOrder({
        nftContract: nftSelect,
        tokenId,
        tokenAddress: paymentToken,
        price: sellPrice,
        minionAddress: selectedMinion,
        // TODO: Set this in date range input
        startDate: parseInt(new Date(startDate).getTime() / 1000),
        endDate: parseInt(new Date(endDate).getTime() / 1000),
      });
      const encodedOrder = await encodeOrder(orderObj, daochain);
      console.log('encodedOrder', encodedOrder);
      const eip712 = getMessageHash(encodedOrder);
      console.log('eip712', eip712);
      const ipfsHash = await pinOrderToIpfs(encodedOrder, daoid);
      console.log('ipfsHash', ipfsHash);

      setValue('eip712HashValue', eip712);
      setValue('ipfsOrderHash', ipfsHash);
      setValue('signatureHash', getSignatureHash());
    };
    if (
      startDate &&
      endDate &&
      paymentToken &&
      nftSelect &&
      sellPrice &&
      selectedMinion
    ) {
      setupOrder();
    }
  }, [
    startDate,
    endDate,
    paymentToken,
    nftSelect,
    sellPrice,
    tokenId,
    selectedMinion,
  ]);

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

  useEffect(() => {
    if (selected) {
      console.log('selected', selected);
      setValue(name, selected.contractAddress);
      setValue('tokenId', selected.tokenId);
      setValue(
        'description',
        `Selling ${selected.metadata?.name || selected.name} tokenId ${
          selected.tokenId
        }`,
      );
      setValue(
        'image',
        selected.metadata?.image_url || selected.metadata?.image,
      );
    }
  }, [selected]);

  const openModal = () => {
    setGenericModal({ nftSelect: true });
  };

  const selectNft = e => {
    const nft = nfts[e.nativeEvent.target.value];
    setGenericModal({});
    setSelected(nft);
  };

  const onFilterChange = e => setFilter(e.nativeEvent.target.value);

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
        <Select placeholder='Filter by Collection' onChange={onFilterChange}>
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
              <Button value={i} onClick={selectNft}>
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
    <FieldWrapper>
      <Input type='hidden' id={htmlFor} name={name} ref={register} />
      <Box>
        <Text mb={3}>{label}</Text>
        {selected ? (
          <Image
            onClick={openModal}
            _hover={{
              opacity: 0.5,
              cursor: 'pointer',
            }}
            src={selected.metadata.image}
            w='300px'
            h='300px'
          />
        ) : (
          <Button variant='nftSelect' onClick={openModal}>
            <Icon w={50} h={50} color='primary.500' as={RiAddFill} />
          </Button>
        )}
      </Box>
      {selectModal}
    </FieldWrapper>
  );
};

export default NftSelect;
