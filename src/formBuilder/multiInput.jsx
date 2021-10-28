import React, { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/button';
import { Flex } from '@chakra-ui/layout';

import GenericInput from './genericInput';

const checkExistingMultis = props => {
  const { name, localForm } = props;
  const values = localForm?.watch?.();

  if (Array.isArray(values[name])) {
    return values[name].map((multi, index) => ({
      ...props,
      name: `${name}.${index}`,
      htmlFor: `${name}.${index}`,
    }));
  }
  return [
    {
      ...props,
      name: `${name}.0`,
      htmlFor: `${name}.0`,
    },
  ];
};

const MultiInput = props => {
  const { name } = props;
  const [inputs, setInputs] = useState(null);

  useEffect(() => {
    console.log('COMPONENT MOUNT');
    setInputs(checkExistingMultis(props));
  }, [name]);
  const addCopy = () => {
    const nextIndex = inputs.length;
    const nextInput = {
      ...props,
      name: `${name}.${nextIndex}`,
      htmlFor: `${name}.${nextIndex}`,
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
    <Flex flexDirection='column' maxH='200px' overflow='auto' key={name}>
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
