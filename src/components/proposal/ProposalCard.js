import React from 'react';
import { Link } from 'react-router-dom';
import { withApollo } from 'react-apollo';

import {
  getProposalCountdownText,
  titleMaker,
} from '../../utils/ProposalHelper';
import { GET_METADATA } from '../../utils/Queries';
import Web3Service from '../../utils/Web3Service';
import StackedVote from './StackedVote';
import ValueDisplay from '../shared/ValueDisplay';

import './ProposalCard.scss';

const web3Service = new Web3Service();

const ProposalCard = ({ proposal, client }) => {
  const { periodDuration } = client.cache.readQuery({
    query: GET_METADATA,
  });
  const countDown = getProposalCountdownText(proposal, periodDuration);
  const title = titleMaker(proposal);

  return (
    <div className="ProposalCard">
      <div className="Timer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
        </svg>
        <p className="Data">{countDown}</p>
      </div>
      <h3>{title}</h3>
      <div className="Offer">
        <div className="Shares">
          <h5>Shares</h5>
          <h2 className="Data">{proposal.sharesRequested}</h2>
        </div>
        <div className="Tribute">
          <h5>Tribute</h5>
          <h2 className="Data">
            <ValueDisplay value={web3Service.fromWei(proposal.tokenTribute)} />
          </h2>
        </div>
      </div>
      <div className="CardVote">
        <StackedVote id={proposal.id} />
      </div>
      <Link className="Button" to={{ pathname: '/proposal/' + proposal.id }}>
        View Proposal
      </Link>
    </div>
  );
};

export default withApollo(ProposalCard);
