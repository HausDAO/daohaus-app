import React, { useEffect, useState } from 'react';
import { RiAddFill } from 'react-icons/ri';
import {
  Box,
  Text,
  Flex,
  Button,
  Icon,
  Select,
  Image,
  Input,
  AspectRatio,
  Spinner,
  RadioGroup,
  Stack,
  Radio,
} from '@chakra-ui/react';
import deepEqual from 'deep-eql';
import { useParams } from 'react-router-dom';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useDao } from '../contexts/DaoContext';
import { useOverlay } from '../contexts/OverlayContext';
import FieldWrapper from './fieldWrapper';
import GenericInput from './genericInput';
import TokenInfoInput from './tokenInfoInput';
import NftApproval from './nftApproval';
import GenericModal from '../modals/genericModal';
import TextBox from '../components/TextBox';
import { filterUniqueNfts, hydrate721s, hydrate1155s } from '../utils/nftData';
import { fetchErc721s, fetchErc1155s } from '../utils/theGraph';

const NftSelect = props => {
  const { address } = useInjectedProvider();
  const { daoVaults } = useDao();
  const { setGenericModal } = useOverlay();
  const { daochain } = useParams();
  const {
    label,
    localForm,
    htmlFor,
    minionType,
    name,
    localValues,
    source = 'dao',
  } = props;
  const { register, setValue } = localForm;
  const [nftData, setNftData] = useState();
  const [nfts, setNfts] = useState();
  const [selected, setSelected] = useState();
  const [collections, setCollections] = useState();
  const [filter, setFilter] = useState();
  const [manualInput, setManualInput] = useState('auto');
  const [loadingUserNfts, setLoadingUserNfts] = useState(false);

  useEffect(() => {
    register('tokenId');
    register('tokenBalance');
    register('raribleDescription');
    register('image');
    register('nftType');
    register('tokenType');
    register('selectedMinion');
    register('selectedSafeAddress');

    const getUserNfts = async () => {
      setLoadingUserNfts(true);
      const raw721s = await fetchErc721s({ address, chainID: daochain });
      const raw1155s = await fetchErc1155s({ address, chainID: daochain });
      const erc721s = await hydrate721s(raw721s.tokens);
      const erc1155s = await hydrate1155s(raw1155s.balances);
      const allTokens = [...erc721s, ...erc1155s].filter(item => item);
      setNftData(allTokens);
      setNfts(allTokens);
      setLoadingUserNfts(false);
    };

    if (source === 'user') {
      getUserNfts();
    }
  }, [source]);

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
    if (daoVaults && source !== 'user') {
      const data = filterUniqueNfts(
        daoVaults,
        localValues?.minionAddress,
        minionType,
      );
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
      setValue(name, selected.contractAddress);
      setValue('tokenId', selected.tokenId);
      setValue('tokenBalance', selected.tokenBalance);
      setValue(
        'raribleDescription',
        `Selling ${selected.metadata?.name || selected.name} tokenId ${
          selected.tokenId
        }`,
      );
      setValue(
        'image',
        // selected.metadata?.image_url || selected.metadata?.image,
        selected.image,
      );
      setValue('nftType', selected.type.replace('-', ''));
      setValue('tokenType', selected.type === 'ERC-721' ? 1 : 2);
      setValue('selectedMinion', selected.minionAddress);
      setValue('selectedSafeAddress', selected.safeAddress);
    };
    if (selected) {
      setUpNftValues();
    }
  }, [selected]);

  useEffect(() => {
    if (
      localValues &&
      localValues.tokenId &&
      localValues.contractAddress &&
      nfts
    ) {
      setSelected(
        nfts.find(
          item =>
            item.tokenId === localValues.tokenId &&
            item.contractAddess === localValues.contractAddess,
        ),
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

  const toggleManual = e => {
    setManualInput(e);
  };

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
            <Image src={nft.image} />
          </Box>
        ))}
      </Box>
    </GenericModal>
  );

  return (
    <FieldWrapper>
      <Input type='hidden' id={htmlFor} name={name} ref={register} />
      <Box mb={5}>
        {source !== 'vault' && (
          <>
            <TextBox mb={3} size='xs'>
              {`${label} (must be in ${
                source === 'user' ? 'your wallet' : "your DAO's minion safe"
              })`}
            </TextBox>

            <RadioGroup defaultValue={manualInput} onChange={toggleManual}>
              <Stack spacing={5} direction='row'>
                <Radio size='sm' value='auto'>
                  Auto
                </Radio>
                <Radio size='sm' value='manual'>
                  Manual
                </Radio>
              </Stack>
            </RadioGroup>
          </>
        )}
        {manualInput === 'manual' ? (
          <>
            <GenericInput
              {...props}
              required={false}
              label='Token Address'
              htmlfor='nftAddress'
              placeholder='0x'
              name='nftAddress'
            />
            <TokenInfoInput
              {...props}
              htmlFor='tokenId'
              name='tokenId'
              placeholder='0'
              label='Token ID'
            />
          </>
        ) : (
          <AspectRatio
            ratio={1}
            width='100%'
            className='aspect-box'
            sx={{
              '&>img': {
                objectFit: 'contain',
              },
            }}
          >
            {selected ? (
              <>
                {source === 'dao' ? (
                  <Image
                    onClick={openModal}
                    _hover={{
                      opacity: 0.5,
                      cursor: 'pointer',
                    }}
                    src={selected.image}
                  />
                ) : (
                  <Image src={selected.image} />
                )}
              </>
            ) : (
              <>
                {loadingUserNfts ? (
                  <Flex direction='column'>
                    <Box>Loading NFTs</Box>
                    <Spinner />
                  </Flex>
                ) : (
                  <Button variant='nftSelect' onClick={openModal}>
                    <Icon w={50} h={50} color='primary.500' as={RiAddFill} />
                  </Button>
                )}
              </>
            )}
          </AspectRatio>
        )}
      </Box>
      {source === 'user' && (
        <>
          {selected?.type === 'ERC-1155' && !manualInput && (
            <GenericInput
              {...props}
              required={false}
              label='Quantity'
              htmlfor='numTokens'
              placeholder='0'
              name='numTokens'
            />
          )}
          <NftApproval
            {...props}
            name='nftApproval'
            htmlFor='nftApproval'
            label='NFT Approval'
          />
        </>
      )}
      {selectModal}
    </FieldWrapper>
  );
};

export default NftSelect;
