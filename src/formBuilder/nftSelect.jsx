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
import { LOCAL_ABI } from '../utils/abi';
import { createContract } from '../utils/contract';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { supportedChains } from '../utils/chain';

const NftSelect = props => {
  const { label, localForm, htmlFor, name, localValues } = props;
  const { register, setValue, watch } = localForm;
  const { daochain, daoid } = useParams();
  const { setGenericModal } = useOverlay();
  const { daoVaults } = useDao();
  const { injectedProvider } = useInjectedProvider();
  const [nftData, setNftData] = useState();
  const [nfts, setNfts] = useState();
  const [selected, setSelected] = useState();
  const [collections, setCollections] = useState();
  const [filter, setFilter] = useState();

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const paymentToken = watch('paymentToken');
  const nftAddress = watch('nftAddress');
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
        nftContract: nftAddress,
        tokenId,
        tokenAddress: paymentToken,
        price: sellPrice,
        minionAddress: selectedMinion,
        startDate,
        endDate,
      });
      const encodedOrder = await encodeOrder(orderObj, daochain);
      console.log('encodedOrder', encodedOrder);
      const eip712 = getMessageHash(encodedOrder);
      console.log('eip712', eip712);
      const ipfsHash = await pinOrderToIpfs(encodedOrder, daoid);
      console.log('ipfsHash', ipfsHash);

      setValue('eip712HashValue', eip712);
      setValue('ipfsOrderHash', ipfsHash.IpfsHash);
      setValue('signatureHash', getSignatureHash());
    };
    if (
      startDate &&
      endDate &&
      paymentToken &&
      nftAddress &&
      sellPrice &&
      selectedMinion
    ) {
      setupOrder();
    }
  }, [
    startDate,
    endDate,
    paymentToken,
    nftAddress,
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
    const setUpNftValues = async () => {
      const nftContract = createContract({
        address: selected.contractAddress,
        abi: LOCAL_ABI.ERC_721,
        chainID: daochain,
        web3: injectedProvider,
      });

      const approvedForAll = await nftContract.methods
        .isApprovedForAll(
          selectedMinion,
          supportedChains[daochain].rarible.nft_transfer_proxy,
        )
        .call();

      console.log('approvedForAll', approvedForAll);
      // TODO: can't actually change the tx element from here - maybe set a value to toggle on later?

      // if (!approvedForAll) {
      //   console.log('')
      // }
      // const tokenId = await nftContract.methods
      //   .inkTokenByIndex(ipfsHash, 0)
      //   .call();
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
    };
    if (selected && selectedMinion) {
      setUpNftValues();
    }
  }, [selected, selectedMinion]);

  useEffect(() => {
    if (
      localValues &&
      localValues.tokenId &&
      localValues.contractAddress &&
      nfts
    ) {
      setSelected(
        nfts.filter(
          item =>
            item.tokenId === localValues.tokenId &&
            item.contractAddess === localValues.contractAddess,
        )[0],
      );
    }
  }, [localValues, nfts]);

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
