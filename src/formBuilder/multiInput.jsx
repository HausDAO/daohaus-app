import { Button } from '@chakra-ui/button';
import { Flex } from '@chakra-ui/layout';
import React, { useState } from 'react';

import GenericInput from './genericInput';

const MultiInput = props => {
  const [inputs, setInputs] = useState([props]);

  const addCopy = () => {
    const nextIndex = inputs.length;
    const nextInput = {
      ...props,
      name: `${props.name}<<MULTI>>${nextIndex}`,
      htmlFor: `${props.name}-${nextIndex}`,
    };
    setInputs([...inputs, nextInput]);
  };

  const getButton = index =>
    index + 1 === inputs.length ? (
      <Button onClick={addCopy} background='transparent' p='0'>
        +
      </Button>
    ) : null;

  const getLabel = index => (index === 0 ? props.label : null);
  return (
    <Flex
      flexDirection='column'
      w={['100%', null, '48%']}
      maxH='200px'
      overflow='auto'
    >
      {inputs?.map((input, index) => {
        return (
          <GenericInput
            {...input}
            key={input.name}
            label={getLabel(index)}
            append={getButton(index)}
            w='100%'
          />
        );
      })}
    </Flex>
  );
};

export default MultiInput;
