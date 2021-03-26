import React, { useEffect, useState } from 'react';
import { Box, Image, Tooltip } from '@chakra-ui/react';
import { getNftMeta } from '../utils/metadata';

const MinionNftTile = ({ meta, tokenId }) => {
  const [tokenDetail, setTokenDetail] = useState();

  useEffect(() => {
    const fetchNFTData = async () => {
      console.log('meta WTF', meta);
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
    <Box w={'15%'} d={['none', null, null, 'inline-block']}>
      {tokenDetail?.image ? (
        <Tooltip
          hasArrow
          shouldWrapChildren
          placement='left'
          label={'' + tokenDetail.name + ' id: ' + tokenId}
          bg='secondary.500'
        >
          <Image src={tokenDetail.image} h='50px' w='50px' />
        </Tooltip>
      ) : (
        'NFT'
      )}
    </Box>
  );
};

export default MinionNftTile;
