import React from 'react';
import { Box, Checkbox, Flex } from '@chakra-ui/react';
import TextBox from '../components/TextBox';
import FieldWrapper from './fieldWrapper';
import Paragraphs from './Paragraphs';

const CheckSwitch = props => {
  const {
    formCondition,
    checked,
    unchecked,
    setFormCondition,
    label,
    title,
    description,
  } = props;
  const isChecked = checked === formCondition;
  const handleChange = () =>
    isChecked ? setFormCondition(unchecked) : setFormCondition(checked);
  const checkLabel = label?.[formCondition] || label;
  const checkTitle = title?.[formCondition] || title;
  const checkDescription = description?.[formCondition] || description;
  return (
    <FieldWrapper
      {...props}
      label={checkLabel}
      _containerProps={{ alignItems: 'flexStart' }}
    >
      <Flex flexDir='column'>
        <Checkbox
          isChecked={isChecked}
          onChange={handleChange}
          size='lg'
          borderColor='grey'
          width='fit-content'
          colorScheme='transparent'
          iconColor='secondary.500'
        >
          <Flex flexDir='column'>
            {checkTitle && (
              <TextBox size='md' variant='body' ml='2'>
                {checkTitle}
              </TextBox>
            )}
          </Flex>
        </Checkbox>
        {checkDescription && Array.isArray(checkDescription) ? (
          <Paragraphs pars={checkDescription} />
        ) : (
          <TextBox size='sm' variant='body' ml={9}>
            {checkDescription}
          </TextBox>
        )}
      </Flex>
    </FieldWrapper>
  );
};

export default CheckSwitch;
