import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  FormLabel,
  Image,
  Input,
  Select,
  Text,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { AiOutlineCaretDown } from 'react-icons/ai';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useDao } from '../contexts/DaoContext';
import { useUser } from '../contexts/UserContext';
import { useTX } from '../contexts/TXContext';
import { useOverlay } from '../contexts/OverlayContext';
import TextBox from '../components/TextBox';
import { MinionService } from '../services/minionService';
import { createPoll } from '../services/pollService';
import { detailsToJSON } from '../utils/general';
import { MINION_TYPES } from '../utils/proposalUtils';
import { NiftyService } from '../services/niftyService';
import { getNftMeta } from '../utils/metadata';

const NiftyProposalForm = () => {
  const { daoOverview } = useDao();
  const { daochain } = useParams();
  const { address, injectedProvider } = useInjectedProvider();
  const { cachePoll, resolvePoll } = useUser();
  const {
    errorToast,
    successToast,
    setProposalModal,
    setTxInfoModal,
  } = useOverlay();
  const { refreshDao } = useTX();
  const [currentError, setCurrentError] = useState(null);

  const [minions, setMinions] = useState([]);
  const [selectedMinion, setSelectedMinion] = useState(null);
  const now = (new Date().getTime() / 1000).toFixed();

  const { handleSubmit, errors, register, setValue } = useForm();

  const [nftLoading, setNftLoading] = useState(null);
  const [nftMeta, setNftMeta] = useState(null);
  const [nftPrice, setNftPrice] = useState(null);

  useEffect(() => {
    if (daoOverview?.minions) {
      const localMinions = daoOverview.minions
        // TODO: change to NIFTY type
        .filter(minion => minion.minionType === MINION_TYPES.NIFTY)
        .map(minion => ({
          minionAddress: minion.minionAddress,
          minionName: minion.details,
        }));
      setMinions(localMinions);
    }
  }, [daoOverview?.minions]);

  useEffect(() => {
    const errArray = Object.keys(errors);
    if (errArray.length > 0) {
      const newE = Object.keys(errors)[0];
      setCurrentError({
        field: newE,
        ...errors[newE],
      });
    } else {
      setCurrentError(null);
    }
  }, [errors]);

  const onSubmit = async values => {
    setNftLoading(true);
    console.log('values', values);
    console.log('minion', values.minionAddress);

    const niftyService = NiftyService({
      // TODO: fix hardcoded
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
      title: `${selectedMinion.minionName || 'Minion'} buys a Nifty`,
      description: `${nftMeta?.name} - ${nftMeta?.description}`,
      link: nftImage || null,
      type: 'niftyMinion',
    });

    const args = [
      '0xCF964c89f509a8c0Ac36391c5460dF94B91daba5', // nifty target
      injectedProvider.utils.toWei(values.price),
      hexData,
      details,
      '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d', // wxdai
      injectedProvider.utils.toWei(values.price), // wxdai amount
    ];
    console.log('for poll', selectedMinion.minionAddress);
    try {
      const poll = createPoll({ action: 'minionProposeAction', cachePoll })({
        minionAddress: selectedMinion.minionAddress,
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
        setProposalModal(false);
        setTxInfoModal(true);
      };
      await MinionService({
        web3: injectedProvider,
        minion: selectedMinion.minionAddress,
        chainID: daochain,
        minionType: 'niftyMinion',
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

  const handleBlur = async e => {
    let ipfsHash;
    const { value } = e.target;

    if (value.indexOf('https://nifty.ink/') === -1) {
      setValue('targetInk', '');
      return;
    }

    setNftLoading(true);
    try {
      const niftyService = NiftyService({
        // TODO fix hardcoded
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

      try {
        const tid = await niftyService('inkTokenByIndex')({
          inkUrl: ipfsHash,
          index: 0,
        });
        console.log(tid);
        const uri = await niftyService('tokenURI')({
          tokenId: tid,
        });
        // TODO: this is not getting the price
        // will need to use thegraph
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
      } catch (err) {
        setValue('targetInk', '');
        setNftLoading(false);

        return;
      }

      setNftLoading(false);
    } catch (err) {
      setNftLoading(false);
      setCurrentError(err);
      console.log(err);
    }
  };

  const onChange = e => {
    const { value } = e.target;
    console.log('change dropdown', value);
    const minion = minions.find(m => m.minionAddress === value);
    console.log('minion', minion);
    setSelectedMinion(minion);
  };

  return minions?.length ? (
    <form onSubmit={handleSubmit(onSubmit)}>
      {nftMeta && <Image src={nftMeta?.image} />}
      <TextBox as={FormLabel} size='xs' htmlFor='minionContract'>
        Minion Contract
      </TextBox>
      <Select
        name='minionContract'
        icon={<AiOutlineCaretDown />}
        mb={5}
        focusBorderColor='secondary.500'
        ref={register({
          required: {
            value: true,
            message: 'Minion contract is required',
          },
        })}
        placeholder='Select Minion'
        onChange={onChange}
      >
        {' '}
        {minions?.map(minion => (
          <option key={minion.minionAddress} value={minion.minionAddress}>
            {minion.minionName || minion.minionAddress}
          </option>
        ))}
      </Select>
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
      <Text>{nftPrice}</Text>
      <Text>
        you must have xDAI in your Minion, un/wrap from the Minion page
      </Text>
      <Button
        type='submit'
        loadingText='Submitting'
        isLoading={nftLoading}
        disabled={!nftMeta}
      >
        Propose Buy
      </Button>
      <Button
        loadingText='Submitting'
        isLoading={nftLoading}
        onClick={() => setProposalModal(false)}
      >
        Cancel
      </Button>
      {currentError && <Text>{currentError}</Text>}
    </form>
  ) : (
    <>
      <Text>You do not have a nifty minion yet</Text>
      <Text>In beta add a free Minion Boost for your DAO here</Text>
    </>
  );
};

export default NiftyProposalForm;
