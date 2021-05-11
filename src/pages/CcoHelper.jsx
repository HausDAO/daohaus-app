import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react';
import MainViewLayout from '../components/mainViewLayout';
import { isCcoProposal, contributionTotalValue } from '../utils/cco';
import { useTX } from '../contexts/TXContext';
import ContentBox from '../components/ContentBox';
import { groupByKey, timeToNow } from '../utils/general';
import { getDateTime } from '../utils/metadata';

const CcoHelper = React.memo(
  ({ daoMetaData, currentDaoTokens, daoProposals }) => {
    const { daoid, daochain } = useParams();
    const [roundData, setRoundData] = useState(null);
    const [currentContributionData, setCurrentContributionData] = useState(
      null,
    );
    const [proposals, setProposals] = useState({
      needsSponsor: [],
      sponsoredInQueue: [],
      inVoting: [],
      afterVoting: [],
      processed: [],
    });
    const [otherProposals, setOtherProposals] = useState([]);
    const [groupedByApplicant, setGroupedByApplicant] = useState({});

    const { refreshDao } = useTX();

    useEffect(() => {
      const interval = setInterval(() => {
        refreshDao();
      }, 30000);
      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      const setUp = async ccoType => {
        const ccoToken = currentDaoTokens.find(
          token =>
            token.tokenAddress.toLowerCase() ===
            daoMetaData.boosts[ccoType].metadata.tributeToken.toLowerCase(),
        );

        const date = await getDateTime();
        const now = Number(date.seconds);
        const configData = daoMetaData.boosts[ccoType].metadata;
        const duration =
          Number(configData.raiseEndTime) - Number(configData.raiseStartTime);

        setRoundData({
          ccoType,
          ccoToken,
          now,
          active: daoMetaData.boosts[ccoType].active,
          ...configData,
          beforeRaise: Number(configData.raiseStartTime) > now,
          raiseOver: `${Number(configData.startTime) + duration}` < now,
          claimOpen: +configData.claimPeriodStartTime < now,
        });
      };

      const ccoType = daoMetaData?.daosquarecco ? 'daosquarecco' : 'cco';
      if (
        currentDaoTokens &&
        daoMetaData?.boosts &&
        daoMetaData.boosts[ccoType]
      ) {
        setUp(ccoType);
      }
    }, [currentDaoTokens, daoMetaData]);

    useEffect(() => {
      if (roundData && daoProposals && daoProposals.length) {
        const contributionProposals = [];
        const otherProps = [];
        const sortedByPropId = daoProposals.sort((a, b) => {
          return +b.proposalId - +a.proposalId;
        });
        const propSplit = sortedByPropId.reduce(
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
          statusPercentage: (contributionTotal / +roundData.maxTarget) * 100,
          remaining: +roundData.maxTarget - contributionTotal,
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
        const groupedByApplicant = groupByKey(
          currentContributionData.contributionProposals,
          'applicant',
        );

        setGroupedByApplicant(groupedByApplicant);

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

    const renderRow = proposal => {
      const voteWarning =
        proposal.status === 'VotingPeriod' &&
        +proposal.yesShares <= proposal.noShares;
      return (
        <Tr
          key={proposal.proposalId}
          backgroundColor={voteWarning ? 'red.500' : ''}
        >
          <Td>{proposal.proposalId}</Td>
          {/* <Td>{timeToNow(proposal.createdAt)}</Td> */}
          <Td>
            {new Date(+proposal.createdAt * 1000).toISOString()}
            <br />
            epochTime: {proposal.createdAt}
          </Td>
          <Td>
            {proposal.status === 'VotingPeriod'
              ? `${proposal.status} ends ${timeToNow(
                  proposal.votingPeriodEnds,
                )}`
              : proposal.status}
          </Td>
          <Td>{proposal.lootRequested}</Td>
          <Td>
            {`${proposal.tributeOffered /
              10 ** proposal.tributeTokenDecimals} ${
              proposal.tributeTokenSymbol
            }`}
          </Td>
          <Td>{`yes: ${proposal.yesShares} - no: ${proposal.noShares}`}</Td>

          <Td>
            <Link
              to={`/dao/${daochain}/${daoid}/proposals/${proposal.proposalId}`}
            >
              View
            </Link>
          </Td>

          <Td>
            <a
              href={`https://cco.daohaus.club/cco/eligibility/${roundData.ccoId}/${proposal.applicant}`}
              target='_blank'
              rel='noreferrer'
            >
              {proposal.applicant}
            </a>
          </Td>
        </Tr>
      );
    };

    const renderOtherRow = proposal => {
      return (
        <Tr key={proposal.proposalId}>
          <Td>{proposal.proposalId}</Td>
          <Td>{proposal.createdAt}</Td>
          <Td>{JSON.parse(proposal.details)?.title}</Td>
          <Td>{proposal.status}</Td>
          <Td>
            <Link
              to={`/dao/${daochain}/${daoid}/proposals/${proposal.proposalId}`}
            >
              View
            </Link>
          </Td>
          <Td>{proposal.applicant}</Td>
        </Tr>
      );
    };

    const renderGroupedRow = proposal => {
      return (
        <Tr key={proposal.proposalId}>
          <Td>{proposal.applicant}</Td>
          <Td>{proposal.proposalId}</Td>
          <Td>{proposal.lootRequested}</Td>
          <Td>
            {`${proposal.tributeOffered /
              10 ** proposal.tributeTokenDecimals} ${
              proposal.tributeTokenSymbol
            }`}
          </Td>
        </Tr>
      );
    };
    return (
      <MainViewLayout header='CCO Admin' isDao>
        <Box w='100%'>
          {daoProposals ? (
            <Box my={10} w='100%'>
              <ContentBox w='100%' fontSize='xl'>
                {`current total sponsored: 
              ${daoProposals.reduce((s, p) => {
                s += p.sponsored ? +p.tributeOffered / 10 ** 18 : 0;
                return s;
              }, 0)}`}
              </ContentBox>
            </Box>
          ) : null}

          <Box w='100%' pr={[0, null, null, null, 6]} mb={6}>
            <ContentBox w='100%'>
              {Object.keys(proposals).map(section => {
                return (
                  <Box key={section}>
                    <Box mt={10}>{section}</Box>
                    <Box mt={10}>
                      {`current total tribute:
                    ${proposals[section].reduce((s, p) => {
                      s += +p.tributeOffered / 10 ** 18;
                      return s;
                    }, 0)}`}
                    </Box>

                    <Table size='sm' variant='simple'>
                      <Thead>
                        <Tr>
                          <Th>proposal ID</Th>
                          <Th>timestamp</Th>
                          <Th>status</Th>
                          <Th>loot</Th>
                          <Th>tribute</Th>
                          <Th>votes</Th>
                          <Th>link</Th>
                          <Th>valid address</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {proposals[section].map(prop => {
                          return renderRow(prop);
                        })}
                      </Tbody>
                    </Table>
                  </Box>
                );
              })}
            </ContentBox>
          </Box>

          <Box w='100%'>
            <ContentBox w='100%'>
              <Box>nonCcoProposals</Box>
              <Table size='sm' variant='simple'>
                <Thead>
                  <Tr>
                    <Th>proposal ID</Th>
                    <Th>created At</Th>
                    <Th>details</Th>
                    <Th>status</Th>
                    <Th>link</Th>
                    <Th>address</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {otherProposals.map(prop => {
                    return renderOtherRow(prop);
                  })}
                </Tbody>
              </Table>
            </ContentBox>
          </Box>

          <Box w='100%' mt={10}>
            <ContentBox w='100%'>
              <Box>grouped by applicant</Box>

              {Object.keys(groupedByApplicant).map(key => {
                if (groupedByApplicant[key].length > 1) {
                  return (
                    <Table size='sm' variant='unstyled' key={key}>
                      <Thead>
                        <Tr>
                          <Th>applicant</Th>
                          <Th>proposal ID</Th>
                          <Th>loot</Th>
                          <Th>tribute</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {groupedByApplicant[key].map(prop => {
                          return renderGroupedRow(prop);
                        })}
                      </Tbody>
                    </Table>
                  );
                }
                return null;
              })}
            </ContentBox>
          </Box>
        </Box>
      </MainViewLayout>
    );
  },
);

export default CcoHelper;
