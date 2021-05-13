import React, { useEffect, useState } from 'react';
import { Box, Button, FormLabel, Input } from '@chakra-ui/react';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import TextBox from './TextBox';
import GenericModal from '../modals/genericModal';
import { useOverlay } from '../contexts/OverlayContext';
import { NiftyService } from '../services/niftyService';
import { getNftMeta } from '../utils/metadata';
import { detailsToJSON } from '../utils/general';

const MinionNiftyBuy = ({ action }) => {
  const [nftLoading, setNftLoading] = useState(null);
  const [nftMeta, setNftMeta] = useState(null);
  const [nftPrice, setNftPrice] = useState(null);
  const [currentError, setCurrentError] = useState(null);
  const { daochain, minion } = useParams();
  const { handleSubmit, register, setValue } = useForm();
  const { setGenericModal } = useOverlay();

  const handleBlur = async e => {
    let ipfsHash;
    const { value } = e.target;

    setNftLoading(true);
    try {
      const niftyService = NiftyService({
        tokenAddress: '0xCF964c89f509a8c0Ac36391c5460dF94B91daba5',
        chainID: daochain,
      });
      console.log('niftyService', niftyService);
      console.log('value???', value);
      if (value.match(/Qm[a-zA-Z0-9]+/)) {
        [ipfsHash] = value.match(/Qm[a-zA-Z0-9]+/);
        console.log('ipfsHash', ipfsHash);
      } else {
        throw Error();
      }

      const tid = await niftyService('inkTokenByIndex')({
        inkUrl: ipfsHash,
        index: 0,
      });
      console.log(tid);
      const uri = await niftyService('tokenURI')({
        tokenId: tid,
      });
      const price = await niftyService('tokenPrice')({
        tokenId: tid,
      });
      setNftPrice(price);

      const url = `https://gateway.pinata.cloud/ipfs/${uri.match(
        /Qm[a-zA-Z0-9]+/,
      )}`;
      console.log('url', url);
      const response = await getNftMeta(url);
      console.log('response', response);
      setNftMeta(response);

      setNftLoading(false);
    } catch (err) {
      setNftLoading(false);
      setCurrentError(err);
      console.log(err);
    }
  };

  const niftyMinionBuy = () => {
    () => setGenericModal({ niftyMinionBuy: true });
  };

  const onSubmit = async values => {
    setNftLoading(true);
    console.log('values', values.targetInk.match(/Qm[a-zA-Z0-9]+/));

    const niftyService = NiftyService({
      tokenAddress: '0xCF964c89f509a8c0Ac36391c5460dF94B91daba5',
      chainID: daochain,
    });

    const hexData = await niftyService('buyInkNoop')({
      inkUrl: values.targetInk.match(/Qm[a-zA-Z0-9]+/)[0],
    });
    // TODO: add title and link (image)
    // add type
    // nftMeta
    console.log('nftMeta');
    const nftImage = nftMeta?.image && nftMeta?.image.replace('https://', '');

    const details = detailsToJSON({
      title: `${minionData.details} buys a Nifty`,
      description: `${nftMeta?.name} - ${nftMeta?.description}`,
      link: nftImage || null,
      type: 'niftyInk',
    });
    const args = [
      '0xCF964c89f509a8c0Ac36391c5460dF94B91daba5',
      injectedProvider.utils.toWei(values.price),
      hexData,
      details,
    ];
    try {
      const poll = createPoll({ action: 'minionProposeAction', cachePoll })({
        minionAddress: overview.minions[0],
        createdAt: now,
        chainID: daochain,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: 'There was an error.',
            });
            resolvePoll(txHash);
            console.error(`Could not find a matching proposal: ${error}`);
          },
          onSuccess: txHash => {
            successToast({
              title: 'Minion proposal submitted.',
            });
            refreshDao();
            resolvePoll(txHash);
            // createForumTopic({
            //   chainID: daochain,
            //   daoID: daoid,
            //   afterTime: now,
            //   proposalType: 'Minion Proposal',
            //   values,
            //   applicant: address,
            //   daoMetaData,
            // });
          },
        },
      });
      const onTxHash = () => {
        setGenericModal(false);
        setTxInfoModal(true);
      };
      await MinionService({
        web3: injectedProvider,
        minion,
        chainID: daochain,
      })('proposeAction')({
        args,
        address,
        poll,
        onTxHash,
      });
    } catch (err) {
      setNftLoading(false);
      console.log('error: ', err);
    }
  };

  return (
    <Box>
      <Box>
        <Button onClick={niftyMinionBuy}>Buy Ink</Button>
      </Box>
      <GenericModal closeOnOverlayClick modalId='niftyMinionBuy'>
        <form onSubmit={handleSubmit(onSubmit)}>
          {nftMeta && <Image src={nftMeta?.image} />}
          <TextBox as={FormLabel} size='xs' htmlFor='targetInk'>
            Target Ink URL
          </TextBox>
          <Input
            name='targetInk'
            placeholder='https://...'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'Target ink is required',
              },
            })}
            focusBorderColor='secondary.500'
            onBlur={handleBlur}
          />
          <TextBox as={FormLabel} size='xs' htmlFor='price'>
            price
          </TextBox>
          <Input
            name='price'
            placeholder='4.9'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'price is required',
              },
            })}
            focusBorderColor='secondary.500'
          />
          <Button
            type='submit'
            loadingText='Submitting'
            isLoading={nftLoading}
            disabled={!nftMeta}
          >
            Propose Buy
          </Button>
        </form>
      </GenericModal>
    </Box>
  );
};

export default MinionNiftyBuy;
