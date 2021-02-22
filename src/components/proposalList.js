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
  actionNeededFilter,
  allFilter,
} from '../utils/proposalContent';
import ContentBox from './ContentBox';
import GenericSelect from './genericSelect';
import { useEffect } from 'react/cjs/react.development';
import {
  determineUnreadProposalList,
  handleListFilter,
  handleListSort,
} from '../utils/proposalUtils';
import { useDaoMember } from '../contexts/DaoMemberContext';

const ProposalsList = ({ proposals, customTerms }) => {
  const { daoMember } = useDaoMember();

  const [paginatedProposals, setPageProposals] = useState(null);
  const [listProposals, setListProposals] = useState(null);

  const [isLoaded, setIsLoaded] = useState(false);

  const [filterOptions, setFilterOptions] = useState(defaultFilterOptions);
  const [filter, setFilter] = useState(null);
  const [sort, setSort] = useState(null);
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
      setFilter(actionNeededFilter);
      setSort({ name: 'Oldest', value: 'submissionDateAsc' });
    };
    const setDisplayAll = () => {
      setFilterOptions(defaultFilterOptions);
      setUnreadItems(0);
      setFilter(allFilter);
      setSort({ name: 'Newest', value: 'submissionDateDesc' });
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

  useEffect(() => {
    if (!proposals || !filter || !sort) return;
    setListProposals(
      handleListSort(handleListFilter(proposals, filter, daoMember), sort),
    );
  }, [filter, sort, proposals, daoMember]);

  const handleFilter = (option) => {
    if (!option?.value || !option?.type || !option?.name) {
      console.error(
        'Filter component did not update. Received incorrect data stucture',
      );
      return;
    }
    setFilter(option);
  };

  const handleSort = (option) => {
    if (!option?.value || !option?.name) {
      console.error(
        'Sort component did not update. Received incorrect data stucture',
      );
      return;
    }
    setSort(option);
  };
  return (
    <>
      <Flex wrap='wrap'>
        <GenericSelect
          currentOption={filter?.name}
          options={filterOptions}
          handleSelect={handleFilter}
          label='Filter By'
          alertNumber={unreadItems?.length}
          showAlert={'Action Needed'}
        />
        <GenericSelect
          label='Sort By'
          currentOption={sort?.name}
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
