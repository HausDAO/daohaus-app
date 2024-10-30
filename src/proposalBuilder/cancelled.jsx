import React from 'react';
import { Flex } from '@chakra-ui/react';
import { AiOutlineClose } from 'react-icons/ai';

import { propStatusText } from '../data/proposalCardText';

import {
  InactiveButton,
  PropActionBox,
  TopStatusBox,
} from './proposalActionPrimitives';

const Cancelled = () => {
  return (
    <PropActionBox>
      <TopStatusBox
        status='Cancelled'
        circleColor='red'
        helperText={propStatusText.cancelled}
      />
      <Flex justifyContent='flex-end'>
        <InactiveButton leftIcon={<AiOutlineClose />}>Cancelled</InactiveButton>
      </Flex>
    </PropActionBox>
  );
};
export default Cancelled;
