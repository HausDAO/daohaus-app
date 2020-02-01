import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { withApollo } from 'react-apollo';
import Web3 from 'web3';
import styled from 'styled-components';

import {
  getProposalCountdownText,
  titleMaker,
} from '../../utils/ProposalHelper';
import { GET_METADATA } from '../../utils/Queries';
import { DaoServiceContext } from '../../contexts/Store';
import ValueDisplay from '../shared/ValueDisplay';
import { appDark, appLight } from '../../variables.styles';
import {
  DataP,
  DataH2,
  ProposalAndMemberCardDiv,
  OfferDiv,
} from '../../App.styles';

import StackedVote from './StackedVote';
import './ProposalCard.scss';

const ProposalCardDiv = styled(ProposalAndMemberCardDiv)`
  background-color: ${appLight};
  width: 320px;
  border: 2px solid ${appDark};
  border-radius: 10px;
  margin-bottom: 25px;
  margin-top: 25px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const TimerDiv = styled.div`
  display: flex;
  align-content: center;
  svg {
    margin: 0;
    margin-top: -4px;
    margin-right: 5px;
    fill: $base-font-color;
  }
  p {
    margin: 0;
  }
`;

const CardVoteDiv = styled.div`
  margin: 25px auto;
`;

const ProposalCard = ({ proposal, client }) => {
  const { periodDuration } = client.cache.readQuery({
    query: GET_METADATA,
  });

  const [daoService] = useContext(DaoServiceContext);
  const countDown = getProposalCountdownText(proposal, periodDuration);
  const title = titleMaker(proposal);

  return (
    <ProposalCardDiv>
      <TimerDiv>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
        </svg>
        <DataP>{countDown}</DataP>
      </TimerDiv>
      <h3>{title}</h3>
      <OfferDiv>
        <div>
          <h5>Shares</h5>
          <DataH2>{proposal.sharesRequested}</DataH2>
        </div>
        <div>
          <h5>Tribute</h5>
          <DataH2>
            <ValueDisplay value={Web3.utils.fromWei(proposal.tokenTribute)} />
          </DataH2>
        </div>
      </OfferDiv>
      <CardVoteDiv>
        <StackedVote id={proposal.proposalIndex} page="ProposalCard" />
      </CardVoteDiv>
      <Link
        className="Button"
        to={{
          pathname: `/dao/${daoService.daoAddress}/proposal/${proposal.proposalIndex}`,
        }}
      >
        View Proposal
      </Link>
    </ProposalCardDiv>
  );
};

export default withApollo(ProposalCard);
