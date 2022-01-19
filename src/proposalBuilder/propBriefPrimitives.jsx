import React, { useMemo } from 'react';
import { Flex, Box, Skeleton } from '@chakra-ui/react';
import {
  RiAlertLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiErrorWarningLine,
} from 'react-icons/ri';

import { Bold, ParaMd } from '../components/typography';
import MinionTransfer from './minionTransfer';

import { generateOfferText, generateRequestText } from '../utils/proposalCard';
import DelegateTransfer from './delegateTransfer';
import StakeTransfer from './UHstakingTransfer';
import WhitelistTokenTransfer from './whitelistTokenTransfer';
import GuildKickTransfer from './guildKickTransfer';
import UberRQTransfer from './uberRQTransfer';
import MultiTxTransfer from './multiTxTransfer';

export const PropCardTransfer = ({
  incoming,
  outgoing,
  itemText,
  customUI,
  action,
  specialLocation,
  error,
}) => {
  return (
    <Flex alignItems='center' mb='4'>
      {incoming && (
        <Box transform='translateY(1px)' mr='1'>
          <RiArrowRightLine size='1.1rem' />
        </Box>
      )}
      {outgoing && (
        <Box transform='translateY(1px)' mr='1'>
          <RiArrowLeftLine size='1.1rem' />
        </Box>
      )}
      {error && (
        <Box mr='1'>
          <RiErrorWarningLine size='1.1rem' />
        </Box>
      )}
      {customUI}
      {itemText && (
        <>
          {specialLocation ? (
            <ParaMd>
              {action}
              <Bold> {itemText} </Bold> to <Bold> {specialLocation}</Bold>
            </ParaMd>
          ) : (
            <ParaMd>
              {action}
              <Bold> {itemText} </Bold>
            </ParaMd>
          )}
        </>
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
export const PropCardError = ({ message }) => {
  return (
    <PropCardTransfer
      error
      customUI={
        <ParaMd>{message || 'Error: could not load proposal data'}</ParaMd>
      }
    />
  );
};
export const CustomTransfer = props => {
  const { customTransferUI } = props;
  if (customTransferUI === 'minionTransfer') {
    return <MinionTransfer {...props} />;
  }
  if (customTransferUI === 'uberDelegate') {
    return <DelegateTransfer {...props} />;
  }
  if (customTransferUI === 'uberStake') {
    return <StakeTransfer {...props} />;
  }
  if (customTransferUI === 'whitelistToken') {
    return <WhitelistTokenTransfer {...props} />;
  }
  if (customTransferUI === 'guildKick') {
    return <GuildKickTransfer {...props} />;
  }
  if (customTransferUI === 'uberRQ') {
    return <UberRQTransfer {...props} />;
  }
  if (customTransferUI === 'multiTx') {
    return <MultiTxTransfer {...props} />;
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
