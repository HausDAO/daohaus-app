import React, { useEffect, useState, Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Box,
  Flex,
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
import ContentBox from '../components/ContentBox';
import ListSelect from '../components/listSelect';
import MainViewLayout from '../components/mainViewLayout';
import { displayBalance } from '../utils/tokenValue';
import { timeToNow } from '../utils/general';

const FILTERS = {
  main: [
    { name: 'All', value: 'all' },
    { name: 'Unsponsored', value: 'Unsponsored' },
    { name: 'InQueue', value: 'InQueue' },
    { name: 'Voting Period', value: 'VotingPeriod' },
    { name: 'Grace Period', value: 'GracePeriod' },
    { name: 'Ready For Processing', value: 'ReadyForProcessing' },
    { name: 'Passed', value: 'Passed' },
    { name: 'Failed', value: 'Failed' },
    { name: 'Cancelled', value: 'Cancelled' },
  ],
};

const ProposalAudit = ({ daoProposals }) => {
  const { daoid, daochain } = useParams();
  const { refreshDao } = useTX();
  const [proposals, setProposals] = useState({});
  const [filter, setFilter] = useState(FILTERS[0]);
  const [listProposals, setListProposals] = useState({});

  const handleRefreshDao = () => {
    const skipVaults = true;
    refreshDao(skipVaults);
  };

  const handleFilter = e => {
    setFilter(e);
    setListProposals(
      e.value === 'all' ? proposals : { [e.value]: proposals[e.value] },
    );
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
      setListProposals(sorted);
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
          <Td border='none'>{proposal.proposalId}</Td>
          <Td border='none'>{proposal.sharesRequested}</Td>
          <Td border='none'>{proposal.lootRequested}</Td>

          <Td border='none'>
            {`${proposal.paymentRequested /
              10 **
                proposal.paymentTokenDecimals} ${proposal.paymentTokenSymbol ||
              ' '}`}
          </Td>

          <Td border='none'>
            {`${displayBalance(
              proposal.tributeOffered,
              proposal.tributeTokenDecimals,
            ) || 0} ${proposal.tributeTokenSymbol || ''}`}
          </Td>

          <Td border='none'>{`yes: ${proposal.yesShares} / no: ${proposal.noShares}`}</Td>
          <Td border='none'>{renderStatus(proposal)}</Td>
          <Td border='none'>{timeToNow(proposal.createdAt)}</Td>
          <Td border='none'>
            <Link
              to={`/dao/${daochain}/${daoid}/proposals/${proposal.proposalId}`}
            >
              View
            </Link>
          </Td>
        </Tr>
        <Tr key={`${proposal.proposalId}-2`}>
          <Td border='none' colSpan='3'>
            {proposal.proposalType}
          </Td>
          <Td border='none' colSpan='2'>
            {proposal.title}
          </Td>
          <Td border='none' colSpan='3'>
            {proposal.description}
          </Td>
        </Tr>
        <Tr key={`${proposal.proposalId}-3`}>
          <Td colSpan='8' />
        </Tr>
      </Fragment>
    );
  };

  return (
    <MainViewLayout header='Proposal Audit' isDao>
      <Flex
        wrap='wrap'
        position='relative'
        justifyContent='space-between'
        fontFamily='heading'
        textTransform='uppercase'
      >
        <Box>{`${daoProposals?.length || 'looking for'} proposals`}</Box>
        {daoProposals?.length && (
          <Flex justifyContent='space-between' align='center'>
            <ListSelect
              currentOption={filter?.name}
              options={FILTERS}
              handleSelect={handleFilter}
              label='Filter By'
              count={listProposals?.length}
            />
            <IconButton
              icon={<RiRefreshLine size='1rem' />}
              p={0}
              size='sm'
              variant='outline'
              onClick={handleRefreshDao}
              ml={10}
            />
          </Flex>
        )}
      </Flex>

      <Box w='100%' pr={[0, null, null, null, 6]} my={5}>
        <ContentBox w='100%'>
          {Object.keys(listProposals).map(section => {
            return (
              <Box key={section} mb={7}>
                <Box mb={3} fontSize='xl' fontFamily='heading' fontWeight='700'>
                  {`${section} (${listProposals[section].length})`}
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
                    {listProposals[section].map(prop => {
                      return renderRow(prop);
                    })}
                  </Tbody>
                </Table>
              </Box>
            );
          })}
        </ContentBox>
      </Box>
    </MainViewLayout>
  );
};

export default ProposalAudit;
