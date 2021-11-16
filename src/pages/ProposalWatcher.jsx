import React, { useEffect, useState, Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  IconButton,
} from '@chakra-ui/react';
import { RiRefreshLine } from 'react-icons/ri';

import { useTX } from '../contexts/TXContext';
import MainViewLayout from '../components/mainViewLayout';
import ContentBox from '../components/ContentBox';
import { timeToNow } from '../utils/general';

const ProposalWatcher = ({ daoProposals }) => {
  const { daoid, daochain } = useParams();
  const { refreshDao } = useTX();
  const [proposals, setProposals] = useState({});

  const handleRefreshDao = () => {
    const skipVaults = true;
    refreshDao(skipVaults);
  };

  useEffect(() => {
    if (daoProposals) {
      const sorted = [...daoProposals]
        .sort((a, b) => {
          return a.createdAt - b.createdAt;
        })
        .reduce(
          (sortedProps, prop) => {
            sortedProps[prop.status].push(prop);
            return sortedProps;
          },
          {
            Unsponsored: [],
            InQueue: [],
            VotingPeriod: [],
            GracePeriod: [],
            ReadyForProcessing: [],
            Passed: [],
            Failed: [],
            Cancelled: [],
          },
        );
      setProposals(sorted);
    }
  }, [daoProposals]);

  const renderStatus = proposal => {
    if (proposal.status === 'VotingPeriod') {
      return `${proposal.status} ends ${timeToNow(proposal.votingPeriodEnds)}`;
    }
    if (proposal.status === 'GracePeriod') {
      return `${proposal.status} ends ${timeToNow(proposal.gracePeriodEnds)}`;
    }
    return proposal.status;
  };

  const renderRow = proposal => {
    return (
      <Fragment key={proposal.proposalId}>
        <Tr>
          <Td>{proposal.proposalId}</Td>
          {/* <Td>{JSON.stringify(proposal.details)}</Td> */}
          <Td>{proposal.sharesRequested}</Td>
          <Td>{proposal.lootRequested}</Td>
          <Td>
            {`${proposal.paymentRequested /
              10 **
                proposal.paymentTokenDecimals} ${proposal.paymentTokenSymbol ||
              ' '}`}
          </Td>
          <Td>
            {`${proposal.tributeOffered /
              10 **
                proposal.tributeTokenDecimals} ${proposal.tributeTokenSymbol ||
              ''}`}
          </Td>
          <Td>{`yes: ${proposal.yesShares} - no: ${proposal.noShares}`}</Td>
          <Td>{renderStatus(proposal)}</Td>
          <Td>{timeToNow(proposal.createdAt)}</Td>
          <Td>
            <Link
              to={`/dao/${daochain}/${daoid}/proposals/${proposal.proposalId}`}
            >
              View
            </Link>
          </Td>
        </Tr>
        <Tr key={`${proposal.proposalId}-2`}>
          <Td colSpan='2'>{proposal.proposalType}</Td>
          <Td colSpan='2'>{proposal.title}</Td>
          <Td colSpan='5'>{proposal.description}</Td>
        </Tr>
        <Tr key={`${proposal.proposalId}-3`}>
          <Td colSpan='9' backgroundColor='gray.900' />
        </Tr>
      </Fragment>
    );
  };

  return (
    <MainViewLayout header='Proposal List' isDao>
      <Box w='100%'>
        <Box my={5} w='100%'>
          <ContentBox w='100%' fontSize='xl' fontFamily='heading' ml={3}>
            {`${daoProposals?.length || 'looking for'} proposals`}
            {daoProposals?.length && (
              <IconButton
                icon={<RiRefreshLine size='1rem' />}
                p={0}
                size='sm'
                variant='outline'
                onClick={handleRefreshDao}
                ml={10}
              />
            )}
          </ContentBox>
        </Box>

        <Box w='100%' pr={[0, null, null, null, 6]} mb={6}>
          <ContentBox w='100%'>
            {Object.keys(proposals).map(section => {
              return (
                <Box key={section}>
                  <Box mt={5} p={4} fontSize='xl' fontFamily='heading'>
                    {`${section} (${proposals[section].length})`}
                  </Box>

                  <Table size='sm' variant='simple'>
                    <Thead>
                      <Tr>
                        <Th>ID</Th>
                        <Th>shares</Th>
                        <Th>loot</Th>
                        <Th>payment</Th>
                        <Th>tribute</Th>
                        <Th>votes</Th>
                        <Th>status</Th>
                        <Th>created</Th>
                        <Th />
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
      </Box>
    </MainViewLayout>
  );
};

export default ProposalWatcher;
