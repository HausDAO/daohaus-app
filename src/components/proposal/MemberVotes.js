import React from 'react';
import { truncateAddr } from '../../utils/Helpers';
import VoteYes from '../../assets/star-struck.png';
import VoteNo from '../../assets/thumbs-down.png';
import './MemberVotes.scss';

const MemberVotes = (props) => {
  const renderList = () => {
    return props.votes.map((vote) => {
      return (
        <div className="Item" key={vote.memberAddress}>
          <p className="Data">{truncateAddr(vote.memberAddress)}</p>
          <div className="VoteCount">
            {vote.uintVote === 1 ? (
              <img src={VoteYes} alt="Yes" width="36px" />
            ) : (
              <img width="36px" src={VoteNo} alt="No" />
            )}
            <p>{vote.member.shares} Shares </p>
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      <h3>Votes By Member</h3>
      <div className="MemberVotes">{renderList()}</div>
    </div>
  );
};

export default MemberVotes;
