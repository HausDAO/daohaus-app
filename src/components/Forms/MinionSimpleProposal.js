import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  FormLabel,
  FormControl,
  Flex,
  Input,
  Icon,
  Stack,
  Box,
  Textarea,
  Select,
  Text,
} from '@chakra-ui/react';
import { RiErrorWarningLine } from 'react-icons/ri';

import {
  useDao,
  useTxProcessor,
  useUser,
  useWeb3Connect,
} from '../../contexts/PokemolContext';
import { MinionService } from '../../utils/minion-service';

const MinionProposalForm = () => {
  const [loading, setLoading] = useState(false);
  const [user] = useUser();
  const [dao] = useDao();
  const [web3Connect] = useWeb3Connect();

  const [txProcessor, updateTxProcessor] = useTxProcessor();
  const [currentError, setCurrentError] = useState(null);
  const [minions, setMinions] = useState([]);

  const {
    handleSubmit,
    errors,
    register,
    // formState
  } = useForm();

  useEffect(() => {
    if (dao?.graphData?.minions) {
      const _minions = dao.graphData.minions.map(
        (minion) => minion.minionAddress,
      );
      setMinions(_minions);
      console.log('minis', _minions);
    }
    // eslint-disable-next-line
  }, [dao?.graphData?.minions]);

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

  const txCallBack = (txHash, details) => {
    console.log('txCallBack', txProcessor);
    if (txProcessor && txHash) {
      txProcessor.setTx(txHash, user.username, details, true, false);
      txProcessor.forceUpdate = true;

      updateTxProcessor(txProcessor);
      // close model here
      // onClose();
      // setShowModal(null);
    }
    if (!txHash) {
      console.log('error: ', details);
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);

    console.log(values);
    const setupValues = {
      minion: values.minionContract,
      actionVlaue: 0,
    };
    const minionService = new MinionService(
      web3Connect.web3,
      user.username,
      setupValues,
    );

    try {
      minionService.propose(
        values.targetContract,
        setupValues.actionVlaue,
        values.dataValue,
        values.description,
        txCallBack,
      );
    } catch (err) {
      setLoading(false);
      console.log('error: ', err);
    }
  };

  return minions.length ? (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        isInvalid={errors.name}
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        mb={5}
        flexWrap='wrap'
      >
        <Box w={['100%', null, '50%']} pr={[0, null, 5]}>
          <FormLabel
            htmlFor='minionContract'
            color='white'
            fontFamily='heading'
            textTransform='uppercase'
            fontSize='xs'
            fontWeight={700}
          >
            Minion Contract
          </FormLabel>
          <Select
            name='minionContract'
            mb={5}
            focusBorderColor='secondary.500'
            ref={register({
              required: {
                value: true,
                message: 'Minion contract is required',
              },
            })}
            color='black'
            backgroundColor='white'
            placeholder='Select Minion'
            variant='flushed'
          >
            {' '}
            {minions.map((minion, idx) => (
              <option key={idx} value={minion}>
                {minion}
              </option>
            ))}
            <option value={null}>Create a new minion</option>
          </Select>
          <FormLabel
            htmlFor='targetContract'
            color='white'
            fontFamily='heading'
            textTransform='uppercase'
            fontSize='xs'
            fontWeight={700}
          >
            Target Contract
          </FormLabel>
          <Input
            name='targetContract'
            placeholder='0x'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'Target contract is required',
              },
            })}
            color='white'
            focusBorderColor='secondary.500'
          />
          <Stack spacing={4}>
            <Textarea
              name='description'
              placeholder='Short Description'
              type='textarea'
              mb={5}
              h={10}
              ref={register({
                required: {
                  value: true,
                  message: 'Description is required',
                },
              })}
              color='white'
              focusBorderColor='secondary.500'
            />
          </Stack>
        </Box>
        <Box w={['100%', null, '50%']}>
          <FormLabel
            htmlFor='dataValue'
            color='white'
            fontFamily='heading'
            textTransform='uppercase'
            fontSize='xs'
            fontWeight={700}
          >
            Data
          </FormLabel>
          <Textarea
            name='dataValue'
            placeholder='Raw Hex Data'
            type='textarea'
            mb={5}
            rows={10}
            ref={register({
              required: {
                value: true,
                message: 'Data hex value is required',
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
            Submit
          </Button>
        </Box>
      </Flex>
    </form>
  ) : (
    <>
      <Text>You do not have a minion yet</Text>
      <Text>In beta add a free Minion Boost for your DAO here</Text>
    </>
  );
};

export default MinionProposalForm;
