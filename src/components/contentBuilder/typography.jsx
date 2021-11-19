import { Text } from '@chakra-ui/react';
import React from 'react';
import TextBox from '../TextBox';

export const Label = props => {
  const { text, children } = props;
  return (
    <Text
      textTransform={props.textTransform || 'uppercase'}
      letterSpacing={props.letterSpacing || '0.1rem'}
      fontWeight='700'
      lineHeight='168.4%;'
      {...props}
    >
      {text || children}
    </Text>
  );
};

export const Heading = ({ text, children }) => (
  <TextBox size='md' variant='label'>
    {text || children}
  </TextBox>
);
export const Paragraph = ({ text, children }) => (
  <TextBox variant='body' size='sm'>
    {text || children}
  </TextBox>
);

export const CardLabel = props => (
  <Label fontSize='xs' opacity='0.8' letterSpacing='0.25rem' {...props} />
);
