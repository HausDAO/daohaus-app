import React from 'react';
import { Text } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const Bold = styled.span`
  font-weight: 700;
`;
export const Italic = styled.span`
  font-style: 'italic';
`;

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

export const Heading = props => {
  const { text, children } = props;
  return (
    <Text fontSize='2rem' variant='label' lineHeight='168.4%;' {...props}>
      {text || children}
    </Text>
  );
};

export const ParaMd = props => {
  const { text, children } = props;
  return (
    <Text fontSize='1rem' lineHeight='1.1rem' {...props}>
      {text || children}
    </Text>
  );
};

export const ParaSm = props => {
  const { text, children } = props;
  return (
    <Text fontSize='.9rem' lineHeight='1.1rem' {...props}>
      {text || children}
    </Text>
  );
};
export const ParaLg = props => {
  const { text, children } = props;
  return (
    <Text fontSize='1.1rem' lineHeight='1.25rem' {...props}>
      {text || children}
    </Text>
  );
};

export const CardLabel = props => (
  <Label fontSize='xs' opacity='0.8' letterSpacing='0.25rem' {...props} />
);
