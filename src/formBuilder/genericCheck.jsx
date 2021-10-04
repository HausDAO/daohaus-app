import React from 'react';
import { Checkbox, Flex } from '@chakra-ui/react';
import TextBox from '../components/TextBox';
import FieldWrapper from './fieldWrapper';
import Paragraphs from './Paragraphs';

const GenericCheck = props => {
  const { label, title, description, isChecked = true, onChange } = props;
  return (
    <FieldWrapper {...props} label={label}>
      <Flex flexDir='column'>
        <Checkbox
          isChecked={isChecked}
          onChange={onChange}
          size='lg'
          borderColor='grey'
          width='fit-content'
          colorScheme='transparent'
          iconColor='secondary.500'
        >
          <Flex flexDir='column'>
            {title && (
              <TextBox size='md' variant='body' ml='2'>
                {title}
              </TextBox>
            )}
          </Flex>
        </Checkbox>
        {description && Array.isArray(description) ? (
          <Paragraphs pars={description} />
        ) : (
          <TextBox size='sm' variant='body' ml={9}>
            {description}
          </TextBox>
        )}
      </Flex>
    </FieldWrapper>
  );
};

export default GenericCheck;
