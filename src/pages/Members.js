import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Flex, Box } from '@chakra-ui/react';
import ActivitiesFeed from '../components/activitiesFeed';
import Chart from '../components/chart';
import MemberCard from '../components/memberCard';
import MemberInfo from '../components/memberInfo';
import { useDaoMember } from '../contexts/DaoMemberContext';
import { getMemberActivites, getMembersActivites } from '../utils/activities';

const Members = ({ members, activities }) => {
  const { daoMember } = useDaoMember();
  const { daoid, daochain } = useParams();
  const [selectedMember, setSelectedMember] = useState(null);
  const [scrolled, setScrolled] = useState(false);

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

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 100) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
  });

  const scrolledStyle = {
    position: 'sticky',
    top: 20,
  };

  return (
    <Flex p={6} wrap='wrap'>
      <Box
        w={['100%', null, null, null, '60%']}
        pr={[0, null, null, null, 6]}
        pb={6}
      >
        <h3>Members</h3>
        {members &&
          members?.slice(0, 10).map((member) => {
            return (
              <MemberCard
                key={member.id}
                member={member}
                selectMember={selectMember}
              />
            );
          })}
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
