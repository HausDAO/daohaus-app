import React, { useEffect, useState } from 'react';
import {
  Flex, Text, Box, Button, FormLabel, Input,
} from '@chakra-ui/react';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import TextBox from './TextBox';
import { fetchNativeBalance } from '../utils/tokenExplorerApi';
import GenericModal from '../modals/genericModal';
import { numberWithCommas } from '../utils/general';

const MinionNativeToken = ({ action }) => {
  const [nativeBalance, setNativeBalance] = useState();
  const { daochain, daoid, minion } = useParams();
  const { handleSubmit, errors, register } = useForm();

  const handleClick = () => {
    action.sendNativeToken();
  };
  useEffect(() => {
    const getContractBalance = async () => {
      try {
        const native = await fetchNativeBalance(minion, daochain);
        setNativeBalance(native.result / 10 ** 18);
      } catch (err) {
        console.log(err);
      }
    };
    getContractBalance();
  }, [minion]);
  return (
    <Box>
      <TextBox size='md' align='center'>
        balance:
        {' '}
        {nativeBalance}
        <Button onClick={handleClick}>Send</Button>
      </TextBox>
      <GenericModal closeOnOverlayClick modalId='nativeTokenSend'>
        <form onSubmit={handleSubmit(action.sendNativeToken)}>

          <TextBox as={FormLabel} size='xs' htmlFor='amount'>
            Amount
            {' '}
            <Button>
              Max
              {' '}
              {`$${numberWithCommas(+nativeBalance)}`}
            </Button>
          </TextBox>
          <Input
            name='amount'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'amount is required',
              },
            })}
            focusBorderColor='secondary.500'
          />
          <TextBox as={FormLabel} size='xs' htmlFor='destination'>
            Destination
          </TextBox>
          <Input
            name='destination'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'destination is required',
              },
            })}
            focusBorderColor='secondary.500'
          />
          <Button type='submit'>Propose Transfer</Button>
        </form>
      </GenericModal>
    </Box>
  );
};

export default MinionNativeToken;
