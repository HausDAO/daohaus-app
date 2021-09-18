import React, { useEffect, useState } from 'react';
import { Box, Button, FormHelperText, Image, Spinner } from '@chakra-ui/react';

import { useParams } from 'react-router';
import LinkInput from './linkInput';
import { SubmitFormError } from './staticElements';
import { getNftMeta } from '../utils/metadata';
import { LOCAL_ABI } from '../utils/abi';
import { createContract } from '../utils/contract';
import { NIFTYINK_ADDRESS } from '../utils/chain';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

const NiftyInkUrl = props => {
  const { localForm } = props;
  const { watch, setValue, register } = localForm;
  const { daochain } = useParams();
  const { injectedProvider } = useInjectedProvider();
  const [nftData, setNftData] = useState(null);
  const [nftLoading, setNftLoading] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);

  const targetInk = watch('targetInk');

  useEffect(() => {
    register('nftMetadata');
    register('ipfsHash');
  }, []);

  useEffect(() => {
    const getNiftyData = async () => {
      try {
        if (
          targetInk.indexOf('https://nifty.ink/') === -1 &&
          targetInk.match(/Qm[a-zA-Z0-9]+/)
        ) {
          setInvalidLink(true);
          setValue('targetInk', '');
        }
        setInvalidLink(false);
        setNftLoading(true);
        const [ipfsHash] = targetInk.match(/Qm[a-zA-Z0-9]+/);
        const niftyInkContract = createContract({
          address: NIFTYINK_ADDRESS,
          abi: LOCAL_ABI.NIFTY_INK,
          chainID: daochain,
          web3: injectedProvider,
        });
        const tokenId = await niftyInkContract.methods
          .inkTokenByIndex(ipfsHash, 0)
          .call();
        const tokenUri = await niftyInkContract.methods
          .tokenURI(tokenId)
          .call();
        const metadata = await getNftMeta(
          `https://daohaus.mypinata.cloud/ipfs/${tokenUri.match(
            /Qm[a-zA-Z0-9]+/,
          )}`,
        );

        setNftData({ tokenId, tokenUri, ipfsHash, metadata });
        setValue('nftMetadata', metadata);
        setValue('ipfsHash', ipfsHash);
        setNftLoading(false);
      } catch (err) {
        console.log('nifty ink err', err);
        setInvalidLink(true);
        setValue('targetInk', '');
      }
    };
    if (targetInk) {
      getNiftyData();
    }
  }, [targetInk]);
  //  REVIEW
  //  Can this component use the usual FieldWrapper pattern?

  return (
    <Box>
      <LinkInput {...props} />

      {invalidLink && <SubmitFormError message='Invalid NiftyInk Url' />}
      {nftData ? (
        <>
          <Image src={nftData.metadata.image} w='300px' h='300px' />
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

export default NiftyInkUrl;
