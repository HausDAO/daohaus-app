import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react';
import MainViewLayout from '../components/mainViewLayout';
import { isCcoProposal, contributionTotalValue } from '../utils/cco';
import { useTX } from '../contexts/TXContext';
import ContentBox from '../components/ContentBox';

const CcoHelper = React.memo(function ccohelper({
  daoMetaData,
  currentDaoTokens,
  daoProposals,
}) {
  const { daoid, daochain } = useParams();
  const [roundData, setRoundData] = useState(null);
  const [currentContributionData, setCurrentContributionData] = useState(null);
  const [proposals, setProposals] = useState({
    needsSponsor: [],
    sponsoredInQueue: [],
    inVoting: [],
    afterVoting: [],
    processed: [],
  });
  const [otherProposals, setOtherProposals] = useState([]);

  const { refreshDao } = useTX();

  useEffect(() => {
    const interval = setInterval(() => {
      refreshDao();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentDaoTokens && daoMetaData?.boosts?.cco?.active) {
      const ccoToken = currentDaoTokens.find(
        (token) =>
          token.tokenAddress.toLowerCase() ===
          daoMetaData.boosts.cco.metadata.tributeToken.toLowerCase(),
      );

      const now = new Date() / 1000;
      let round;
      if (now < daoMetaData.boosts.cco.metadata.raiseStartTime) {
        round = daoMetaData.boosts.cco.metadata.rounds[0];
      } else {
        round = daoMetaData.boosts.cco.metadata.rounds.find((round, i) => {
          const inRound =
            +round.startTime < now &&
            +`${+round.startTime + +round.duration}` > now;
          return (
            i === daoMetaData.boosts.cco.metadata.rounds.length - 1 || inRound
          );
        });
      }

      const currentRound = {
        ...round,
        endTime: `${+round.startTime + +round.duration}`,
        roundOpen:
          +round.startTime < now &&
          +`${+round.startTime + +round.duration}` > now,
        roundOver: +`${+round.startTime + +round.duration}` < now,
      };

      setRoundData({
        ccoToken,
        currentRound,
        network: daoMetaData.boosts.cco.metadata.network,
        claimTokenValue: daoMetaData.boosts.cco.metadata.claimTokenValue,
        claimTokenSymbol: daoMetaData.boosts.cco.metadata.claimTokenSymbol,
        raiseStartTime: daoMetaData.boosts.cco.metadata.raiseStartTime,
        beforeRaise: +daoMetaData.boosts.cco.metadata.raiseStartTime > now,
        raiseOver: +`${+round.startTime + +round.duration}` < now,
        claimPeriodStartTime:
          daoMetaData.boosts.cco.metadata.claimPeriodStartTime,
        claimOpen: +daoMetaData.boosts.cco.metadata.claimPeriodStartTime < now,
      });
    }
  }, [currentDaoTokens, daoMetaData]);

  useEffect(() => {
    if (roundData && daoProposals.length) {
      const contributionProposals = [];
      const otherProps = [];
      const propSplit = daoProposals.reduce(
        (coll, proposal) => {
          if (isCcoProposal(proposal, roundData)) {
            coll.contributionProposals.push(proposal);
          } else {
            coll.otherProps.push(proposal);
          }

          return coll;
        },
        { contributionProposals, otherProps },
      );

      const contributionTotal = contributionTotalValue(
        propSplit.contributionProposals,
        roundData,
      );
      setOtherProposals(propSplit.otherProps);
      setCurrentContributionData({
        contributionProposals: propSplit.contributionProposals,
        contributionTotal,
        statusPercentage:
          (contributionTotal / +roundData.currentRound.maxTarget) * 100,
        remaining: +roundData.currentRound.maxTarget - contributionTotal,
      });
    }
  }, [roundData, daoProposals]);

  useEffect(() => {
    if (
      currentContributionData &&
      currentContributionData.contributionProposals.length
    ) {
      const needsSponsor = [];
      const sponsoredInQueue = [];
      const inVoting = [];
      const afterVoting = [];
      const processed = [];

      const sortedProps = currentContributionData.contributionProposals.reduce(
        (coll, prop) => {
          const now = new Date() / 1000;
          if (!prop.sponsored) {
            coll.needsSponsor.push(prop);
          }

          if (prop.sponsored && now < +prop.votingPeriodStarts) {
            coll.sponsoredInQueue.push(prop);
          }

          if (
            prop.sponsored &&
            now > +prop.votingPeriodStarts &&
            now < +prop.votingPeriodEnds
          ) {
            coll.inVoting.push(prop);
          }

          if (
            prop.sponsored &&
            now > +prop.votingPeriodEnds &&
            !prop.processed
          ) {
            coll.afterVoting.push(prop);
          }

          if (prop.processed) {
            coll.processed.push(prop);
          }

          return coll;
        },
        {
          needsSponsor,
          sponsoredInQueue,
          inVoting,
          afterVoting,
          processed,
        },
      );

      setProposals(sortedProps);
    }
  }, [currentContributionData]);

  const renderRow = (proposal) => {
    return (
      <Tr>
        <Td>{proposal.proposalId}</Td>
        <Td>{proposal.status}</Td>
        <Td>{proposal.lootRequested}</Td>
        <Td>{`${proposal.tributeOffered /
          10 ** proposal.tributeTokenDecimals} ${
          proposal.tributeTokenSymbol
        }`}</Td>
        <Td>{`yes: ${proposal.yesShares} - no: ${proposal.noShares}`}</Td>

        <Td>
          <Link
            to={`/dao/${daochain}/${daoid}/proposals/${proposal.proposalId}`}
          >
            View
          </Link>
        </Td>
      </Tr>
    );
  };

  const renderOtherRow = (proposal) => {
    return (
      <Tr>
        <Td>{proposal.proposalId}</Td>
        <Td>{proposal.details}</Td>
        <Td>{proposal.status}</Td>

        <Td>
          <Link
            to={`/dao/${daochain}/${daoid}/proposals/${proposal.proposalId}`}
          >
            View
          </Link>
        </Td>
      </Tr>
    );
  };
  return (
    <MainViewLayout header='DAOhaus CCO' isDao={true}>
      <Box w='100%'>
        <Box w={'100%'} pr={[0, null, null, null, 6]} mb={6}>
          <ContentBox w='100%'>
            {Object.keys(proposals).map((section) => {
              return (
                <>
                  <Box mt={10}>{section}</Box>
                  <Table size='sm' variant='simple'>
                    <Thead>
                      <Tr>
                        <Th>proposal ID</Th>
                        <Td>status</Td>
                        <Th>loot</Th>
                        <Th>tribute</Th>
                        <Th>votes</Th>
                        <Th>link</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {proposals[section].map((prop) => {
                        return renderRow(prop);
                      })}
                    </Tbody>
                  </Table>
                </>
              );
            })}
          </ContentBox>
        </Box>
        <Box w={['100%', null, null, null, '50%']}>
          <ContentBox w='100%'>
            <Box mt={10}>nonCcoProposals</Box>
            <Table size='sm' variant='simple'>
              <Thead>
                <Tr>
                  <Th>proposal ID</Th>
                  <Th>details</Th>
                  <Th>status</Th>
                  <Th>link</Th>
                </Tr>
              </Thead>
              <Tbody>
                {otherProposals.map((prop) => {
                  return renderOtherRow(prop);
                })}
              </Tbody>
            </Table>
          </ContentBox>
        </Box>
      </Box>
    </MainViewLayout>
  );
});

export default CcoHelper;
