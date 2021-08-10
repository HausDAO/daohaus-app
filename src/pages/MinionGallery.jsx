import React, { useState, useEffect } from 'react';
import deepEqual from 'deep-eql';
import { useParams } from 'react-router-dom';
import { Wrap, WrapItem, Flex, Button, Box } from '@chakra-ui/react';
import MainViewLayout from '../components/mainViewLayout';
import NftFilter from '../components/nftFilter';
// import ListSort from '../components/listSort';
import { nftFilterOptions, nftSortOptions } from '../utils/nftContent';
import NftCard from '../components/nftCard';
import { concatNftSearchData } from '../utils/nftVaults';

const MinionGallery = ({ daoVaults, customTerms }) => {
  const { minion } = useParams();
  // const [sort, setSort] = useState(null);
  const [sort] = useState(nftSortOptions[0]);
  const [filters, setFilters] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [collection, setCollection] = useState('all');
  const [allCollections, setAllCollections] = useState([]);
  const [nfts, setNfts] = useState(null);
  const [nftData, setNftData] = useState(null); // Grab Vault NFTs
  useEffect(() => {
    if (daoVaults) {
      let nfts = [];
      if (minion) {
        nfts = daoVaults?.find(vault => {
          return vault.address === minion;
        })?.nfts;
      } else {
        nfts = daoVaults?.reduce((acc, item) => {
          const nftsWithMinionAddress = item.nfts.map(n => {
            return {
              ...n,
              minionAddress: item.address,
              minionType: item.minionType,
            };
          });
          return [...acc, ...nftsWithMinionAddress];
        }, []);
      }
      setNftData(nfts);
      setNfts(nfts);
    }
  }, [daoVaults, minion]);

  // Get All Collections
  useEffect(() => {
    if (nftData) {
      const collections = nftData.reduce((acc, item) => {
        if (acc.indexOf(item.name) === -1) {
          return [...acc, item.name];
        }
        return acc;
      }, []);
      if (!deepEqual(collections, allCollections)) {
        setAllCollections(collections);
      }
    }
  }, [nftData]);

  // Filter NFTs
  useEffect(() => {
    if (nftData) {
      const filtered = nftData.filter(item => {
        let result = true;
        if (searchText.length > 0) {
          const dataSearchString = concatNftSearchData(item);
          result =
            result && dataSearchString.includes(searchText.toLowerCase());
        }
        // if (filters.length > 0) {
        //   if (filters.indexOf('forSale') !== -1) {
        //     result = result && !!item.auction;
        //   }
        //   if (filters.indexOf('hasOffer') !== -1) {
        //     result = result && !!item.offers && item.offers.length > 0;
        //   }
        // }
        if (collection !== 'all') {
          result = result && collection === item.name;
        }

        return result;
      });
      if (!deepEqual(filtered, nfts)) {
        setNfts(filtered);
      }
    }
  }, [searchText, collection, filters, nftData]);

  // Sort NFTs
  useEffect(() => {
    if (nfts && nfts.length > 0) {
      const sorted = [...nfts];
      sorted.sort((a, b) => {
        if (sort.value === 'value') {
          return +b.last_price - +a.last_price;
        }
        if (sort.value === 'dateCreated') {
          return 0;
        }
        if (sort.value === 'expiringAuctions') {
          if (a.auction && !b.auction) {
            return -1;
          }
          if (b.auction && !a.auction) {
            return 1;
          }
          if (a.auction && b.auction) {
            return +a.auction.end - +b.auction.end;
          }
          return 0;
        }
        return -1;
      });
      if (!deepEqual(sorted, nfts)) {
        setNfts([...sorted]);
      }
    }
  }, [sort, nfts]);

  const addButton = (
    <Flex>
      <Button>ADD NFT +</Button>
    </Flex>
  );

  return (
    <MainViewLayout
      header='Minion Gallery'
      customTerms={customTerms}
      headerEl={addButton}
      isDao
    >
      <Flex d='column'>
        <Flex
          wrap={['wrap', null, null, 'nowrap']}
          justify={['space-between', null, null, 'flex-start']}
          align='center'
          w='100%'
          mt={[0, null, null, 10]}
          mb={10}
        >
          <Box
            mr={[0, 5, null, 5]}
            textTransform='uppercase'
            fontFamily='heading'
            fontSize={['sm', null, null, 'md']}
          >
            {nfts?.length || 0} NFTs
          </Box>
          <Box ml={[0, 5, null, 10]}>
            {/* <ListSort sort={sort} setSort={setSort} options={nftSortOptions} /> */}
          </Box>
          <Box ml={[0, 5, null, 10]} mt={[5, 0, null, 0]}>
            <NftFilter
              ml={0}
              filters={filters}
              setFilters={setFilters}
              searchText={searchText}
              setSearchText={setSearchText}
              collection={collection}
              setCollection={setCollection}
              allCollections={allCollections}
              options={nftFilterOptions}
            />
          </Box>
          {/* <Box
            ml='auto'
            mt={[5, 0, null, 0]}
            mr={[0, 5, null, 5]}
            textTransform='uppercase'
            fontFamily='heading'
            fontSize={['sm', null, null, 'md']}
          >
            View Balances
          </Box> */}
        </Flex>
        <Wrap flex={1} spacing={4} w='100%'>
          {nfts &&
            nfts.length > 0 &&
            nfts.map((nft, i) => (
              <WrapItem key={i}>
                <NftCard
                  nft={nft}
                  minion={minion || nft.minionAddress}
                  minionType={nft.minionType}
                  width={['85vw', '85vw', 350, 350]}
                />
              </WrapItem>
            ))}
        </Wrap>
      </Flex>
    </MainViewLayout>
  );
};

export default MinionGallery;
