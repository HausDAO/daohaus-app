import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { RiAddFill } from 'react-icons/ri';
import { Flex, Box, Stack, Button, Spinner } from '@chakra-ui/react';
import deepEqual from 'deep-eql';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import useCanInteract from '../hooks/useCanInteract';
import ActivitiesFeed from '../components/activitiesFeed';
import ContentBox from '../components/ContentBox';
import CsvDownloadButton from '../components/csvDownloadButton';
import ListFilter from '../components/listFilter';
import ListSort from '../components/listSort';
import MainViewLayout from '../components/mainViewLayout';
import MemberCard from '../components/memberCard';
import MembersChart from '../components/membersChart';
import MemberInfoWrapper from '../components/memberInfoWrapper';
import TextBox from '../components/TextBox';
import { getMemberActivites, getMembersActivites } from '../utils/activities';
import { getTerm, getTitle } from '../utils/metadata';
import {
  membersFilterOptions,
  membersSortOptions,
} from '../utils/memberContent';
import useBoost from '../hooks/useBoost';

const Members = React.memo(
  ({
    members,
    activities,
    overview,
    daoMember,
    daoMembers,
    customTerms,
    daoMetaData,
  }) => {
    const { address } = useInjectedProvider();
    const { canInteract } = useCanInteract({
      checklist: ['isConnected', 'isSameChain'],
    });
    const { daoid, daochain } = useParams();
    const { setProposalSelector } = useOverlay();
    const { isActive } = useBoost();

    const [filter, setFilter] = useState('active');
    const [listMembers, setListMembers] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [sort, setSort] = useState('shares');

    useEffect(() => {
      const handleScroll = () => {
        const offset = window.scrollY;
        if (offset > 100) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrolledStyle = {
      position: 'sticky',
      top: 20,
    };

    useEffect(() => {
      const sortMembers = () => {
        const sortedMembers = members.filter(member => {
          const active =
            +member.shares > 0 || (+member.loot > 0 && !member.jailed);
          switch (filter?.value) {
            case 'active': {
              return member.exists && active;
            }
            case 'inactive': {
              return member.exists && !active && !member.jailed;
            }
            case 'jailed': {
              return member.jailed;
            }
            default: {
              return member.exists && active;
            }
          }
        });

        if (sort && filter) {
          sortedMembers.sort((a, b) => {
            if (sort.value === 'joinDateAsc') {
              return +a.createdAt - +b.createdAt;
            }
            if (sort.value === 'joinDateDesc') {
              return +b.createdAt - +a.createdAt;
            }
            return +b[sort.value] - +a[sort.value];
          });
        }
        if (!deepEqual(sortedMembers, listMembers)) {
          setListMembers([...sortedMembers]);
        }
      };
      if (members?.length > 0) {
        sortMembers();
      }
    }, [members, sort, filter]);
    const openProposalSelector = () => {
      setProposalSelector(true);
    };

    const ctaButton = canInteract && (
      <Button
        rightIcon={<RiAddFill />}
        title={getTitle(customTerms, 'Proposal')}
        onClick={openProposalSelector}
      >
        New {getTerm(customTerms, 'proposal')}
      </Button>
    );

    return (
      <MainViewLayout
        header='Members'
        headerEl={ctaButton}
        customTerms={customTerms}
        isDao
      >
        <Flex
          wrap={['wrap', null, null, 'nowrap']}
          justify='space-between'
          align='center'
          w={['100%', null, null, '58%']}
        >
          {!listMembers ? (
            <Spinner />
          ) : (
            <Box
              mr={5}
              textTransform='uppercase'
              fontFamily='heading'
              fontSize={['sm', null, null, 'md']}
              mb={[3, null, null, 0]}
            >
              {listMembers?.length || 0} MEMBERS
            </Box>
          )}
          <Box>
            <ListSort
              sort={sort}
              setSort={setSort}
              options={membersSortOptions}
            />
          </Box>
          <Box>
            <ListFilter
              filter={filter}
              setFilter={setFilter}
              options={membersFilterOptions}
              labelText='Filter By'
            />
          </Box>
          <Box>
            <CsvDownloadButton entityList={listMembers} typename='Members' />
          </Box>
        </Flex>
        <Flex wrap='wrap'>
          <Box
            w={['100%', null, null, null, '60%']}
            pr={[0, null, null, null, 6]}
            pb={6}
          >
            <ContentBox mt={6}>
              <Flex justify='space-between'>
                <TextBox
                  w={['50%', null, null, '43%']}
                  size='xs'
                  title={`${listMembers?.length || 0} ${getTitle(
                    customTerms,
                    'Members',
                  )}`}
                >
                  {getTerm(customTerms, 'member')}
                </TextBox>
                <TextBox
                  w={['25%', null, null, '15%']}
                  size='xs'
                  textAlign='center'
                >
                  Shares
                </TextBox>
                <TextBox
                  w={['20%', null, null, '15%']}
                  size='xs'
                  textAlign='center'
                >
                  Loot
                </TextBox>
                <TextBox size='xs' d={['none', null, null, 'inline-block']}>
                  Join Date
                </TextBox>
              </Flex>
              {listMembers?.map(member => {
                return (
                  <Box key={member.id}>
                    <MemberCard
                      member={member}
                      selectMember={setSelectedMember}
                      selectedMember={selectedMember}
                    />
                  </Box>
                );
              })}
            </ContentBox>
          </Box>
          <Box w={['100%', null, null, null, '40%']}>
            <Stack style={scrolled ? scrolledStyle : null} spacing={4}>
              <Box>
                {selectedMember ? (
                  <MemberInfoWrapper
                    key={selectedMember.memberAddress}
                    member={selectedMember}
                    customTerms={customTerms}
                  />
                ) : (
                  <>
                    <Flex justify='space-between' mb={5}>
                      <TextBox size='xs'>Snapshot</TextBox>
                      <TextBox
                        as={Link}
                        to={`/dao/${daochain}/${daoid}/profile/${daoMember?.memberAddress ||
                          address}`}
                        color='inherit'
                        size='xs'
                      >
                        View Profile
                      </TextBox>
                    </Flex>
                    <MembersChart
                      overview={overview}
                      daoMembers={daoMembers}
                      daoMetaData={daoMetaData}
                    />
                  </>
                )}
              </Box>
              {!isActive('SPAM_FILTER') && (
                <>
                  {selectedMember?.memberAddress ? (
                    <ActivitiesFeed
                      key={selectedMember?.memberAddress}
                      limit={2}
                      activities={activities}
                      hydrateFn={getMemberActivites(
                        selectedMember.memberAddress,
                      )}
                    />
                  ) : (
                    <ActivitiesFeed
                      limit={2}
                      activities={activities}
                      hydrateFn={getMembersActivites}
                    />
                  )}
                </>
              )}
            </Stack>
          </Box>
        </Flex>
      </MainViewLayout>
    );
  },
);

export default Members;
