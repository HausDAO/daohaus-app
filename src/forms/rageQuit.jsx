import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button, FormControl, Flex, Icon, Box, Text } from '@chakra-ui/react';
import { RiErrorWarningLine } from 'react-icons/ri';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useUser } from '../contexts/UserContext';
import { useTX } from '../contexts/TXContext';
import RageInput from './rageInput';
import { createPoll } from '../services/pollService';
import { MolochService } from '../services/molochService';

const RageQuitForm = ({ overview, daoMember }) => {
  const [loading, setLoading] = useState(false);
  const [canRage, setCanRage] = useState(false);
  const { address, injectedProvider } = useInjectedProvider();
  const { daochain, daoid } = useParams();
  const [currentError, setCurrentError] = useState(null);
  const { cachePoll, resolvePoll } = useUser();
  const {
    errorToast,
    successToast,
    setGenericModal,
    setTxInfoModal,
  } = useOverlay();
  const { refreshDao } = useTX();
  const now = (new Date().getTime() / 1000).toFixed();

  const {
    handleSubmit,
    errors,
    register,
    setError,
    clearErrors,
    setValue,
  } = useForm();

  useEffect(() => {
    const getCanRage = async () => {
      console.log(daoMember?.highestIndexYesVote?.proposalIndex);
      if (daoMember?.highestIndexYesVote?.proposalIndex) {
        const localCanRage = await MolochService({
          daoAddress: daoid,
          version: overview.version,
          chainID: daochain,
        })('canRagequit')(daoMember?.highestIndexYesVote?.proposalIndex);
        setCanRage(localCanRage);
      } else {
        setCanRage(true);
      }
    };
    getCanRage();
  }, [address]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
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
    if (
      (values.shares === '' || values.shares === '0') &&
      (values.loot === '' || values.loot === '0')
    ) {
      setError('loot or shares', { message: 'Set loot or shares to RageQuit' });
      setLoading(false);
      setTimeout(() => {
        clearErrors('loot or shares');
        setLoading(false);
      }, 500);
    }

    setLoading(true);
    console.log(values);
    const args = [values.shares || '0', values.loot || '0'];
    try {
      const poll = createPoll({ action: 'ragequit', cachePoll })({
        chainID: daochain,
        molochAddress: daoid,
        createdAt: now,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: 'There was an error.',
            });
            resolvePoll(txHash);
            console.error(`Could not find a matching proposal: ${error}`);
            setLoading(false);
          },
          onSuccess: txHash => {
            successToast({
              title: 'Rage Quit submitted.',
            });
            refreshDao();
            resolvePoll(txHash);
            setLoading(false);
          },
        },
      });
      const onTxHash = () => {
        setGenericModal({});
        setTxInfoModal(true);
      };
      await MolochService({
        web3: injectedProvider,
        daoAddress: daoid,
        version: overview.version,
        chainID: daochain,
      })('ragequit')({
        args,
        address,
        poll,
        onTxHash,
      });
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return canRage ? (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={errors.name} mt={4}>
        <RageInput
          register={register}
          setValue={setValue}
          label='Shares to Rage'
          type='shares'
          max={daoMember?.shares}
        />
        <RageInput
          register={register}
          setValue={setValue}
          label='Loot to Rage'
          type='loot'
          max={daoMember?.loot}
        />

        <Flex justify='flex-end' align='center'>
          {currentError && (
            <Box color='secondary.300' fontSize='m' mr={2}>
              <Icon as={RiErrorWarningLine} color='secondary.300' mr={2} />
              {currentError.message}
            </Box>
          )}
          <Box>
            <Button
              type='submit'
              loadingText='Submitting'
              isLoading={loading}
              disabled={loading}
            >
              RAGE
            </Button>
          </Box>
        </Flex>
      </FormControl>
    </form>
  ) : (
    <Text>
      Sorry you can not rage at this time. You have a &apos;Yes&apos; vote on a
      pending proposal. All proposals with a &apos;Yes&apos; vote must be
      completed and processed before you can rage.
    </Text>
  );
};

export default RageQuitForm;
