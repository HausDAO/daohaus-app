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

const ProposalsList = () => {
  const [dao] = useDao();
  const [proposals] = useProposals();

  const [memberWallet] = useMemberWallet();
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
      <Flex>
        {dao.version !== '1' ? (
          <ProposalFilter
            filter={filter}
            setFilter={setFilter}
            listLength={listProposals.length}
          />
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
    </>
  );
};

export default ProposalsList;
