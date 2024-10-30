import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, FormHelperText, Image, Spinner } from '@chakra-ui/react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import ErrorList from './ErrorList';
import LinkInput from './linkInput';
import { getNftType } from '../utils/contract';
import { fetchLazyNftMeta, fetchNftMeta } from '../utils/rarible';

const RARIBLE_URI = /(0x[a-zA-Z0-9]+):([0-9]+)/;
const MARKETS = {
  RARIBLE: 'Rarible',
};

const NftUri = props => {
  const { localForm } = props;
  const { watch, setValue, register } = localForm;
  const { daochain } = useParams();
  const { injectedProvider } = useInjectedProvider();
  const [nftData, setNftData] = useState(null);
  const [nftLoading, setNftLoading] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);

  const targetNft = watch('targetNft');

  useEffect(() => {
    register('image');
    register('market');
    register('nftType');
    register('tokenId');
  }, []);

  useEffect(() => {
    setNftData(null);
    const getNftData = async () => {
      try {
        const market =
          targetNft.indexOf('rarible.com') !== -1 &&
          targetNft.match(RARIBLE_URI) &&
          MARKETS.RARIBLE;
        if (!market) {
          setInvalidLink(true);
          setValue('targetNft', '');
        }
        setNftLoading(true);
        const nftAddress =
          market === MARKETS.RARIBLE && targetNft.match(RARIBLE_URI)[1];
        const tokenId =
          market === MARKETS.RARIBLE && targetNft.match(RARIBLE_URI)[2];

        const lazyNftMeta =
          market === MARKETS.RARIBLE &&
          (await fetchLazyNftMeta(daochain, targetNft.match(RARIBLE_URI)[0]));

        const nftType = lazyNftMeta
          ? lazyNftMeta['@type']
          : await getNftType(daochain, injectedProvider, nftAddress, tokenId);
        const metadata =
          market === MARKETS.RARIBLE &&
          (await fetchNftMeta(daochain, targetNft.match(RARIBLE_URI)[0]));
        if (metadata?.image) {
          let previewImage =
            market === MARKETS.RARIBLE &&
            (metadata.image.url?.PREVIEW || metadata.image.url?.ORIGINAL);
          if (previewImage.match(/Qm[a-zA-Z0-9]+/)) {
            previewImage = `https://daohaus.mypinata.cloud/ipfs/${
              previewImage.match(/Qm[a-zA-Z0-9]+.*/)[0]
            }`;
          }
          setNftData({
            metadata: {
              ...metadata,
              previewImage,
            },
            tokenId,
          });
          setInvalidLink(false);
          setValue('image', previewImage);
          setValue('market', market);
          setValue('nftType', nftType);
          setValue('nftAddress', nftAddress);
          setValue(
            'nftDescription',
            `Buying ${metadata.name} tokenId ${tokenId} on ${market}`,
          );
          setValue('tokenId', tokenId);
        } else {
          setInvalidLink(true);
          setValue('targetNft', '');
        }
        setNftLoading(false);
      } catch (err) {
        console.log('NFT fetch err', err);
        setInvalidLink(true);
        setValue('targetNft', '');
      }
    };
    if (targetNft) {
      getNftData();
    }
  }, [targetNft]);
  //  REVIEW
  //  Can this component use the usual FieldWrapper pattern?

  return (
    <Box mb={20}>
      <LinkInput {...props} />

      {invalidLink && (
        <ErrorList singleError={{ message: 'Invalid NFT Uri' }} />
      )}
      {nftData ? (
        <>
          <Image src={nftData.metadata.previewImage} w='300px' h='300px' />
          <FormHelperText>{nftData.metadata.description}</FormHelperText>
        </>
      ) : (
        <Button
          variant='nftSelect'
          _hover={{
            cursor: 'auto',
          }}
        >
          {nftLoading && <Spinner />}
        </Button>
      )}
    </Box>
  );
};

export default NftUri;
