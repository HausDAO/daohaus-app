import React from 'react';
import { Flex } from '@chakra-ui/react';
import { AiOutlineCheck } from 'react-icons/ai';

import {
  InactiveButton,
  MiddleActionBox,
  PropActionBox,
  TopStatusBox,
  UserVoteData,
  VotingInactive,
} from './proposalActionPrimitives';
import MinionExexcuteFactory from './minionExexcuteFactory';

const Processed = props => {
  const { voteData, proposal } = props;

  if (!proposal.isMinion) {
    return (
      <PropActionBox>
        <TopStatusBox
          status={voteData?.isPassing ? 'Passed' : 'Failed'}
          appendStatusText='and processed'
          circleColor={voteData?.isPassing ? 'green' : 'red'}
        />
        <MiddleActionBox>
          <VotingInactive
            {...props}
            justifyContent='space-between'
            voteData={voteData}
          />
        </MiddleActionBox>
        <Flex alignItems='center'>
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
      <TopStatusBox
        status={voteData?.isPassing ? 'Passed' : 'Failed'}
        appendStatusText={`and ${
          proposal?.executed ? 'minion executed' : 'needs execution'
        }`}
        circleColor={voteData?.isPassing ? 'green' : 'red'}
        quorum
        voteData={voteData}
        proposal={proposal}
      />
      <MiddleActionBox>
        <VotingInactive
          {...props}
          justifyContent='space-between'
          voteData={voteData}
        />
      </MiddleActionBox>
      <Flex alignItems='center'>
        <UserVoteData voteData={voteData} />
        <Flex ml='auto'>
          {voteData.isPassing && <MinionExexcuteFactory {...props} />}
        </Flex>
      </Flex>
    </PropActionBox>
  );
};
export default Processed;
