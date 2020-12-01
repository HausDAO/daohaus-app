import React, { useEffect, useState } from 'react';
import { Flex } from '@chakra-ui/core';

import {
  useDao,
  useMemberWallet,
  useProposals,
} from '../../contexts/PokemolContext';
import ProposalCard from './ProposalCard';
import { defaultProposals } from '../../utils/constants';
import ProposalFilter from './ProposalFilter';
import ProposalSort from './ProposalSort';
import { determineUnreadProposalList } from '../../utils/proposal-helper';
import Paginator from '../Shared/Paginator';

const ProposalsList = () => {
  const [dao] = useDao();
  const [proposals] = useProposals();
  const [memberWallet] = useMemberWallet();
  const [listProposals, setListProposals] = useState(defaultProposals);
  const [pageProposals, setPageProposals] = useState(defaultProposals);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filter, setFilter] = useState();
  const [sort, setSort] = useState();

  useEffect(() => {
    if (proposals.length > 0) {
      filterAndSortProposals();
      setIsLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposals, sort, filter]);

  const filterAndSortProposals = () => {
    let filteredProposals = proposals;

    if (sort && filter) {
      filteredProposals = proposals
        .filter((prop) => {
          if (dao.version === '1' || filter.value === 'All') {
            return true;
          }
          if (filter.value === 'Action Needed') {
            const unread = determineUnreadProposalList(
              prop,
              memberWallet.activeMember,
              memberWallet.memberAddress,
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
      <Flex>
        {dao.version !== '1' ? (
          <ProposalFilter
            filter={filter}
            setFilter={setFilter}
            proposals={proposals}
          />
        ) : null}
        <ProposalSort sort={sort} setSort={setSort} />
      </Flex>
      {pageProposals.map((proposal) => {
        return (
          <ProposalCard
            proposal={proposal}
            key={proposal.id}
            isLoaded={isLoaded}
          />
        );
      })}

      {isLoaded ? (
        <Paginator
          perPage={3}
          setRecords={setPageProposals}
          allRecords={listProposals}
        />
      ) : null}
    </>
  );
};

export default ProposalsList;
