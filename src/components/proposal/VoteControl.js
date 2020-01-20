import React, { useState, useContext } from 'react';
import StackedVote from './StackedVote';

import VoteYes from '../../assets/star-struck.png';
import VoteNo from '../../assets/thumbs-down.png';

import './VoteControl.scss';
import MemberVotes from './MemberVotes';
import { CurrentUserContext, CurrentWalletContext } from '../../contexts/Store';

const VoteControl = ({ submitVote, proposal }) => {
  const [currentUser] = useContext(CurrentUserContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [isElementOpen, setElementOpen] = useState(false);
  const toggleElement = () => setElementOpen(!isElementOpen);
  const [currentYesVote, setCurrentYesVote] = useState(0);
  const [currentNoVote, setCurrentNoVote] = useState(0);

  const canVote = (proposal) => {
    // check if user has votes
    // does not seem to work
    if (currentYesVote || currentNoVote) {
      return false;
    }
    if (!currentUser) {
      return false;
    }
    const hasVoted = usersVote(proposal.votes);
    if (hasVoted && hasVoted.length) {
      return false;
    }
    return proposal.status === 'VotingPeriod';
  };

  const usersVote = (votes) => {
    // get current users vote, no or yes

    return (
      currentUser &&
      currentWallet &&
      currentWallet.addrByDelegateKey &&
      votes.filter((vote) => {
        return (
          vote.memberAddress &&
          vote.memberAddress.toLowerCase() ===
            currentWallet.addrByDelegateKey.toLowerCase()
        );
      })
    );
  };

  const votedYes = (proposal) => {
    // used for className

    return (currentUser &&
      usersVote(proposal.votes) &&
      usersVote(proposal.votes)[0] &&
      usersVote(proposal.votes)[0].uintVote === 1) ||
      currentYesVote
      ? 'Vote Yes Voted'
      : 'Vote Yes';
  };

  const votedNo = (proposal) => {
    // used for className

    return (currentUser &&
      usersVote(proposal.votes) &&
      usersVote(proposal.votes)[0] &&
      usersVote(proposal.votes)[0].uintVote !== 1) ||
      currentNoVote
      ? 'Vote No Voted'
      : 'Vote No';
  };

  const optimisticVote = (proposal, vote) => {
    // set vote imediatly to give user feedback
    // a yes vote is uint 1

    if (vote !== 1) {
      setCurrentNoVote(currentWallet.shares);
    } else {
      setCurrentYesVote(currentWallet.shares);
    }

    submitVote(proposal, vote);
  };

  return (
    <div className="VoteControl">
      <div className="Contents">
        {canVote(proposal) ? (
          <div className="Voter">
            <button
              onClick={() => optimisticVote(proposal, 2)}
              className={votedNo(proposal)}
            >
              <img src={VoteNo} alt="Vote No" />
            </button>
            <div className="StackedVote">
              <StackedVote
                id={proposal.proposalIndex}
                currentYesVote={currentYesVote}
                currentNoVote={currentNoVote}
              />
            </div>
            <button
              onClick={() => optimisticVote(proposal, 1)}
              className={votedYes(proposal)}
            >
              <img src={VoteYes} alt="Vote Yes" />
            </button>
          </div>
        ) : (
          <div className="Voter">
            <button
              onClick={() => alert('You can not vote at this time')}
              className={votedNo(proposal)}
            >
              <img src={VoteNo} alt="Vote No" />
            </button>
            <div className="StackedVote">
              <StackedVote
                id={proposal.proposalIndex}
                currentYesVote={currentYesVote}
                currentNoVote={currentNoVote}
              />
            </div>
            <button
              onClick={() => alert('You can not vote at this time')}
              className={votedYes(proposal)}
            >
              <img src={VoteYes} alt="Vote Yes" />
            </button>
          </div>
        )}
      </div>
      <div className={isElementOpen ? 'Drawer Open' : 'Drawer'}>
        <button className="DrawerToggle" onClick={toggleElement}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </button>
        {isElementOpen ? <MemberVotes votes={proposal.votes} /> : null}
      </div>
    </div>
  );
};

export default VoteControl;
