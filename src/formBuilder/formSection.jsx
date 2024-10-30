import React from 'react';
import { Box, Divider, Flex, Icon } from '@chakra-ui/react';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

import FormBuilder from './formBuilder';
import TextBox from '../components/TextBox';
import { multiTXIndicatorStates } from './indicatorState';

const FormSection = props => {
  const {
    title,
    after,
    parentForm,
    isLastItem,
    form,
    toggleVisible,
    setParentFields,
    isVisible = true,
  } = props;

  return (
    <Box>
      <Flex mb={3} justifyContent='flexStart'>
        <TextBox>{form?.title || title}</TextBox>
        {toggleVisible && (
          <Icon
            as={isVisible ? BiChevronDown : BiChevronUp}
            ml='auto'
            w='25px'
            h='25px'
            cursor='pointer'
            color='secondary.400'
            onClick={toggleVisible}
          />
        )}
      </Flex>

      <Box
        visibility={isVisible ? 'visible' : 'hidden'}
        height={isVisible ? 'fitContent' : '0'}
      >
        <FormBuilder
          {...form}
          footer={isLastItem}
          parentForm={parentForm}
          indicatorStates={isLastItem && multiTXIndicatorStates}
          setParentFields={setParentFields}
        />
      </Box>
      {isVisible && <Flex justifyContent='flex-end'> {after} </Flex>}
      <Divider my={4} />
    </Box>
  );
};

export default FormSection;
