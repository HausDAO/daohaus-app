import React from 'react';
import { Flex } from '@chakra-ui/react';
import { AiOutlineClose } from 'react-icons/ai';

import { ParaSm } from '../components/typography';
import { propStatusText } from './propCardText';

import {
  InactiveButton,
  PropActionBox,
  StatusCircle,
  StatusDisplayBox,
} from './actionPrimitives';

const Cancelled = () => {
  return (
    <PropActionBox>
      <StatusDisplayBox>
        <StatusCircle color='red' />
        <ParaSm fontWeight='700' mr='1'>
          Cancelled
        </ParaSm>
      </StatusDisplayBox>
      <ParaSm mb={3}>{propStatusText.Cancelled}</ParaSm>
      <Flex justifyContent='flex-end'>
        <InactiveButton leftIcon={<AiOutlineClose />}>Cancelled</InactiveButton>
      </Flex>
    </PropActionBox>
  );
};
export default Cancelled;
