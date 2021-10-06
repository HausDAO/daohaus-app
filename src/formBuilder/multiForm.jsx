import { Box, Divider } from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import TextBox from '../components/TextBox';
import { isLastItem } from '../utils/general';
import FormBuilder from './formBuilder';

const MultiForm = ({ forms, isTx }) => {
  const parentForm = useForm({ shouldUnregister: false });

  return forms?.map((form, index) => (
    <Box key={form.id} my={4}>
      {isTx && <TextBox>Transaction {index + 1}</TextBox>}
      <FormBuilder
        {...form}
        parentForm={parentForm}
        footer={isLastItem(forms, index)}
      />
      <Divider my={4} />
    </Box>
  ));
};

export default MultiForm;
