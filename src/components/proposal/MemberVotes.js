import React, { useContext } from 'react';
import { truncateAddr } from '../../utils/Helpers';
import VoteYes from '../../assets/star-struck.png';
import VoteNo from '../../assets/thumbs-down.png';
import { DaoDataContext } from '../../contexts/Store';

import styled from 'styled-components';
import { getAppDark } from '../../variables.styles';

const MemberVotesDiv = styled.div`
  padding-bottom: 50px;
  .Item {
    padding: 15px 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid ${(props) => getAppDark(props.theme)};
    .VoteCount {
      width: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      text-align: center;
      img {
        margin: 0 auto;
      }
      p {
        margin: 0 auto;
        margin-top: 5px;
        font-size: 0.85em;
        color: #ccc;
        text-align: center;
      }
    }
  }
`;

const MemberVotes = (props) => {
  const [daoData] = useContext(DaoDataContext);

  const renderList = () => {
    return props.votes.map((vote) => {
      const memberUrl = `/dao/${daoData.contractAddress}/member/${daoData.contractAddress}-member-${vote.member.memberAddress}`;

      return (
        <div className="Item" key={vote.member.memberAddress}>
          <a href={memberUrl}>
            <p className="Data">{truncateAddr(vote.member.memberAddress)}</p>
          </a>
          <div className="VoteCount">
            {vote.uintVote === 1 ? (
              <img src={VoteYes} alt="Yes" width="36px" />
            ) : (
              <img width="36px" src={VoteNo} alt="No" />
            )}
            {/* <p>{vote.member.shares} Shares </p> */}
          </div>
        </div>
      );
    });
  };

  return (
    <>
      <h3>Votes By Member</h3>
      <MemberVotesDiv>{renderList()}</MemberVotesDiv>
    </>
  );
};

export default MemberVotes;
