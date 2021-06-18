import React, { useEffect, useState } from 'react';
import { Box, Button, FormLabel, Input } from '@chakra-ui/react';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import TextBox from './TextBox';
import { fetchNativeBalance } from '../utils/tokenExplorerApi';
import GenericModal from '../modals/genericModal';
import { numberWithCommas, daoConnectedAndSameChain } from '../utils/general';
import { useOverlay } from '../contexts/OverlayContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

const MinionNativeToken = ({ action, isMember }) => {
  const { address, injectedChain } = useInjectedProvider();
  const [nativeBalance, setNativeBalance] = useState(null);
  const { daochain, minion } = useParams();
  const { handleSubmit, register, setValue } = useForm();
  const { setGenericModal } = useOverlay();

  useEffect(() => {
    const getContractBalance = async () => {
      try {
        const native = await fetchNativeBalance(minion, daochain);
        console.log('native data', native);
        setNativeBalance(native / 10 ** 18);
      } catch (err) {
        console.error(err);
      }
    };
    if (minion) {
      getContractBalance();
    }
  }, [minion]);

  const openSendModal = () => {
    setGenericModal({ nativeTokenSend: true });
  };

  return (
    <Box>
      <TextBox size='md' align='center'>
        balance: {nativeBalance || 0}
        {nativeBalance &&
          isMember &&
          daoConnectedAndSameChain(
            address,
            daochain,
            injectedChain?.chainId,
          ) && (
            <Button size='xs' ml={6} onClick={openSendModal}>
              Send
            </Button>
          )}
      </TextBox>
      <GenericModal closeOnOverlayClick modalId='nativeTokenSend'>
        <form onSubmit={handleSubmit(action)}>
          <TextBox as={FormLabel} size='xs'>
            Creates a Proposal to send
          </TextBox>
          <TextBox as={FormLabel} size='xs' htmlFor='amount'>
            Amount*{' '}
            <Button
              onClick={() => {
                setValue('amount', nativeBalance);
              }}
              size='xs'
            >
              Max {`$${numberWithCommas(+nativeBalance)}`}
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
            Destination*
          </TextBox>
          <Input
            name='destination'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'destination is required',
              },
              pattern: {
                value: /0x[a-fA-F0-9]{40}$/,
                message: 'Payment must be a number',
              },
            })}
            focusBorderColor='secondary.500'
          />
          <TextBox as={FormLabel} size='xs' htmlFor='description'>
            Short Description
          </TextBox>
          <Input
            name='description'
            mb={5}
            ref={register()}
            focusBorderColor='secondary.500'
          />
          <Button type='submit'>Propose Transfer</Button>
        </form>
      </GenericModal>
    </Box>
  );
};

export default MinionNativeToken;
