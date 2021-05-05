import React, { useState, useEffect, useRef } from 'react';
import { Flex, Text, Spinner } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import ProposalCard from './proposalCard';
import Paginator from './paginator';
import {
  defaultFilterOptions,
  getFilters,
  sortOptions,
  allFilter,
} from '../utils/proposalContent';
import ContentBox from './ContentBox';
import GenericSelect from './genericSelect';
import {
  determineUnreadProposalList,
  handleListFilter,
  handleListSort,
  searchProposals,
} from '../utils/proposalUtils';
import { useDaoMember } from '../contexts/DaoMemberContext';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import ProposalSearch from './proposalSearch';

const ProposalsList = ({ proposals, customTerms }) => {
  const { daoMember } = useDaoMember();
  const { address } = useInjectedProvider();
  const [paginatedProposals, setPageProposals] = useState(null);
  const [listProposals, setListProposals] = useState(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const { daoid } = useParams();

  const [filterOptions, setFilterOptions] = useState(defaultFilterOptions);
  const [filter, setFilter] = useSessionStorage(`${daoid}-filter`, null);
  const [sort, setSort] = useSessionStorage(`${daoid}-sort`, null);

  const prevMember = useRef('No Address');
  const searchMode = useRef(false);

  useEffect(() => {
    if (proposals?.length) {
      setIsLoaded(true);
    }
  }, [proposals]);

  useEffect(() => {
    const sameUser = prevMember.current === address;
    if (!proposals || sameUser) return;

    //  Later on, create functionality to only call the assigment below if daoMember is true or false
    //  This would require setting that functionality in the context
    const unread = proposals.filter(
      proposal =>
        determineUnreadProposalList(proposal, true, daoMember?.memberAddress)
          ?.unread,
    );

    const newOptions = getFilters(daoMember, unread);
    setFilterOptions(newOptions);

    const hasSavedChanges =
      prevMember.current === 'No Address' && filter && sort;
    if (!hasSavedChanges) {
      setFilter(newOptions?.main?.[0] || allFilter);
      setSort(
        unread?.length
          ? { name: 'Oldest', value: 'submissionDateAsc' }
          : { name: 'Newest', value: 'submissionDateDesc' },
      );
    }
    prevMember.current = address;
  }, [daoMember, proposals, filter, sort]);

  useEffect(() => {
    if (!proposals || !filter || !sort || searchMode.current) return;
    setListProposals(
      handleListSort(handleListFilter(proposals, filter, daoMember), sort),
    );
  }, [filter, sort, proposals, daoMember, address]);

  const handleFilter = option => {
    if (!option?.value || !option?.type || !option?.name) {
      console.error(
        'Filter component did not update. Received incorrect data stucture',
      );
      return;
    }
    const isActiveFilter =
      option?.value === 'Active' || option?.value === 'Action Needed';
    searchMode.current = false;
    setFilter(option);
    setSort({
      name: isActiveFilter ? 'Oldest' : 'Newest',
      value: `submissionDate${isActiveFilter ? 'Asc' : 'Desc'}`,
    });
  };

  const handleSort = option => {
    if (!option?.value || !option?.name) {
      console.error(
        'Sort component did not update. Received incorrect data stucture',
      );
      return;
    }
    searchMode.current = false;
    setSort(option);
  };
  const performSearch = (address, searchFilters) => {
    setSort({ name: 'Newest', value: 'submissionDateDesc' });
    setFilter(allFilter);
    setListProposals(searchProposals(address, searchFilters, proposals));
    searchMode.current = true;
  };
  const resetSearch = () => {
    searchMode.current = false;
    prevMember.current = 'inReset';
    setFilter(null);
    setSort(null);
  };
  return (
    <>
      <Flex wrap='wrap' position='relative' justifyContent='space-between'>
        <Flex flex={1} justifyContent='flex-end'>
          <GenericSelect
            currentOption={filter?.name}
            options={filterOptions}
            handleSelect={handleFilter}
            label='Filter By'
            count={listProposals?.length}
          />
          <GenericSelect
            label='Sort By'
            currentOption={sort?.name}
            options={sortOptions}
            handleSelect={handleSort}
            // uses custom props to prevent overlap with search button
            containerProps={{
              width: ['100%', null, null, '38%'],
              zIndex: '10',
              marginRight: '10%',
              marginLeft: '5%',
            }}
          />
          <ProposalSearch
            performSearch={performSearch}
            resetSearch={resetSearch}
          />
        </Flex>
      </Flex>
      {isLoaded &&
        paginatedProposals?.map(proposal => {
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
