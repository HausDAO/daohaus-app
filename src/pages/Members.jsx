import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Flex, Box, Stack, Button } from '@chakra-ui/react';
import deepEqual from 'deep-eql';

import ActivitiesFeed from '../components/activitiesFeed';
import MemberCard from '../components/memberCard';
import MemberInfoWrapper from '../components/memberInfoWrapper';
import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
import { getMemberActivites, getMembersActivites } from '../utils/activities';
import { getTerm, getTitle } from '../utils/metadata';
import MembersChart from '../components/membersChart';
import ListSort from '../components/listSort';
import {
  membersFilterOptions,
  membersSortOptions,
} from '../utils/memberContent';
import MainViewLayout from '../components/mainViewLayout';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { daoConnectedAndSameChain } from '../utils/general';
import UberHausMemberCard from '../components/uberHausMemberCard';
import CsvDownloadButton from '../components/csvDownloadButton';
import ListFilter from '../components/listFilter';

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
    const { daoid, daochain } = useParams();
    const { address, injectedChain } = useInjectedProvider();

    const [selectedMember, setSelectedMember] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [listMembers, setListMembers] = useState(null);
    const [sort, setSort] = useState('shares');
    const [filter, setFilter] = useState('active');

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

    const ctaButton = daoConnectedAndSameChain(
      address,
      injectedChain?.chainId,
      daochain,
    ) && (
      <Button as={Link} to={`/dao/${daochain}/${daoid}/proposals/new/member`}>
        Apply
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
          <Box
            mr={5}
            textTransform='uppercase'
            fontFamily='heading'
            fontSize={['sm', null, null, 'md']}
            mb={[3, null, null, 0]}
          >
            {listMembers?.length || 0} MEMBERS
          </Box>
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
                    {member.uberMinion ? (
                      <UberHausMemberCard
                        member={member}
                        selectMember={setSelectedMember}
                        selectedMember={selectedMember}
                      />
                    ) : (
                      <MemberCard
                        member={member}
                        selectMember={setSelectedMember}
                        selectedMember={selectedMember}
                      />
                    )}
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
                        {`View 
                      ${!daoMember ||
                        (daoMember.memberAddress === address && 'My')}
                      Profile`}
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

              {selectedMember?.memberAddress ? (
                <ActivitiesFeed
                  key={selectedMember?.memberAddress}
                  limit={2}
                  activities={activities}
                  hydrateFn={getMemberActivites(selectedMember.memberAddress)}
                />
              ) : daoMember ? (
                <ActivitiesFeed
                  limit={2}
                  activities={activities}
                  hydrateFn={getMembersActivites}
                />
              ) : null}
            </Stack>
          </Box>
        </Flex>
      </MainViewLayout>
    );
  },
);

export default Members;
