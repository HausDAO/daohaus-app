import React, { useEffect, useState } from 'react';
import { Flex } from '@chakra-ui/core';

import { useMembers } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';
import { defaultMembers } from '../../utils/constants';
import MemberListCard from './MemberListCard';
import TextBox from '../Shared/TextBox';
import ContentBox from '../Shared/ContentBox';

const MembersList = ({ handleSelect, selectedMember }) => {
  const [theme] = useTheme();
  const filter = useState(null);
  const [members] = useMembers();
  const [_members, setMembers] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (members?.length > 0) {
      setMembers(members);
      setIsLoaded(true);
    } else {
      setMembers(defaultMembers);
    }
  }, [members]);

  return (
    <>
      <Flex>
        {filter ? (
          <TextBox>
            Filtered by:{' '}
            <span style={{ color: theme.colors.primary[50] }}>
              Action Needed
            </span>
          </TextBox>
        ) : (
          <TextBox>
            Apply a{' '}
            <span style={{ color: theme.colors.primary[50] }}> filter</span>
          </TextBox>
        )}
        <TextBox ml={9}>
          Sort by:{' '}
          <span style={{ color: theme.colors.primary[50] }}>
            {' '}
            Voting Period
          </span>
        </TextBox>
      </Flex>
      <ContentBox mt={6} mr={6}>
        <Flex>
          <TextBox w='43%'>{theme.daoMeta.member}</TextBox>
          <TextBox w='15%'>Shares</TextBox>
          <TextBox w='15%'>Loot</TextBox>
          <TextBox>Join Date</TextBox>
        </Flex>
        {_members?.length > 0 &&
          _members.map((member) => {
            return (
              <MemberListCard
                key={member?.id}
                member={member}
                isLoaded={isLoaded}
                handleSelect={handleSelect}
                selectedMember={selectedMember}
              />
            );
          })}
      </ContentBox>
    </>
  );
};

export default MembersList;
