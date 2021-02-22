import React, { useState } from 'react';
import { Flex, Text, Spinner } from '@chakra-ui/react';

import ProposalCard from './proposalCard';
// import { determineUnreadProposalList } from '../utils/proposalUtils';
// import { useDaoMember } from '../contexts/DaoMemberContext';
import Paginator from './paginator';
// import ProposalFilters from './proposalFilters';
// import ListSort from './listSort';
import {
  defaultFilterOptions,
  getMemberFilters,
  sortOptions,
} from '../utils/proposalContent';
import ContentBox from './ContentBox';
import GenericSelect from './genericSelect';
import { useEffect } from 'react/cjs/react.development';
import { determineUnreadProposalList } from '../utils/proposalUtils';
import { useDaoMember } from '../contexts/DaoMemberContext';

const ProposalsList = ({ proposals, customTerms }) => {
  const { daoMember } = useDaoMember();

  const [paginatedProposals, setPageProposals] = useState(null);
  const [listProposals, setListProposals] = useState(null);

  const [isLoaded, setIsLoaded] = useState(false);

  const [filterOptions, setFilterOptions] = useState(defaultFilterOptions);
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Newest');
  const [unreadItems, setUnreadItems] = useState(null);

  useEffect(() => {
    if (proposals?.length) {
      setIsLoaded(true);
    }
  }, [proposals]);

  useEffect(() => {
    const setActionNeeded = (unread) => {
      setFilterOptions(getMemberFilters());
      setUnreadItems(unread);
      setListProposals(unread);
      setFilter('Action Needed');
      setSort('Oldest');
    };
    const setDisplayAll = () => {
      setFilterOptions(defaultFilterOptions);
      setUnreadItems(0);
      setListProposals(proposals);
      setFilter('All');
      setSort('Newest');
    };
    if (daoMember && +daoMember.shares > 0 && proposals?.length) {
      const unread = proposals.filter(
        (proposal) =>
          determineUnreadProposalList(proposal, true, daoMember.memberAddress)
            ?.unread,
      );
      if (unread.length) {
        setActionNeeded(unread);
      } else {
        setDisplayAll();
      }
    } else {
      setDisplayAll();
    }
  }, [daoMember]);

  const handleFilter = (option) => {
    if (option?.value && option?.type && option?.name) {
      setListProposals(
        proposals.filter((proposal) => proposal[option.type] === option.value),
      );
      setFilter(option.name);
    }
  };
  const handleSort = (option) => {
    // if()
  };
  return (
    <>
      <Flex wrap='wrap'>
        <GenericSelect
          currentOption={filter}
          options={filterOptions}
          handleSelect={handleFilter}
          label='Filter By'
          alertNumber={unreadItems?.length}
          showAlert={'Action Needed'}
        />
        <GenericSelect
          label='Sort By'
          currentOption={sort}
          options={sortOptions}
          handleSelect={handleSort}
        />
      </Flex>
      {isLoaded &&
        paginatedProposals?.map((proposal) => {
          return (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              customTerms={customTerms}
            />
          );
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
      {listProposals && !listProposals.length && (
        <ContentBox mt={6} p={3}>
          <Text>No Proposals here yet</Text>
        </ContentBox>
      )}
    </>
  );
};

export default ProposalsList;
// useEffect(() => {
//   const filterAndSortProposals = () => {
//     let filteredProposals = proposals;
//     if (sort && filter) {
//       filteredProposals = proposals
//         .filter((prop) => {
//           if (filter.value === 'All') {
//             return true;
//           }
//           if (filter.value === 'Action Needed') {
//             const unread = determineUnreadProposalList(
//               prop,
//               daoMember.shares > 0,
//               daoMember.memberAddress,
//             );
//             return unread.unread;
//           } else {
//             return prop[filter.type] === filter.value;
//           }
//         })
//         .sort((a, b) => {
//           if (sort.value === 'submissionDateAsc') {
//             return +a.createdAt - +b.createdAt;
//           } else if (sort.value === 'voteCountDesc') {
//             return b.votes.length - a.votes.length;
//           } else {
//             return +b.createdAt - +a.createdAt;
//           }
//         });
//       if (
//         sort.value !== 'submissionDateAsc' &&
//         sort.value !== 'submissionDateDesc'
//       ) {
//         filteredProposals = filteredProposals.sort((a, b) => {
//           return a.status === sort.value ? -1 : 1;
//         });
//       }
//     }
//     setListProposals(filteredProposals);
//   };
//   if (proposals?.length) {
//     filterAndSortProposals();
//     setIsLoaded(true);
//   }
// }, [proposals, sort, filter]);
