import React, { useEffect, useState } from 'react';
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

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useUser } from '../contexts/UserContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useDao } from '../contexts/DaoContext';
import { useMetaData } from '../contexts/MetaDataContext';
import { TransmutationFactoryService } from '../services/transmutationFactoryService';
import { createPoll } from '../services/pollService';
import { supportedChains } from '../utils/chain';
import { boostPost } from '../utils/metadata';

const NewTransmutation = ({ ccoType, ccoVanillaMinion }) => {
  const { daochain, daoid } = useParams();
  const { address, injectedProvider, injectedChain } = useInjectedProvider();
  const { daoOverview, refetch } = useDao();
  const { daoMetaData } = useMetaData();
  const { cachePoll, resolvePoll } = useUser();
  const { errorToast, successToast } = useOverlay();
  const { handleSubmit, register, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [pendingTx, setPendingTx] = useState(null);
  const now = (new Date().getTime() / 1000).toFixed();

  useEffect(() => {
    const setUp = () => {
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
    setLoading(true);
    setStep(2);

    const summonParams = [
      values.moloch,
      'CCO',
      values.distributionToken,
      values.capitalToken,
      values.owner,
    ];

    try {
      const poll = createPoll({ action: 'summonTransmutation', cachePoll })({
        chainID: injectedChain.chain_id,
        daoID: daoid,
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
          onSuccess: async txHash => {
            const title = values.details
              ? `${values.details} Lives!`
              : 'Minion Lives!';
            successToast({
              title,
            });

            const messageHash = injectedProvider.utils.sha3(daoid);
            const signature = await injectedProvider.eth.personal.sign(
              messageHash,
              address,
            );

            const updateThemeObject = {
              contractAddress: daoid,
              boostKey: 'transmutation',
              metadata: {
                paddingNumber: values.paddingNumber,
                burnRate: values.burnRate,
                exchangeRate: values.exchangeRate,
              },
              network: injectedChain.network,
              signature,
            };

            const result = await boostPost('dao/boost', updateThemeObject);

            if (result === 'success') {
              setLoading(false);
              refetch();
              resolvePoll(txHash);
              setStep('success');
            }
          },
        },
      });

      const onTxHash = txHash => {
        console.log('tx', txHash);
        setPendingTx(txHash);
      };

      await TransmutationFactoryService({
        web3: injectedProvider,
        chainID: injectedChain.chain_id,
      })('summonTransmutation')({
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
      {step === 1 && (
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
      )}

      {step === 2 && (
        <>
          <Heading as='h4' size='md' fontWeight='100' mb={10}>
            Deploying Transmutation
          </Heading>
          <Box>You will need to sign once more</Box>
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
      )}

      {step === 'success' && (
        <>
          <Heading as='h4' size='md' fontWeight='100' mb={10}>
            Success
          </Heading>
        </>
      )}
    </Box>
  );
};

export default NewTransmutation;
