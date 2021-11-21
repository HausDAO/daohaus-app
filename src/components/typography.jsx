import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiDashboard2Line,
  RiDashboard3Line,
} from 'react-icons/ri';

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
    <Text fontSize='2rem' variant='label' lineHeight='168.4%;'>
      {text || children}
    </Text>
  );
};

export const ParaMd = props => {
  const { text, children } = props;
  return (
    <Text fontSize='1rem' lineHeight='168.4%;' {...props}>
      {text || children}
    </Text>
  );
};
export const ParaSm = props => {
  const { text, children } = props;
  return (
    <Text fontSize='.8rem' lineHeight='168.4%;' {...props}>
      {text || children}
    </Text>
  );
};

export const ParaLg = props => {
  const { text, children } = props;
  return (
    <Text fontSize='1.1rem' lineHeight='168.4%;' {...props}>
      {text || children}
    </Text>
  );
};

export const CardLabel = props => (
  <Label fontSize='xs' opacity='0.8' letterSpacing='0.25rem' {...props} />
);

export const CardIncoming = props => (
  <Flex alignItems='center'>
    <RiArrowLeftLine size='1.1rem' />
    <ParaMd {...props} ml={1} />
  </Flex>
);
