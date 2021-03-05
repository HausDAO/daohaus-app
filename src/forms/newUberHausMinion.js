import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
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

import { UberHausMinionFactoryService } from '../services/uberHausMinionFactoryService';
import { supportedChains } from '../utils/chain';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { createPoll } from '../services/pollService';
import { useUser } from '../contexts/UserContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useDao } from '../contexts/DaoContext';
import { UBERHAUS_ADDRESS } from '../utils/uberhaus';

const NewUberHausMinion = () => {
  const [loading, setLoading] = useState(false);
  const { daochain, daoid } = useParams();
  const { address, injectedProvider, injectedChain } = useInjectedProvider();
  const { refetch } = useDao();
  const { cachePoll, resolvePoll } = useUser();
  const { errorToast, successToast, setGenericModal } = useOverlay();
  const { handleSubmit, register } = useForm();
  const [step, setStep] = useState(1);
  const [pendingTx, setPendingTx] = useState(null);
  const now = (new Date().getTime() / 1000).toFixed();

  const onSubmit = async (values) => {
    setLoading(true);
    setStep(2);

    const controllerAddress = '0x000000000000000000000000000000000000beef';
    const summonParams = [
      daoid,
      UBERHAUS_ADDRESS,
      address,
      '500',
      values.details,
    ];

    console.log('summonParams', summonParams);

    try {
      const poll = createPoll({ action: 'summonMinion', cachePoll })({
        chainID: injectedChain.chain_id,
        molochAddress: daoid,
        createdAt: now,
        actions: {
          onError: (error, txHash) => {
            console.error(`error: ${error}`);
            errorToast({
              title: `There was an error.`,
            });
            resolvePoll(txHash);
            setStep(1);
          },
          onSuccess: (txHash) => {
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

      const onTxHash = (txHash) => {
        console.log('tx', txHash);
        setPendingTx(txHash);
      };

      await UberHausMinionFactoryService({
        web3: injectedProvider,
        chainID: injectedChain.chain_id,
      })('summonUberHausMinion')({
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
        title: `There was an error.`,
        description: err?.message || '',
      });
    }
  };

  return (
    <Box w='90%'>
      {step === 1 ? (
        <>
          <Heading as='h4' size='md' fontWeight='100' mb={10}>
            Step 1: Deploy UberHAUS Minion
          </Heading>
          <Box mb={3} fontSize='sm'>
            This minion will manage your membership in UberHaus.
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={3} fontSize='sm'>
              <FormControl mb={5}>
                <FormHelperText fontSize='sm' id='name-helper-text' mb={3}>
                  A Minion needs a name
                </FormHelperText>
                <Input
                  name='details'
                  placeholder='Frank'
                  w='60%'
                  ref={register}
                />
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
            Deploying
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
                View Transaction <Icon as={RiExternalLinkLine} />
              </Link>
            ) : null}
          </Box>
        </>
      ) : null}

      {step === 'success' ? (
        <>
          <Heading as='h4' size='md' fontWeight='100' mb={10}>
            The Minion is ready.
          </Heading>
          <Button onClick={() => setGenericModal({})}>Close</Button>
        </>
      ) : null}
    </Box>
  );
};

export default NewUberHausMinion;
