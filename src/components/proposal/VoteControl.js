import React, { useState, useContext } from 'react';
import StackedVote from './StackedVote';
import styled from 'styled-components';
import {
  primary,
  tertiary,
  getAppLight,
  getAppDark,
} from '../../variables.styles';

import VoteYes from '../../assets/thumbs-up.png';
import VoteNo from '../../assets/thumbs-down.png';

// import './VoteControl.scss';
import MemberVotes from './MemberVotes';
import {
  CurrentUserContext,
  CurrentWalletContext,
  DaoDataContext,
} from '../../contexts/Store';

const VoteControlDiv = styled.div`
  position: fixed;
  bottom: 0;
  height: 105px;
  width: calc(100% - 0px);
  margin-left: -15px;
  border-top: 1px solid ${(props) => getAppDark(props.theme)};
  background-color: ${(props) => getAppLight(props.theme)};
  z-index: 1;
  .Contents {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .Voter {
    width: 100%;
    height: 100%;
    position: relative;
  }
`;

const VoteButton = styled.button`
  width: 60px;
  height: 60px;
  border: 4px solid #000;
  border-radius: 50%;
  padding: 0px;
  margin: 0px;
  background-color: transparent;
  color: black;
  position: absolute;
  img {
    width: 36px;
  }
  &:nth-child(1) {
    bottom: 15px;
    right: 15px;
    img {
      margin-top: 4px;
    }
  }
  &:nth-child(3) {
    bottom: 15px;
    left: 15px;
    img {
      margin-top: 4px;
    }
  }
  &.Yes {
    border-color: ${primary};
    &:hover {
      border-color: ${primary};
      background-color: ${primary};
    }
    &.Voted {
      background-color: ${primary};
    }
  }
  &.No {
    border-color: ${tertiary};
    &:hover {
      border-color: ${tertiary};
      background-color: ${tertiary};
    }
    &.Voted {
      background-color: ${tertiary};
    }
  }
`;

const DrawerDiv = styled.div`
  position: ${(props) => (props.isElementOpen ? 'fixed' : 'absolute')};
  bottom: ${(props) => (props.isElementOpen ? '' : '45px')};
  bottom: ${(props) => (props.isElementOpen ? '0px' : '')};
  left: 0;
  padding: 25px;
  width: calc(100% - 50px);
  min-height: ${(props) =>
    props.isElementOpen ? 'calc(100vh - 50px)' : '20px'};
  height: ${(props) => (props.isElementOpen ? 'auto' : '20px')};
  overflow: ${(props) => (props.isElementOpen ? 'scroll' : 'hidden')};
  background-color: ${(props) =>
    props.isElementOpen ? getAppLight(props.theme) : 'transparent'};
  z-index: 99;
  transition: all 0.15s ease-in-out;
  pointer-events: none;
  a {
    pointer-events: auto;
  }
  h3 {
    margin-top: 50px;
  }
`;

const DrawerToggleButton = styled.button`
  position: absolute;
  left: 50%;
  transform: ${(props) =>
    props.isElementOpen
      ? 'translateX(-50%) rotate(180deg)'
      : 'translateX(-50%)'};
  background-color: transparent;
  color: ${(props) => props.theme.baseFontColor};
  z-index: 99;
  width: calc(100% - 150px);
  top: 15px;
  margin: 0 auto;
  padding: 0px;
  text-align: center;
  transition: all 0.15s linear;
  pointer-events: all !important;
  svg {
    fill: ${(props) => props.theme.baseFontColor};
    width: 36px;
    height: auto;
  }
  &:hover {
    top: ${(props) => (props.isElementOpen ? '18px' : '12px')};
    transition: all 0.15s linear;
  }
`;

const VoteControl = ({ submitVote, proposal }) => {
  const [currentUser] = useContext(CurrentUserContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [daoData] = useContext(DaoDataContext);

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
    // TODO: can we get voting period status on v2
    return +daoData.version === 2
      ? proposal.sponsored
      : proposal.status === 'VotingPeriod';
  };

  const usersVote = (votes) => {
    // get current users vote, no or yes

    return (
      currentUser &&
      currentWallet &&
      currentWallet.addrByDelegateKey &&
      votes.filter((vote) => {
        // return +daoData.version === 2
        //   ? vote.member.memberAddress &&
        //       vote.member.memberAddress.toLowerCase() ===
        //         currentWallet.addrByDelegateKey.toLowerCase()
        //   : vote.memberAddress &&
        //       vote.memberAddress.toLowerCase() ===
        //         currentWallet.addrByDelegateKey.toLowerCase();

        return (
          vote.member.memberAddress &&
          vote.member.memberAddress.toLowerCase() ===
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
    <VoteControlDiv>
      <div className="Contents">
        {canVote(proposal) ? (
          <div className="Voter">
            <VoteButton
              onClick={() => optimisticVote(proposal, 2)}
              className={votedNo(proposal)}
            >
              <img src={VoteNo} alt="Vote No" />
            </VoteButton>
            <StackedVote
              id={
                +daoData.version === 2
                  ? proposal.proposalId
                  : proposal.proposalIndex
              }
              currentYesVote={currentYesVote}
              currentNoVote={currentNoVote}
            />
            <VoteButton
              onClick={() => optimisticVote(proposal, 1)}
              className={votedYes(proposal)}
            >
              <img src={VoteYes} alt="Vote Yes" />
            </VoteButton>
          </div>
        ) : (
          <div className="Voter">
            <VoteButton
              onClick={() => alert('You can not vote at this time')}
              className={votedNo(proposal)}
            >
              <img src={VoteNo} alt="Vote No" />
            </VoteButton>
            <StackedVote
              id={
                +daoData.version === 2
                  ? proposal.proposalId
                  : proposal.proposalIndex
              }
              currentYesVote={currentYesVote}
              currentNoVote={currentNoVote}
            />
            <VoteButton
              onClick={() => alert('You can not vote at this time')}
              className={votedYes(proposal)}
            >
              <img src={VoteYes} alt="Vote Yes" />
            </VoteButton>
          </div>
        )}
      </div>
      <DrawerDiv isElementOpen={isElementOpen}>
        <DrawerToggleButton onClick={toggleElement}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </DrawerToggleButton>
        {isElementOpen ? <MemberVotes votes={proposal.votes} /> : null}
      </DrawerDiv>
    </VoteControlDiv>
  );
};

export default VoteControl;
