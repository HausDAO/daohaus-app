import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Heading,
  Input,
  InputRightAddon,
  Select,
} from '@chakra-ui/react';
import TextBox from '../Shared/TextBox';
import { useForm } from 'react-hook-form';
import AddressInput from '../Forms/AddressInput';

const MinionSafeConfigForm = ({ minions }) => {
  const { handleSubmit, register, setValue, watch } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = (values) => {
    setLoading(true);

    console.log(values);
    // const setupValues = {
    //   minionFactory: supportedChains[network.network_id].minion_factory_addr,
    //   actionVlaue: '0',
    // };
    // const minionFactoryService = new MinionFactoryService(
    //   web3Connect.web3,
    //   user.username,
    //   setupValues,
    // );

    try {
      // minion safe factory
    } catch (err) {
      setLoading(false);
      console.log('error: ', err);
    }
  };

  return (
    <>
      <TextBox fontFamily='heading' fontSize='2xl' fontWeight={700}>
        Select a Minion
      </TextBox>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <InputRightAddon background='primary.500' p={0}>
            <Select
              name='paymentToken'
              ref={register}
              color='white'
              background='primary.500'
              w='100%'
            >
              {minions.map((minion, idx) => (
                <option key={idx} default={!idx} value={minion.minionAddress}>
                  {minion.name}
                </option>
              ))}
            </Select>
          </InputRightAddon>
          <AddressInput
            name='delegate'
            register={register}
            setValue={setValue}
            watch={watch}
          />
        </Box>
        <Button type='submit' isLoading={loading}>
          Create
        </Button>
      </form>
    </>
  );
};

export default MinionSafeConfigForm;
