import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Flex, Box } from '@chakra-ui/react';

import ActivitiesFeed from '../components/activitiesFeed';
import Chart from '../components/chart';
import MemberCard from '../components/memberCard';
import MemberInfo from '../components/memberInfo';
import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
import { useDaoMember } from '../contexts/DaoMemberContext';
import { useMetaData } from '../contexts/MetaDataContext';
import { getMemberActivites, getMembersActivites } from '../utils/activities';
import { getCopy } from '../utils/metadata';

const Members = ({ members, activities }) => {
  const { daoMember } = useDaoMember();
  const { daoid, daochain } = useParams();
  const [selectedMember, setSelectedMember] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { daoMetaData } = useMetaData();

  const selectMember = (member) => {
    if (selectedMember == null) {
      setSelectedMember(member);
    } else {
      if (selectedMember.memberAddress === member.memberAddress) {
        setSelectedMember(null);
      } else {
        setSelectedMember(member);
      }
    }
  };

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

  return (
    <Flex wrap='wrap'>
      <Box
        w={['100%', null, null, null, '60%']}
        pr={[0, null, null, null, 6]}
        pb={6}
      >
        <ContentBox mt={6}>
          <Flex>
            <TextBox w='43%' size='xs'>
              {getCopy(daoMetaData, 'member')}
            </TextBox>
            <TextBox w='15%' size='xs'>
              Shares
            </TextBox>
            <TextBox w='15%' size='xs'>
              Loot
            </TextBox>
            <TextBox size='xs'>Join Date</TextBox>
          </Flex>
          {members &&
            members?.map((member) => {
              return (
                <MemberCard
                  key={member.id}
                  member={member}
                  selectMember={selectMember}
                  selectedMember={selectedMember}
                />
              );
            })}
        </ContentBox>
      </Box>
      <Box w={['100%', null, null, null, '40%']}>
        <Box style={scrolled ? scrolledStyle : null}>
          {selectedMember ? (
            <MemberInfo member={selectedMember} />
          ) : (
            <>
              {daoMember && (
                <Link
                  to={`/dao/${daochain}/${daoid}/profile/${daoMember.memberAddress}`}
                >
                  View My Profile
                </Link>
              )}
              <Chart />
            </>
          )}
          {selectedMember ? (
            <ActivitiesFeed
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
        </Box>
      </Box>
    </Flex>
  );
};

export default Members;
