import React, { useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/core';

import { useDao, useProposals } from '../../contexts/PokemolContext';
import ProposalCard from './ProposalCard';
import { defaultProposals } from '../../utils/constants';
import ProposalFilter from './ProposalFilter';
import ProposalSort from './ProposalSort';

const ProposalsList = () => {
  const [dao] = useDao();
  const [proposals] = useProposals();
  const [listProposals, setListProposals] = useState(defaultProposals);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filter, setFilter] = useState();
  const [sort, setSort] = useState();

  useEffect(() => {
    if (proposals.length > 0) {
      filterAndSortProposals();
      setIsLoaded(true);
    }
    // eslint-disable-next-line
  }, [proposals, sort, filter]);

  const filterAndSortProposals = () => {
    console.log('new sort filter', sort, filter);
    console.log('proposals', proposals);
    let filteredProposals = proposals;

    if (sort && filter) {
      filteredProposals = proposals
        .filter((prop) => {
          if (dao.version === '1' || filter.value === 'All') {
            return true;
          }
          if (filter.value === 'Action Needed') {
            return prop.activityFeed.unread;
          } else {
            return prop.proposalType === filter.value;
          }
        })
        .sort((a, b) => {
          if (sort.value === 'submissionDateAsc') {
            return +a.createdAt - +b.createdAt;
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
      <Box w='60%'>
        <Flex>
          {dao.version !== '1' ? (
            <ProposalFilter filter={filter} setFilter={setFilter} />
          ) : null}
          <ProposalSort sort={sort} setSort={setSort} />
        </Flex>
        {listProposals.map((proposal) => {
          return (
            <ProposalCard
              proposal={proposal}
              key={proposal.id}
              isLoaded={isLoaded}
            />
          );
        })}
      </Box>
    </>
  );
};

export default ProposalsList;
