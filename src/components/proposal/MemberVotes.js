import React, { useContext } from 'react';
import { truncateAddr } from '../../utils/Helpers';
import VoteYes from '../../assets/star-struck.png';
import VoteNo from '../../assets/thumbs-down.png';
import './MemberVotes.scss';
import { DaoDataContext } from '../../contexts/Store';

const MemberVotes = (props) => {
  const [daoData] = useContext(DaoDataContext);
  console.log(props.votes);
  console.log(daoData);

  const renderList = () => {
    return props.votes.map((vote) => {
      const memberAddress = (+daoData.version === 2) ? vote.member.memberAddress : vote.memberAddress;

      const memberUrl = (+daoData.version === 2) ? `/dao/${daoData.contractAddress}/member/${daoData.contractAddress}-member-${memberAddress}` : `/dao/${daoData.contractAddress}/member/${daoData.contractAddress}-${vote.memberAddress}`;

      return (
        <div className="Item" key={memberAddress}>
          <a href={memberUrl} ><p className="Data">{truncateAddr(memberAddress)}</p></a>
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
    <div>
      <h3>Votes By Member</h3>
      <div className="MemberVotes">{renderList()}</div>
    </div>
  );
};

export default MemberVotes;
