import React, { useState } from 'react';
import { Box, Button, Divider, Flex, Icon, IconButton } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import FormBuilder from './formBuilder';
import TextBox from '../components/TextBox';

import { isLastItem } from '../utils/general';

const MultiForm = ({ forms }) => {
  const parentForm = useForm({ shouldUnregister: false });
  const [localForms, setLocaForms] = useState(null);

  const handleAddTx = index => {};
  return forms?.map((form, index) => {
    const [isOpen, setIsOpen] = useState(index === 0);
    const handleClick = () => {
      handleAddTx(index);
    };
    const toggleMenu = () => {
      setIsOpen(prevState => !prevState);
    };
    return (
      <Box key={form.id} my={4}>
        {form.isTx && (
          <Flex mb={3} justifyContent='space-between'>
            <TextBox>Transaction {index}</TextBox>
            <Icon
              as={isOpen ? BiChevronDown : BiChevronUp}
              w='25px'
              h='25px'
              cursor='pointer'
              color='secondary.400'
              onClick={toggleMenu}
            />
          </Flex>
        )}
        {isOpen && (
          <FormBuilder
            {...form}
            parentForm={parentForm}
            footer={isLastItem(forms, index)}
          />
        )}
        {isOpen && form.isTx && (
          <Flex justifyContent='flex-end'>
            <Button variant='ghost' onClick={handleClick}>
              <TextBox>Add Transaction</TextBox>
            </Button>
          </Flex>
        )}
        <Divider my={4} />
      </Box>
    );
  });
};

export default MultiForm;
