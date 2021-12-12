import React from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { ParaSm } from '../components/typography';
import {
  PropActionBox,
  StatusCircle,
  StatusDisplayBox,
  VotingInactive,
} from './actionPrimitives';

export const ReadyForProcessing = props => {
  const {
    voteData: { noVoteAmount, yesVoteAmount },
  } = props;

  return (
    <PropActionBox>
      <StatusDisplayBox>
        <StatusCircle color='green' />
        <ParaSm fontWeight='700' mr='1'>
          Passed
        </ParaSm>
        <ParaSm fontStyle='italic'>and needs processing</ParaSm>
      </StatusDisplayBox>
      <VotingInactive {...props} justifyContent='space-between' />
      <Flex mt='2' alignItems='center'>
        <ParaSm fontStyle='italic' mr='auto'>
          you voted {noVoteAmount && `No ${noVoteAmount}`}
          {yesVoteAmount && `Yes ${yesVoteAmount}`}
        </ParaSm>
        <Button size='sm' mr='2'>
          Process
        </Button>
        <Button size='sm'>Early Execute</Button>
      </Flex>
    </PropActionBox>
  );
};
