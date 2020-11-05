import React, { useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/core';

import { useProposals } from '../../contexts/PokemolContext';
import ProposalCard from './ProposalCard';
import { defaultProposals } from '../../utils/constants';
import ProposalFilter from './ProposalFilter';
import ProposalSort from './ProposalSort';

const ProposalsList = () => {
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
    setListProposals(proposals);
  };

  return (
    <>
      <Box w='60%'>
        <Flex>
          {}
          <ProposalFilter filter={filter} setFilter={setFilter} />
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
