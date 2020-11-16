import { FormControl, FormHelperText, FormLabel, Input } from '@chakra-ui/core';
import TextBox from '../Shared/TextBox';
import React from 'react';
// import { useForm } from 'react-hook-form';
import { useEns } from '../../contexts/PokemolContext';

const AddressInput = ({ register, setValue, watch, formLabel }) => {
  formLabel = formLabel || 'applicant';
  const [ens] = useEns();

  const ensAddr = watch('applicantHidden', '');

  const handleChange = async (e) => {
    if (e.target.value.endsWith('.eth')) {
      const address = await ens.provider.resolveName(e.target.value);
      if (address) {
        setValue('applicantHidden', address);
      } else {
        setValue('applicantHidden', 'No ENS set');
      }
    } else {
      setValue('applicantHidden', '');
    }
  };

  return (
    <FormControl>
      <TextBox as={FormLabel} htmlFor='applicant'>
        {formLabel}
      </TextBox>
      <FormHelperText fontSize='xs' id='applicant-helper-text'>
        {ensAddr || 'Use ETH address or ENS'}
      </FormHelperText>
      <Input
        name='applicant'
        placeholder='0x'
        mb={5}
        ref={register({
          required: {
            value: true,
            message: `${formLabel} is required`,
          },
        })}
        color='white'
        focusBorderColor='secondary.500'
        onChange={handleChange}
      />
      <Input type='hidden' name='applicantHidden' ref={register} />
    </FormControl>
  );
};

export default AddressInput;
