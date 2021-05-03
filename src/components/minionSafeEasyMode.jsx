import React from 'react';
import {
  Box,
  Button,
  FormLabel,
  InputRightAddon,
  Select,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import TextBox from './TextBox';

import { truncateAddr } from '../utils/general';
import AddressInput from '../forms/addressInput';

const MinionSafeEasyMode = ({ minions, submitAction, loading }) => {
  const { handleSubmit, register, setValue, watch } = useForm();

  const onSubmit = values => {
    console.log(values);
    submitAction(values);
  };

  return (
    <>
      <Box>
        This Minion allows you to interact with a specially created Gnosis Safe
        for your DAO. This means the DAO can interact with any Gnosis Safe App
        via proposal. Add a number of Human Co-Signers to execute transactions,
        once they pass the DAO proposal stage.
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

          <AddressInput
            name='delegate'
            register={register}
            setValue={setValue}
            watch={watch}
            formLabel='Delegate'
          />
        </Box>
        <Button type='submit' isLoading={loading}>
          Create
        </Button>
      </form>
    </>
  );
};

export default MinionSafeEasyMode;
