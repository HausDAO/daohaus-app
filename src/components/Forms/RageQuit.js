import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  FormLabel,
  FormControl,
  Flex,
  Input,
  Icon,
  Box,
  FormHelperText,
  Text,
} from '@chakra-ui/core';

import {
  useDao,
  useMembers,
  useModals,
  useTxProcessor,
  useUser,
} from '../../contexts/PokemolContext';
import TextBox from '../Shared/TextBox';
import { RiErrorWarningLine } from 'react-icons/ri';
import { memberProfile } from '../../utils/helpers';

const RageQuitForm = () => {
  const [loading, setLoading] = useState(false);
  const [canRage, setCanRage] = useState(false);
  const [member, setMember] = useState();
  const [user] = useUser();
  const [dao] = useDao();
  const [members] = useMembers();
  const [txProcessor, updateTxProcessor] = useTxProcessor();
  const [currentError, setCurrentError] = useState(null);
  const { closeModals } = useModals();

  const {
    handleSubmit,
    errors,
    register,
    // formState
  } = useForm();

  useEffect(() => {
    if (user?.memberAddress) {
      setMember(user);
    } else {
      setMember(memberProfile(members, user.username));
    }
  }, [members, user]);

  useEffect(() => {
    const getCanRage = async () => {
      const _canRage = await dao.daoService.moloch.canRagequit(
        member.highestIndexYesVote.proposalIndex,
      );
      setCanRage(_canRage);
    };
    if (member) {
      getCanRage();
    }
  }, [dao, member]);

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

  // TODO check tribute token < currentWallet.token.balance & unlock
  // TODO check link is a valid link

  const txCallBack = (txHash, details) => {
    console.log('txCallBack', txProcessor);
    if (txProcessor && txHash) {
      closeModals();
      txProcessor.setTx(txHash, user.username, details, true, false, false);
      txProcessor.forceCheckTx = true;
      updateTxProcessor({ ...txProcessor });
    }
    if (!txHash) {
      console.log('error: ', details);
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);

    console.log(values);

    try {
      dao.daoService.moloch.rageQuit(
        values.shares ? values.shares : 0,
        values.loot ? values.loot : 0,
        txCallBack,
      );
    } catch (err) {
      setLoading(false);
      console.log('*******************error: ', err);
    }
  };

  return canRage ? (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        isInvalid={errors.name}
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        mb={5}
      >
        <Box>
          <FormControl>
            <Input
              name='shares'
              placeholder='0'
              mb={5}
              ref={register({
                pattern: {
                  value: /[0-9]/,
                  message: 'Shares must be a number',
                },
              })}
              color='white'
              type='number'
              focusBorderColor='secondary.500'
            />
            <FormHelperText>
              You can Rage up to {member?.shares} shares.
            </FormHelperText>
          </FormControl>
          <FormControl>
            <TextBox as={FormLabel} htmlFor='loot' mb={2}>
              Loot to rAGe
            </TextBox>
            <Input
              name='loot'
              placeholder='0'
              mb={5}
              ref={register({
                pattern: {
                  value: /[0-9]/,
                  message: 'Loot must be a number',
                },
              })}
              color='white'
              type='number'
              focusBorderColor='secondary.500'
            />
            <FormHelperText>
              You can Rage up to {member?.loot} loot.
            </FormHelperText>
          </FormControl>
        </Box>
      </FormControl>
      <Flex justify='flex-end' align='center' h='60px'>
        {currentError && (
          <Box color='secondary.300' fontSize='m' mr={5}>
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
    </form>
  ) : (
    <Text>
      Sorry you can not rage at this time. You have a pending yes vote. All yes
      votes must be completed and processed
    </Text>
  );
};

export default RageQuitForm;
