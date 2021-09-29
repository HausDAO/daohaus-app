import React from 'react';
import { Checkbox } from '@chakra-ui/react';
import TextBox from '../components/TextBox';
import FieldWrapper from './fieldWrapper';

const CheckSwitch = props => {
  const { label, formCondition, checked, unchecked, setFormCondition } = props;
  const isChecked = checked === formCondition;
  const handleChange = () =>
    isChecked ? setFormCondition(unchecked) : setFormCondition(checked);
  const checkLabel = label?.[formCondition] || label;
  return (
    <FieldWrapper {...props} label={checkLabel}>
      <Checkbox
        // isChecked={isChecked}
        onChange={handleChange}
        size='lg'
        borderColor='white'
        colorScheme='blackAlpha'
        iconColor='red.400'
        iconSize='2rem'
        spacing='1rem'
      />
    </FieldWrapper>
  );
};

export default CheckSwitch;
