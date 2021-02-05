import React, { useEffect, useState } from 'react';
import { Flex, Text, Box, Spinner } from '@chakra-ui/react';

import ProposalCard from './proposalCard';
import { determineUnreadProposalList } from '../utils/proposalUtils';
import { useDaoMember } from '../contexts/DaoMemberContext';
import Paginator from './paginator';
import ProposalFilters from './proposalFilters';
import ProposalSort from './proposalSort';

const ProposalsList = ({ proposals }) => {
  const { daoMember } = useDaoMember();
  const [listProposals, setListProposals] = useState(proposals);
  const [pageProposals, setPageProposals] = useState(proposals);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filter, setFilter] = useState();
  const [sort, setSort] = useState();

  useEffect(() => {
    if (proposals && proposals.length > 0) {
      filterAndSortProposals();
      setIsLoaded(true);
    }
  }, [proposals, sort, filter]);

  const filterAndSortProposals = () => {
    let filteredProposals = proposals;

    if (sort && filter) {
      filteredProposals = proposals
        .filter((prop) => {
          if (filter.value === 'All') {
            return true;
          }
          if (filter.value === 'Action Needed') {
            const unread = determineUnreadProposalList(
              prop,
              daoMember.shares > 0,
              daoMember.memberAddress,
            );
            return unread.unread;
          } else {
            return prop[filter.type] === filter.value;
          }
        })
        .sort((a, b) => {
          if (sort.value === 'submissionDateAsc') {
            return +a.createdAt - +b.createdAt;
          } else if (sort.value === 'voteCountDesc') {
            return b.votes.length - a.votes.length;
          } else {
            return +b.createdAt - +a.createdAt;
          }
        });

      if (
        sort.value !== 'submissionDateAsc' &&
        sort.value !== 'submissionDateDesc'
      ) {
        filteredProposals = filteredProposals.sort((a, b) => {
          return a.status === sort.value ? -1 : 1;
        });
      }
    }

    setListProposals(filteredProposals);
  };

  return (
    <>
      <Flex wrap='wrap'>
        <ProposalFilters
          filter={filter}
          setFilter={setFilter}
          setSort={setSort}
          proposals={proposals}
        />
        <ProposalSort sort={sort} setSort={setSort} />
      </Flex>
      {isLoaded &&
        pageProposals.map((proposal) => {
          return <ProposalCard key={proposal.id} proposal={proposal} />;
        })}

      {isLoaded ? (
        <Paginator
          perPage={3}
          setRecords={setPageProposals}
          allRecords={listProposals}
        />
      ) : (
        <Flex w='100%' h='250px' align='center' justify='center'>
          <Spinner
            thickness='6px'
            speed='0.45s'
            emptyColor='whiteAlpha.300'
            color='primary.500'
            size='xl'
            mt={40}
          />
        </Flex>
      )}
      {proposals && !proposals.length && (
        <Box m={6}>
          <Text>No Proposals here yet</Text>
        </Box>
      )}
    </>
  );
};

export default ProposalsList;
