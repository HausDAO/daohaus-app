import React, { useMemo } from 'react';
import { Progress } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import {
  PropActionBox,
  StatusDisplayBox,
  StatusCircle,
  VotingSection,
} from './actionPrimitives';
import { ParaSm } from '../components/typography';
import { validate } from '../utils/validation';

const InQueue = ({ proposal }) => {
  const time = useMemo(() => {
    if (validate.number(Number(proposal?.votingPeriodStarts))) {
      return formatDistanceToNow(
        new Date(Number(proposal?.votingPeriodStarts) * 1000),
      );
    }
  }, [proposal]);
  return (
    <PropActionBox>
      <StatusDisplayBox>
        <StatusCircle color='green' />
        <ParaSm fontWeight='700' mr='1'>
          Voting
        </ParaSm>
        <ParaSm>starts in {time} </ParaSm>
      </StatusDisplayBox>
      <Progress value={80} mb='3' colorScheme='secondary.500' />
      <VotingSection disableAll />
    </PropActionBox>
  );
};

export default InQueue;
