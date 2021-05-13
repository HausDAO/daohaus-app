import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Heading,
  Icon,
  Input,
  Link,
  Spinner,
} from '@chakra-ui/react';
import { RiExternalLinkLine } from 'react-icons/ri';
import { useForm } from 'react-hook-form';

import { MinionFactoryService } from '../services/minionFactoryService';
import { supportedChains } from '../utils/chain';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { createPoll } from '../services/pollService';
import { useUser } from '../contexts/UserContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useDao } from '../contexts/DaoContext';
import { useMetaData } from '../contexts/MetaDataContext';

const NewTransmutation = ({ ccoType, ccoVanillaMinion }) => {
  const [loading, setLoading] = useState(false);
  const { daochain, daoid } = useParams();
  const { address, injectedProvider, injectedChain } = useInjectedProvider();
  const { daoOverview, refetch } = useDao();
  const { daoMetaData } = useMetaData();
  const { cachePoll, resolvePoll } = useUser();
  const { errorToast, successToast } = useOverlay();
  const { handleSubmit, register, setValue } = useForm();
  const [step, setStep] = useState(1);
  const [pendingTx, setPendingTx] = useState(null);
  const now = (new Date().getTime() / 1000).toFixed();

  useEffect(() => {
    const setUp = async () => {
      setValue('moloch', daoid);
      setValue(
        'distributionToken',
        daoMetaData.boosts[ccoType].metadata.claimTokenAddress,
      );
      setValue(
        'capitalToken',
        daoMetaData.boosts[ccoType].metadata.tributeToken,
      );
      setValue('owner', ccoVanillaMinion.minionAddress);
      setValue('exchangeRate', daoMetaData.boosts[ccoType].metadata.ratio);
      setValue('burnRate', '1');
      setValue('paddingNumber', '10000');
    };

    if (ccoType && daoMetaData && daoOverview) {
      setUp();
    }
  }, [daoOverview, daoMetaData, ccoType]);

  const onSubmit = async values => {
    // if cco - we need to make a boost post with the new values
    // after the contract goes in onsuccess i guess
    // {"exchangeRate": 0.25,"paddingNumber": 10000,"burnRate": 1}
    // this rate is how many distro tokens you get for a single claim token
    // pull from cco data

    setLoading(true);
    setStep(2);

    const summonParams = [daoid, values.details];

    try {
      const poll = createPoll({ action: 'summonMinion', cachePoll })({
        chainID: injectedChain.chain_id,
        molochAddress: daoid,
        createdAt: now,
        actions: {
          onError: (error, txHash) => {
            console.error(`error: ${error}`);
            errorToast({
              title: 'There was an error.',
            });
            resolvePoll(txHash);
            setStep(1);
          },
          onSuccess: txHash => {
            const title = values.details
              ? `${values.details} Lives!`
              : 'Minion Lives!';
            successToast({
              title,
            });
            refetch();
            resolvePoll(txHash);
            setStep('success');
          },
        },
      });

      const onTxHash = txHash => {
        console.log('tx', txHash);
        setPendingTx(txHash);
      };

      await MinionFactoryService({
        web3: injectedProvider,
        chainID: injectedChain.chain_id,
      })('summonMinion')({
        args: summonParams,
        from: address,
        poll,
        onTxHash,
      });
    } catch (err) {
      console.log('error in tx', err);
      setLoading(false);
      setStep(1);
      errorToast({
        title: 'There was an error.',
        description: err?.message || '',
      });
    }
  };

  return (
    <Box w='90%'>
      {step === 1 ? (
        <>
          <Heading as='h4' size='md' fontWeight='100' mb={10}>
            Deploy Transmutation Contract
          </Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={3} fontSize='sm'>
              <FormControl mb={5}>
                <FormHelperText fontSize='sm' id='moloch-helper-text' mb={3}>
                  Moloch Address
                </FormHelperText>
                <Input name='moloch' w='60%' ref={register} />
              </FormControl>
              <FormControl mb={5}>
                <FormHelperText
                  fontSize='sm'
                  id='distributionToken-helper-text'
                  mb={3}
                >
                  Distribution Token
                </FormHelperText>
                <Input name='distributionToken' w='60%' ref={register} />
              </FormControl>
              <FormControl mb={5}>
                <FormHelperText
                  fontSize='sm'
                  id='capitalToken-helper-text'
                  mb={3}
                >
                  Capital Token
                </FormHelperText>
                <Input name='capitalToken' w='60%' ref={register} />
              </FormControl>
              <FormControl mb={5}>
                <FormHelperText fontSize='sm' id='owner-helper-text' mb={3}>
                  Vanilla Minion
                </FormHelperText>
                <Input name='owner' w='60%' ref={register} />
              </FormControl>

              <FormControl mb={5}>
                <FormHelperText
                  fontSize='sm'
                  id='exchangeRate-helper-text'
                  mb={3}
                >
                  Exchange Rate
                </FormHelperText>
                <Input name='exchangeRate' w='60%' ref={register} />
              </FormControl>
              <FormControl mb={5}>
                <FormHelperText fontSize='sm' id='burnRate-helper-text' mb={3}>
                  Burn Rate
                </FormHelperText>
                <Input name='burnRate' w='60%' ref={register} />
              </FormControl>
              <FormControl mb={5}>
                <FormHelperText
                  fontSize='sm'
                  id='paddingNumber-helper-text'
                  mb={3}
                >
                  Padding Number
                </FormHelperText>
                <Input name='paddingNumber' w='60%' ref={register} />
              </FormControl>
            </Box>
            <Button type='submit' isLoading={loading}>
              Deploy
            </Button>
          </form>
        </>
      ) : null}

      {step === 2 ? (
        <>
          <Heading as='h4' size='md' fontWeight='100' mb={10}>
            Deploying Your Minion
          </Heading>
          <Spinner />

          <Box my={10}>
            {pendingTx ? (
              <Link
                href={`${supportedChains[daochain].block_explorer}/tx/${pendingTx}`}
                isExternal
                fontSize='2xl'
                color='secondary.500'
              >
                View Transaction
                <Icon as={RiExternalLinkLine} ml={2} />
              </Link>
            ) : null}
          </Box>
        </>
      ) : null}

      {step === 'success' ? (
        <>
          <Heading as='h4' size='md' fontWeight='100' mb={10}>
            A Minion is at your service
          </Heading>
          <Button as={RouterLink} to={`/dao/${daochain}/${daoid}/settings`}>
            Settings
          </Button>
        </>
      ) : null}
    </Box>
  );
};

export default NewTransmutation;
