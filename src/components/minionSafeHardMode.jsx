import React from 'react';

import {
  Box,
  Button,
  FormLabel,
  Input,
  InputRightAddon,
  Select,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import TextBox from './TextBox';
import { truncateAddr } from '../utils/general';

const MinionSafeHardMode = ({ minions, submitAction, loading }) => {
  const { handleSubmit, register } = useForm();

  const onSubmit = values => {
    console.log(values);
    submitAction(values);
  };

  return (
    <>
      <Box>
        Add the below minion address as a signer for your existing Gnosis Safe.
        Once the minion is approved as a new signer, register your Safe.
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <TextBox as={FormLabel} size='xs' htmlFor='minionAddress' mb={2}>
            Select Minion
          </TextBox>
          <InputRightAddon background='primary.500' p={0}>
            <Select
              name='minionAddress'
              ref={register}
              color='white'
              background='primary.500'
              w='100%'
            >
              {minions.map((minion, idx) => (
                <option key={idx} default={!idx} value={minion.minionAddress}>
                  {`${minion.details} ${truncateAddr(minion.minionAddress)}`}
                </option>
              ))}
            </Select>
          </InputRightAddon>
          <TextBox as={FormLabel} size='xs' htmlFor='safeAddress' mb={2}>
            Safe Address
          </TextBox>
          <Input
            name='safeAddress'
            placeholder='0x...'
            mb={5}
            ref={register()}
            color='white'
            focusBorderColor='secondary.500'
          />
        </Box>
        <Button type='submit' isLoading={loading}>
          Create
        </Button>
      </form>
    </>
  );
};

export default MinionSafeHardMode;
