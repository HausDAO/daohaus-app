import React from 'react';
import styled from 'styled-components';

import { phone } from '../../variables.styles';
import MemberCard from './MemberCard';

const MemberListDiv = styled.div`
  @media (min-width: ${phone}) {
    display: flex;
    justify-content: space-evenly;
    align-content: flex-start;
    flex-wrap: wrap;
  }
`;

const MemberList = (props) => {
  const renderList = () => {
    return props.members.map((member) => {
      return <MemberCard member={member} key={member.id} />;
    });
  };

  return <MemberListDiv>{renderList()}</MemberListDiv>;
};

export default MemberList;
