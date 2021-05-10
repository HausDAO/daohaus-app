import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Image, Tooltip } from '@chakra-ui/react';
import { getNftMeta } from '../utils/metadata';

const MinionNftTile = ({ meta, tokenId, boost, action }) => {
  const [tokenDetail, setTokenDetail] = useState();

  useEffect(() => {
    const fetchNFTData = async () => {
      if (!meta) {
        meta = '';
      }
      if (meta.indexOf('ipfs://ipfs/') === 0) {
        meta = meta.replace('ipfs://ipfs/', 'https://ipfs.io/ipfs/');
      }
      if (meta.indexOf('https://') !== 0) {
        meta = '';
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

  return (
    <Box m={6} d={['none', null, null, 'inline-block']} bg='white'>
      {tokenDetail?.image || tokenDetail?.properties?.image ? (
        <Tooltip
          hasArrow
          shouldWrapChildren
          placement='left'
          label={`${tokenDetail.name} id: ${tokenId}`}
          bg='secondary.500'
        >
          <Image src={tokenDetail?.image} h='150px' w='150px' />
        </Tooltip>
      ) : (
        'NFT'
      )}
      {boost ? (
        <Flex>
          <Button onClick={() => action.sell()}>Sell</Button>
          <Button onClick={() => action.send()}>Send</Button>
        </Flex>
      ) : null}
    </Box>
  );
};

export default MinionNftTile;
