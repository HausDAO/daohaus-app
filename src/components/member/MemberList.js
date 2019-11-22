import React from 'react';
import MemberCard from './MemberCard';
import './MemberList.scss';

const MemberList = (props) => {
  const renderList = () => {
    return props.members.map((member) => {
      return <MemberCard member={member} key={member.id} />;
    });
  };

  return <div className="MemberList">{renderList()}</div>;
};

export default MemberList;
