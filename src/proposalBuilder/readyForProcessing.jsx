import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Flex } from '@chakra-ui/react';
import { ParaSm } from '../components/typography';
import {
  PropActionBox,
  StatusCircle,
  StatusDisplayBox,
  VotingInactive,
} from './actionPrimitives';
import { useDao } from '../contexts/DaoContext';

export const ReadyForProcessing = props => {
  const {
    proposal,
    voteData: { userNo, userYes, userNoReadable, userYesReadable },
  } = props;
  const { daoProposals } = useDao();
  const { daoid, daochain } = useParams();
  const nextProposal = useMemo(() => {
    if (daoProposals?.length) {
      return daoProposals
        .filter(p => p.status === 'ReadyForProcessing')
        .sort((a, b) => a.gracePeriodsEnds - b.gracePeriodsEnds)?.[0];
    }
  }, [daoProposals]);

  const isNextProposal = nextProposal?.proposalId === proposal.proposalId;
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
          you voted {userNo > 0 && `No ${userNoReadable}`}
          {userYes > 0 && `Yes ${userYesReadable}`}
        </ParaSm>
        {isNextProposal ? (
          <Button size='sm' mr='2'>
            Process
          </Button>
        ) : (
          <Button
            size='sm'
            mr='2'
            variant='outline'
            as={Link}
            to={`/dao/${daochain}/${daoid}/proposals/${nextProposal?.proposalId}`}
          >
            Next ({nextProposal.proposalId})
          </Button>
        )}
        <Button size='sm'>Early Execute</Button>
      </Flex>
    </PropActionBox>
  );
};
