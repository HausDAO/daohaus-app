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
} from '@chakra-ui/react';

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
      <FormControl isInvalid={errors.name}>
        <TextBox as={FormLabel} htmlFor='shares' mb={2}>
          Shares to Rage
        </TextBox>

        <Input
          name='shares'
          placeholder='0'
          ref={register({
            pattern: {
              value: /[0-9]/,
              message: 'Shares must be a number',
            },
          })}
          color='white'
          focusBorderColor='secondary.500'
        />
        <FormHelperText>
          You can Rage up to {member?.shares} shares.
        </FormHelperText>
        <TextBox as={FormLabel} htmlFor='loot' mt={6} mb={2}>
          Loot to Rage
        </TextBox>
        <Input
          name='loot'
          placeholder='0'
          ref={register({
            pattern: {
              value: /[0-9]/,
              message: 'Loot must be a number',
            },
          })}
          color='white'
          focusBorderColor='secondary.500'
        />
        <FormHelperText>You can Rage up to {member?.loot} loot.</FormHelperText>

        <Flex justify='flex-end' align='center'>
          {currentError && (
            <Box color='secondary.300' fontSize='m'>
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
      Sorry you can not rage at this time. You have a 'Yes' vote on a pending
      proposal. All proposals with a 'Yes' vote must be completed and processed
      before you can rage.
    </Text>
  );
};

export default RageQuitForm;
