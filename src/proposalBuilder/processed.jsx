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
import { ParaSm } from '../components/typography';
import { isMinionProposalType } from '../utils/proposalUtils';

const Processed = props => {
  const { voteData, proposal } = props;

  if (!isMinionProposalType(proposal)) {
    return (
      <PropActionBox>
        <TopStatusBox
          status={
            voteData?.isPassing && !voteData?.votePassedProcessFailed
              ? 'Passed'
              : 'Failed'
          }
          appendStatusText='and processed'
          circleColor={voteData?.isPassing ? 'green' : 'red'}
        />
        {voteData?.votePassedProcessFailed && (
          <ParaSm>The vote passed but process function failed</ParaSm>
        )}
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
        status={
          voteData?.isPassing && !voteData?.votePassedProcessFailed
            ? 'Passed'
            : 'Failed'
        }
        appendStatusText={
          !voteData?.votePassedProcessFailed &&
          `and ${proposal?.executed ? 'minion executed' : 'needs execution'}`
        }
        circleColor={
          voteData?.isPassing && !voteData?.votePassedProcessFailed
            ? 'green'
            : 'red'
        }
        quorum
        voteData={voteData}
        proposal={proposal}
      />
      {voteData?.votePassedProcessFailed && (
        <ParaSm>The vote passed but failed to process</ParaSm>
      )}
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
          {voteData.isPassing && !voteData?.votePassedProcessFailed && (
            <MinionExexcuteFactory {...props} />
          )}
        </Flex>
      </Flex>
    </PropActionBox>
  );
};
export default Processed;
