import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Button,
  FormControl,
  Flex,
  Icon,
  Box,
  Text,
  Input,
  FormLabel,
} from '@chakra-ui/react';
import { RiErrorWarningLine } from 'react-icons/ri';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useUser } from '../contexts/UserContext';
import { useTX } from '../contexts/TXContext';
import { createPoll } from '../services/pollService';
import { MolochService } from '../services/molochService';
import { isEthAddress } from '../utils/general';
import TextBox from '../components/TextBox';

const UpdateDelegate = ({ overview }) => {
  const { address, injectedProvider } = useInjectedProvider();
  const { daochain, daoid } = useParams();
  const { cachePoll, resolvePoll } = useUser();

  const [loading, setLoading] = useState(false);
  // const [canDelegate] = useState(true);
  const [currentError, setCurrentError] = useState(null);

  const {
    errorToast,
    successToast,
    setGenericModal,
    setTxInfoModal,
  } = useOverlay();
  const { refreshDao } = useTX();
  // const now = (new Date().getTime() / 1000).toFixed();

  const {
    handleSubmit,
    errors,
    register,
    // setError,
    // clearErrors,
    // setValue,
  } = useForm();

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const newE = Object.keys(errors)[0];

      setCurrentError({
        field: newE,
        message: 'Please enter a valid Ethereum Address',
        // ...errors[newE],
      });
    } else {
      setCurrentError(null);
    }
  }, [errors]);

  const onSubmit = async values => {
    setLoading(true);
    console.log(values);
    const args = [values.delegateAddress];
    try {
      const poll = createPoll({ action: 'updateDelegateKey', cachePoll })({
        chainID: daochain,
        daoID: daoid,
        memberAddress: address,
        delegateAddress: values.delegateAddress,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: 'There was an error.',
              details: error?.message || '',
            });
            resolvePoll(txHash);
            console.error(`Could not find a matching proposal: ${error}`);
            setLoading(false);
          },
          onSuccess: txHash => {
            successToast({
              title: 'Updated delegate address.',
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
      })('updateDelegateKey')({
        args,
        address,
        poll,
        onTxHash,
      });
    } catch (err) {
      setLoading(false);
      errorToast({
        title: 'Error updating delegate key',
        description: err?.message || '',
      });
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={errors.name} mt={4} p={2}>
        <Flex justify='flex-start' align='center'>
          <Box w='100%'>
            <Text
              textTransform='uppercase'
              fontFamily='heading'
              fontSize={['sm', null, null, 'md']}
              variant='text'
              mb={6}
            >
              update delegate address
            </Text>
            <TextBox as={FormLabel} size='xs' htmlFor='delegateAddress' mb={2}>
              Address
            </TextBox>
            <Input
              placeholder='0x12345...'
              mb={3}
              id='delegateAddress'
              name='delegateAddress'
              ref={register({
                required: true,
                validate: addr => !!isEthAddress(addr),
              })}
              width='100%'
            />

            <Box
              fontFamily='heading'
              fontSize='xs'
              mb={6}
              color='whiteAlpha.700'
            >
              Warning: By switching your address to a delegate, you are giving
              that delegate address the right to act on your behalf.
            </Box>
            <Flex width='100%' justifyContent='flex-end'>
              <Button
                type='submit'
                loadingText='Submitting'
                // ml='auto'
                // justifySelf='flex-end'
                isLoading={loading}
                disabled={loading}
              >
                UPDATE
              </Button>
            </Flex>
            {currentError && (
              <Flex color='red.400' fontSize='m' mr={2} alignItems='center'>
                <Icon
                  as={RiErrorWarningLine}
                  color='red.400'
                  mr={2}
                  transform='translateY(-2px)'
                />
                {currentError.message}
              </Flex>
            )}
          </Box>
        </Flex>
      </FormControl>
    </form>
  );
};

export default UpdateDelegate;
