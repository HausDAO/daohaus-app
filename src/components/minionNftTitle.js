import React, { useEffect, useState } from 'react';
import { Box, Image, Tooltip } from '@chakra-ui/react';
import { getNftMeta } from '../utils/metadata';

const MinionNftTile = ({ meta, tokenId }) => {
  const [tokenDetail, setTokenDetail] = useState();

  useEffect(() => {
    const fetchNFTData = async () => {
      console.log('meta WTF', meta);
      if (!meta || meta.indexOf('https://') !== 0) {
        meta = '';
      }
      if (meta.indexOf('ipfs://ipfs/') === 0) {
        meta = meta.replace('ipfs://ipfs/', 'https://ipfs.io/ipfs/');
      }

      try {
        const jsonMeta = await getNftMeta(meta);
        setTokenDetail(jsonMeta);
      } catch (err) {
        console.log('error with meta URI', meta);
      }
    };
    fetchNFTData();
  }, []);
  console.log(tokenDetail);

  return (
    <Box w={'15%'} d={['none', null, null, 'inline-block']} bg={'white'}>
      {tokenDetail?.image || tokenDetail?.properties.image ? (
        <Tooltip
          hasArrow
          shouldWrapChildren
          placement='left'
          label={'' + tokenDetail.name + ' id: ' + tokenId}
          bg='secondary.500'
        >
          <Image
            src={tokenDetail?.properties?.image?.description}
            h='50px'
            w='50px'
          />
        </Tooltip>
      ) : (
        'NFT'
      )}
    </Box>
  );
};

export default MinionNftTile;
