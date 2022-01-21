import React from 'react';
import { Flex } from '@chakra-ui/react';
import { AiOutlineCheck } from 'react-icons/ai';

import { ParaSm } from '../components/typography';
import {
  InactiveButton,
  PropActionBox,
  StatusCircle,
  StatusDisplayBox,
  UserVoteData,
  VotingInactive,
} from './actionPrimitives';
import MinionExexcuteFactory from './minionExexcuteFactory';
import ExecuteQuorum from './ExecuteQuorum';

const Processed = props => {
  const { voteData, proposal } = props;

  if (!proposal.isMinion) {
    return (
      <PropActionBox>
        <StatusDisplayBox>
          <StatusCircle color={voteData?.isPassing ? 'green' : 'red'} />
          <ParaSm fontWeight='700' mr='1'>
            {voteData?.isPassing ? 'Passed' : 'Failed'}
          </ParaSm>
          {voteData.isPassing && (
            <ParaSm fontStyle='italic'>and processed</ParaSm>
          )}
        </StatusDisplayBox>
        <VotingInactive
          {...props}
          justifyContent='space-between'
          voteData={voteData}
        />
        <Flex mt='2' alignItems='center'>
          <UserVoteData voteData={voteData} />
          <Flex ml='auto'>
            <InactiveButton size='sm' leftIcon={<AiOutlineCheck />}>
              Processed
            </InactiveButton>
          </Flex>
        </Flex>
      </PropActionBox>
    );
  }
  return (
    <PropActionBox>
      <StatusDisplayBox>
        <ExecuteQuorum proposal={proposal} voteData={voteData} />
        <StatusCircle color={voteData?.isPassing ? 'green' : 'red'} />
        <ParaSm fontWeight='700' mr='1'>
          {voteData?.isPassing ? 'Passed' : 'Failed'}
        </ParaSm>

        {voteData.isPassing && (
          <ParaSm fontStyle='italic'>
            and {proposal?.executed ? 'minion executed' : 'needs execution'}
          </ParaSm>
        )}
      </StatusDisplayBox>
      <VotingInactive
        {...props}
        justifyContent='space-between'
        voteData={voteData}
      />
      <Flex mt='2' alignItems='center'>
        <UserVoteData voteData={voteData} />
        <Flex ml='auto'>
          {voteData.isPassing && <MinionExexcuteFactory {...props} />}
        </Flex>
      </Flex>
    </PropActionBox>
  );
};
export default Processed;
