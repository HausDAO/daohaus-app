import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Image,
  Input,
  Tooltip,
  Link,
  Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { useDao } from '../contexts/DaoContext';
import { useOverlay } from '../contexts/OverlayContext';
import TextBox from './TextBox';
import GenericModal from '../modals/genericModal';
import { hasMinion } from '../utils/dao';
import { getNftMeta } from '../utils/metadata';
import { NIFTYINK_ADDRESS } from '../services/niftyService';
import { MINION_TYPES } from '../utils/proposalUtils';

const MinionNftTile = ({
  meta,
  tokenId,
  token,
  sendErc721Action,
  sellNiftyAction,
}) => {
  const { daoOverview } = useDao();
  const { setGenericModal } = useOverlay();
  const { handleSubmit, register } = useForm();

  const [tokenDetail, setTokenDetail] = useState();

  useEffect(() => {
    const fetchNFTData = async () => {
      console.log('meta', meta);
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
        console.log('error with meta URI', err);
      }
    };
    fetchNFTData();
  }, []);

  const handleSend = async () => {
    console.log('tokenDetail', tokenDetail);
    const key = `send-${tokenId}`;
    setGenericModal({ [key]: true });
  };
  const handleSell = async () => {
    console.log('tokenDetail', tokenDetail);
    const key = `sell-${tokenId}`;
    setGenericModal({ [key]: true });
  };

  const sendToken = values => {
    sendErc721Action(values, token, tokenId);
  };

  const sellToken = values => {
    sellNiftyAction(values, token, tokenId);
  };

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
          <Link href={tokenDetail?.external_url} isExternal>
            <Image src={tokenDetail?.image} h='230px' w='230px' />
          </Link>
        </Tooltip>
      ) : (
        'NFT'
      )}

      <Flex>
        {hasMinion(daoOverview.minions, MINION_TYPES.NIFTY) &&
          token.contractAddress === NIFTYINK_ADDRESS && (
            <Button onClick={handleSell}>Sell on Nifty Ink</Button>
          )}
        <Button onClick={handleSend}>Send</Button>
      </Flex>

      <GenericModal closeOnOverlayClick modalId={`send-${tokenId}`}>
        <Text mb={3} fontFamily='heading'>
          Send NiftyInk
        </Text>
        <form onSubmit={handleSubmit(sendToken)}>
          {tokenDetail && (
            <Image src={tokenDetail?.image} backgroundColor='white' />
          )}
          <TextBox as={FormLabel} size='xs' htmlFor='destination'>
            Destination
          </TextBox>
          <Input
            name='destination'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'destination is required',
              },
            })}
            focusBorderColor='secondary.500'
          />
          <TextBox as={FormLabel} size='xs' htmlFor='tokenId'>
            Token ID
          </TextBox>
          <Input
            name='tokenId'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'Id is required',
              },
            })}
            focusBorderColor='secondary.500'
            value={tokenId}
            disabled={tokenId}
          />
          <Button type='submit'>Propose Transfer</Button>
        </form>
      </GenericModal>

      <GenericModal closeOnOverlayClick modalId={`sell-${tokenId}`}>
        <Text mb={3} fontFamily='heading'>
          Sell NiftyInk
        </Text>
        <form onSubmit={handleSubmit(sellToken)}>
          {tokenDetail && (
            <Image src={tokenDetail?.image} backgroundColor='white' />
          )}
          <TextBox as={FormLabel} size='xs' htmlFor='targetInk'>
            Price
          </TextBox>
          <Input
            name='price'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'Price is required',
              },
            })}
            focusBorderColor='secondary.500'
          />
          <TextBox as={FormLabel} size='xs' htmlFor='tokenId'>
            Token ID
          </TextBox>
          <Input
            name='tokenId'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'Id is required',
              },
            })}
            focusBorderColor='secondary.500'
            value={tokenId}
            disabled={tokenId}
          />
          <Button type='submit'>Propose Sell</Button>
        </form>
      </GenericModal>
    </Box>
  );
};

export default MinionNftTile;
