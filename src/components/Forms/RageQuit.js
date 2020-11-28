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
} from '@chakra-ui/core';

import {
  useDao,
  useModals,
  useTxProcessor,
  useUser,
} from '../../contexts/PokemolContext';
import TextBox from '../Shared/TextBox';
import { RiErrorWarningLine } from 'react-icons/ri';

const RageQuitForm = () => {
  const [loading, setLoading] = useState(false);
  const [user] = useUser();
  const [dao] = useDao();
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
      console.log('CB');
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        isInvalid={errors.name}
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        mb={5}
      >
        <Box>
          <TextBox as={FormLabel} htmlFor='shares' mb={2}>
            Shares To RAgE
          </TextBox>
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
            focusBorderColor='secondary.500'
          />
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
            focusBorderColor='secondary.500'
          />
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
  );
};

export default RageQuitForm;
