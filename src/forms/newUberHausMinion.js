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
import {
  UBERHAUS_ADDRESS,
  UBERHAUS_MINION_REWARDS_FACTOR,
} from '../utils/uberhaus';
import AddressInput from './addressInput';
import { isEthAddress } from '../utils/general';

const NewUberHausMinion = () => {
  const [loading, setLoading] = useState(false);
  const { daochain, daoid } = useParams();
  const { address, injectedProvider, injectedChain } = useInjectedProvider();
  const { refetch } = useDao();
  const { cachePoll, resolvePoll } = useUser();
  const { errorToast, successToast, setGenericModal } = useOverlay();
  const { handleSubmit, register, setValue, watch } = useForm();
  const [step, setStep] = useState(1);
  const [pendingTx, setPendingTx] = useState(null);
  const [missingDelegate, setMissingDelegate] = useState(false);
  const now = (new Date().getTime() / 1000).toFixed();

  const onSubmit = async (values) => {
    console.log('values', values, isEthAddress(values.memberApplicant));
    if (!isEthAddress(values.memberApplicant)) {
      setMissingDelegate(true);
      return;
    }

    setLoading(true);
    setStep(2);

    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
    const summonParams = [
      daoid,
      UBERHAUS_ADDRESS,
      ZERO_ADDRESS,
      values.memberApplicant,
      UBERHAUS_MINION_REWARDS_FACTOR,
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
            This minion will manage your membership in UberHaus. A DAO member
            needs to be added as the Delegate and will be in charge of voting in
            UberHAUS. You can change the Delegate at any time through a
            proposal.
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={3} fontSize='sm'>
              <AddressInput
                name='applicant'
                formLabel='delegate'
                tipLabel='DAO member address that will be able to vote in UberHAUS. You can change this later through a proposal.'
                register={register}
                setValue={setValue}
                watch={watch}
                memberOnly={true}
              />
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
            {missingDelegate ? (
              <FormHelperText
                fontSize='xs'
                id='applicant-helper-text'
                my={3}
                color='red.500'
              >
                A delegate is required
              </FormHelperText>
            ) : null}
            <Button type='submit' isLoading={loading} disabled={loading}>
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
