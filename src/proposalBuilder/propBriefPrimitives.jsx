import React, { useMemo } from 'react';
import { Flex, Box, Skeleton } from '@chakra-ui/react';
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri';

import { Bold, ParaMd } from '../components/typography';
import MinionTransfer from './minionTransfer';

import { generateOfferText, generateRequestText } from '../utils/proposalCard';
import DelegateTransfer from './delegateTransfer';

export const PropCardTransfer = ({
  incoming,
  outgoing,
  itemText,
  action,
  specialLocation,
}) => {
  return (
    <Flex alignItems='center' mb='2'>
      {incoming && (
        <Box transform='translateY(1px)'>
          <RiArrowRightLine size='1.1rem' />
        </Box>
      )}
      {outgoing && (
        <Box transform='translateY(1px)'>
          <RiArrowLeftLine size='1.1rem' />
        </Box>
      )}
      {specialLocation ? (
        <ParaMd ml='1'>
          {action}
          <Bold> {itemText} </Bold> to <Bold> {specialLocation}</Bold>
        </ParaMd>
      ) : (
        <ParaMd ml='1'>
          {action}
          <Bold> {itemText} </Bold>
        </ParaMd>
      )}
    </Flex>
  );
};
export const PropCardRequest = ({ proposal }) => {
  const requestText = useMemo(() => {
    if (proposal) {
      return generateRequestText(proposal);
    }
  }, [proposal]);
  return (
    <PropCardTransfer incoming action='Requesting' itemText={requestText} />
  );
};

export const PropCardOffer = ({ proposal }) => {
  const requestText = useMemo(() => {
    if (proposal) {
      return generateOfferText(proposal);
    }
  }, [proposal]);
  return <PropCardTransfer outgoing action='Offering' itemText={requestText} />;
};

export const CustomTransfer = props => {
  const { customTransferUI } = props;
  if (customTransferUI === 'minionTransfer') {
    return <MinionTransfer {...props} />;
  }
  if (customTransferUI === 'uberDelegate') {
    return <DelegateTransfer {...props} />;
  }
  return null;
};

export const AsyncCardTransfer = props => {
  const { isLoaded } = props;
  return (
    <Skeleton isLoaded={isLoaded} height='1.5rem'>
      <PropCardTransfer {...props} />
    </Skeleton>
  );
};
