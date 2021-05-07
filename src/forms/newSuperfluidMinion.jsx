import React, { useMemo, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Heading,
  Input,
  Icon,
  Link,
  Select,
  Spinner,
} from '@chakra-ui/react';
import { RiExternalLinkLine } from 'react-icons/ri';
import { useForm } from 'react-hook-form';

import { SuperfluidMinionFactoryService } from '../services/superfluidMinionFactoryService';
import { chainByID, supportedChains } from '../utils/chain';
import { MINION_TYPES } from '../utils/proposalUtils';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { createPoll } from '../services/pollService';
import { useUser } from '../contexts/UserContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useDao } from '../contexts/DaoContext';

const NewSuperfluidMinionForm = () => {
  const [loading, setLoading] = useState(false);
  const [agreementType, setAgreementType] = useState('cfa');
  const { daochain, daoid } = useParams();
  const { address, injectedProvider, injectedChain } = useInjectedProvider();
  const { daoOverview, refetch } = useDao();
  const { cachePoll, resolvePoll } = useUser();
  const { errorToast, successToast } = useOverlay();
  const { handleSubmit, register, getValues } = useForm();
  const [step, setStep] = useState(1);
  const [pendingTx, setPendingTx] = useState(null);
  const now = (new Date().getTime() / 1000).toFixed();

  const onSubmit = async values => {
    setLoading(true);
    setStep(2);

    const summonParams = [
      daoid,
      values.details,
      values.agreement,
      values.version,
    ];

    try {
      const chainParams = chainByID(injectedChain.chain_id);
      const factoryAddr = chainParams.superfluid_minion_factory_addr;
      const poll = createPoll({ action: 'summonMinion', cachePoll })({
        chainID: injectedChain.chain_id,
        molochAddress: daoid,
        factoryAddress: factoryAddr,
        createdAt: now,
        web3: injectedProvider,
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
            successToast({
              title: 'Superfluid Minion Lives!',
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

      await SuperfluidMinionFactoryService({
        web3: injectedProvider,
        chainID: injectedChain.chain_id,
      })('summonSuperfluidMinion')({
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

  const updateAgreementType = () => {
    const newAgreementType = getValues('agreement');
    setAgreementType(newAgreementType);
  };

  const minions = useMemo(
    () =>
      daoOverview?.minions.length > 0
        ? daoOverview.minions.filter(
            minion => minion.minionType === MINION_TYPES.SUPERFLUID,
          )
        : [],
    [daoOverview],
  );

  return (
    <Box w='90%'>
      {step === 1 && (
        <>
          <Heading as='h4' size='md' fontWeight='100' mb={10}>
            Deploy Your Superfluid Minion
          </Heading>
          {minions?.length > 0 && (
            <>
              <Box mb={5} fontSize='md'>
                {`You have ${minions.length} Superfluid minion
                ${minions.length > 1 ? 's' : ''} already. Are you looking for
                the `}
                <Link
                  as={RouterLink}
                  to={`/dao/${daochain}/${daoid}/settings`}
                  color='secondary.500'
                >
                  Settings?
                </Link>
              </Box>
            </>
          )}
          <Box mb={3} fontSize='sm'>
            A Superfluid Minion will allow the DAO to send/receive streaming
            tokens in real-time or to schedule an instant distribution to
            different recipients (coming soon)
          </Box>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={3} fontSize='sm'>
              <FormControl mb={5}>
                <FormHelperText fontSize='sm' id='agreement-helper-text' mb={3}>
                  Which kind of Superfluid agreement you want to use?
                </FormHelperText>
                <Select
                  name='agreement'
                  w='70%'
                  ref={register}
                  defaultValue={agreementType}
                  onChange={updateAgreementType}
                >
                  <option value='cfa'>Constant Flow (CFA)</option>
                  {/* <option value='ida'>Instant Distribution (IDA)</option> */}
                </Select>
              </FormControl>
            </Box>
            <Box mb={3} fontSize='sm'>
              <FormControl mb={5}>
                <FormHelperText fontSize='sm' id='version-helper-text' mb={3}>
                  Which version of Superfluid you want to use?
                </FormHelperText>
                <Select name='version' w='70%' ref={register}>
                  <option value='v1'>v1</option>
                </Select>
              </FormControl>
            </Box>
            <Box mb={3} fontSize='sm'>
              <FormControl mb={5}>
                <FormHelperText fontSize='sm' id='name-helper-text' mb={3}>
                  A Minion needs a name
                </FormHelperText>
                <Input
                  name='details'
                  placeholder={agreementType.toLocaleUpperCase()}
                  w='60%'
                  ref={register({
                    required: {
                      value: true,
                      message: 'Minion name is required',
                    },
                  })}
                />
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
            Deploying Your Superfluid Minion
          </Heading>
          <Spinner />

          {pendingTx && (
            <Box my={10}>
              <Link
                href={`${supportedChains[daochain]?.block_explorer}/tx/${pendingTx}`}
                isExternal
                fontSize='2xl'
                color='secondary.500'
              >
                View Transaction
                <Icon as={RiExternalLinkLine} />
              </Link>
            </Box>
          )}
        </>
      )}

      {step === 'success' && (
        <>
          <Heading as='h4' size='md' fontWeight='100' mb={10}>
            A Superfluid Minion is ready at your service
          </Heading>
          <Button as={RouterLink} to={`/dao/${daochain}/${daoid}/settings`}>
            Settings
          </Button>
        </>
      )}
    </Box>
  );
};

export default NewSuperfluidMinionForm;
