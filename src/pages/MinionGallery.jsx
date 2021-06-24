import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Flex, Button, Box, Text } from '@chakra-ui/react';
import MainViewLayout from '../components/mainViewLayout';
import GalleryNftCard from '../components/galleryNftCard';
import ListFilter from '../components/listFilter';
import ListSort from '../components/listSort';
import { nftFilterOptions, nftSortOptions } from '../utils/nftContent';

const MinionGallery = ({ daoVaults, customTerms }) => {
  const { daoid, minion } = useParams();
  const [vault, setVault] = useState(null);
  const [sort, setSort] = useState('value');
  const [filter, setFilter] = useState('filters');

  useEffect(() => {
    setVault(
      daoVaults.find(vault => {
        return vault.address === minion;
      }),
    );
  }, [daoVaults, minion]);

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
      {vault && (
        <>
          <Flex
            wrap={['wrap', null, null, 'nowrap']}
            justify='flex-start'
            align='center'
            w='100%'
            mt={10}
            mb={10}
          >
            <Box
              mr={5}
              textTransform='uppercase'
              fontFamily='heading'
              fontSize={['sm', null, null, 'md']}
              mb={[3, null, null, 0]}
            >
              {vault.nfts?.length || 0} NFTs
            </Box>
            <Box ml={10}>
              <ListSort
                sort={sort}
                setSort={setSort}
                options={nftSortOptions}
              />
            </Box>
            <Box ml={10}>
              <ListFilter
                filter={filter}
                setFilter={setFilter}
                options={nftFilterOptions}
              />
            </Box>
            <Box
              ml='auto'
              mr={5}
              textTransform='uppercase'
              fontFamily='heading'
              fontSize={['sm', null, null, 'md']}
            >
              View Balances
            </Box>
          </Flex>
          <Flex>
            <Grid
              templateColumns={[
                'repeat(1, 1fr)',
                'repeat(2, 1fr)',
                'repeat(3, 1fr)',
                'repeat(4, 1fr)',
              ]}
              gap={5}
              flex={1}
            >
              {vault.nfts.length > 0 &&
                vault.nfts.map((nft, i) => (
                  <>
                    <GalleryNftCard nft={nft} key={i} />
                    <GalleryNftCard nft={nft} key={i + 1} />
                    <GalleryNftCard nft={nft} key={i + 2} />
                  </>
                ))}
            </Grid>
          </Flex>
        </>
      )}
    </MainViewLayout>
  );
};

export default MinionGallery;
