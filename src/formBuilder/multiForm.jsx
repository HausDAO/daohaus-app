import React, { useState } from 'react';
import { Box, Button, Divider, Flex, Icon, IconButton } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { BiChevronDown, BiChevronUp, BiPlus } from 'react-icons/bi';
import FormBuilder from './formBuilder';
import TextBox from '../components/TextBox';

import { isLastItem } from '../utils/general';
import { PROPOSAL_FORMS } from '../data/forms';

const MultiForm = ({ forms }) => {
  const parentForm = useForm({ shouldUnregister: false });
  const [localForms, setLocalForms] = useState(forms);

  const handleAddTx = (index, form) => {
    if (localForms?.length && index && form) {
      console.log(`index`, index);
      console.log(`form`, form);
      console.log(`localForms`, localForms);
      console.log(`localForms.slice(index)`, localForms.slice(0, index));
      setLocalForms(prevState => [
        ...prevState.slice(0, index + 1),
        form,
        ...prevState.slice(index + 1, -1),
      ]);
    }
  };
  return localForms?.map((form, index) => {
    if (form.isTx)
      return (
        <TxFormSection
          key={form.id}
          {...form}
          index={index}
          handleAddTx={handleAddTx}
          parentForm={parentForm}
        />
      );
    return (
      <FormSection
        key={form.id}
        {...form}
        index={index}
        parentForm={parentForm}
      />
    );
  });
};

const FormSection = props => {
  const { index, forms, title, after, parentForm } = props;

  const [isOpen, setIsOpen] = useState(index === 0);
  const toggleMenu = () => {
    setIsOpen(prevState => !prevState);
  };
  return (
    <Box>
      <Flex mb={3} justifyContent='space-between'>
        <TextBox>{title}</TextBox>
        <Icon
          as={isOpen ? BiChevronDown : BiChevronUp}
          w='25px'
          h='25px'
          cursor='pointer'
          color='secondary.400'
          onClick={toggleMenu}
        />
      </Flex>
      {isOpen && (
        <FormBuilder
          {...props}
          footer={isLastItem(forms, index)}
          parentForm={parentForm}
        />
      )}
      {isOpen && <> {after} </>}
      <Divider my={4} />
    </Box>
  );
};

const TxFormSection = props => {
  const { index, isTx, handleAddTx } = props;

  const handleClick = () => handleAddTx(index, props);
  return (
    <FormSection
      title={`Transaction ${index}`}
      {...props}
      after={
        isTx && (
          <Flex justifyContent='flex-end'>
            <Button variant='ghost' onClick={handleClick}>
              <TextBox>Add Transaction</TextBox>
              <Icon
                ml={2}
                as={BiPlus}
                w='20px'
                h='20px'
                cursor='pointer'
                transform='translateY(1px)'
              />
            </Button>
          </Flex>
        )
      }
    />
  );
};

export default MultiForm;
