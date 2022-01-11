import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Flex } from '@chakra-ui/react';
import { ParaSm } from '../components/typography';
import {
  EarlyExecuteButton,
  EarlyExecuteGauge,
  PropActionBox,
  StatusCircle,
  StatusDisplayBox,
  UserVoteData,
  VotingInactive,
} from './actionPrimitives';
import { useDao } from '../contexts/DaoContext';
import { useTX } from '../contexts/TXContext';
import { TX } from '../data/contractTX';
import {
  cheatExecutionStatus,
  removeExecutionCheat,
} from '../utils/proposalCard';
import { determineProposalStatus } from '../utils/proposalUtils';

const ReadyForProcessing = props => {
  const { proposal, voteData, canInteract } = props;
  const { isPassing } = voteData;
  const { daoProposals } = useDao();
  const { daoid, daochain } = useParams();
  const { submitTransaction } = useTX();

  const [loading, setLoading] = useState(false);

  const nextProposal = useMemo(() => {
    if (daoProposals?.length) {
      const proposal2process = daoProposals
        .map(p => ({ ...p, status: determineProposalStatus(p) }))
        .filter(p => p.status === 'ReadyForProcessing');

      if (proposal2process?.length > 0) {
        return proposal2process[0];
      }
    }
  }, [daoProposals, proposal]);

  console.log(`nextProposal`, nextProposal);
  const processProposal = async () => {
    setLoading(true);
    const shouldCheatCache = () => isPassing && proposal?.isMinion;
    const getTx = proposal => {
      if (proposal.whitelist) {
        return TX.PROCESS_WL_PROPOSAL;
      }
      if (proposal.guildkick) {
        return TX.PROCESS_GK_PROPOSAL;
      }
      return TX.PROCESS_PROPOSAL;
    };
    await submitTransaction({
      args: [proposal.proposalIndex],
      tx: getTx(proposal),
      lifeCycleFns: {
        beforeTx() {
          if (shouldCheatCache()) {
            cheatExecutionStatus(proposal.proposalId, daoid);
          }
        },
        onCatch() {
          if (shouldCheatCache()) {
            removeExecutionCheat(proposal.proposalId, daoid);
          }
        },
      },
    });
    setLoading(false);
  };

  const isNextProposal = nextProposal?.proposalId === proposal.proposalId;
  return (
    <PropActionBox>
      <StatusDisplayBox>
        <EarlyExecuteGauge proposal={proposal} voteData={voteData} />
        <StatusCircle color={voteData.isPassing ? 'green' : 'red'} />
        <ParaSm fontWeight='700' mr='1'>
          {voteData?.isPassing ? 'Passed' : 'Failed'}
        </ParaSm>
        <ParaSm fontStyle='italic'>and needs processing</ParaSm>
      </StatusDisplayBox>
      <VotingInactive {...props} justifyContent='space-between' />
      <Flex mt='2' alignItems='center'>
        <UserVoteData voteData={voteData} />
        <Flex ml='auto'>
          {isNextProposal ? (
            <Button
              size='sm'
              mr='2'
              onClick={processProposal}
              isLoading={loading}
              isDisabled={!canInteract}
            >
              Process
            </Button>
          ) : (
            <Button
              size='sm'
              variant='outline'
              as={Link}
              to={`/dao/${daochain}/${daoid}/proposals/${nextProposal?.proposalId}`}
            >
              Process Next ({nextProposal?.proposalId})
            </Button>
          )}
        </Flex>
        {proposal?.proposal?.minQuorum && <EarlyExecuteButton ml='2' />}
      </Flex>
    </PropActionBox>
  );
};
export default ReadyForProcessing;
