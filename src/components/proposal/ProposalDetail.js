import React, { useContext } from 'react';
import ReactPlayer from 'react-player';
import styled from 'styled-components';

import {
  getProposalCountdownText,
  titleMaker,
  descriptionMaker,
  linkMaker,
} from '../../utils/ProposalHelper';
import { CurrentUserContext, DaoDataContext } from '../../contexts/Store';
import Web3Service from '../../utils/Web3Service';
import VoteControl from './VoteControl';
import ValueDisplay from '../shared/ValueDisplay';
import { withRouter } from 'react-router-dom';
import ProposalActions from './ProposalActions';
import ProposalV2Guts from './ProposalV2Guts';

import { basePadding } from '../../variables.styles';

const web3Service = new Web3Service();

const ProposalDetailDiv = styled.div`
  padding: ${basePadding};
  padding-bottom: 120px;
`;

const TimerDiv = styled.div`
  display: flex;
  align-content: center;
  svg {
    margin: 0;
    margin-top: -4px;
    margin-right: 5px;
    fill: ${(props) => props.theme.baseFontColor};
  }
  p {
    margin: 0;
  }
`;

const ProposalDetail = ({ proposal, processProposal, submitVote, canVote }) => {
  const [currentUser] = useContext(CurrentUserContext);
  const [daoData] = useContext(DaoDataContext);

  const countDown = getProposalCountdownText(
    proposal,
    proposal.moloch.periodDuration,
  );
  const title = titleMaker(proposal);
  const description = descriptionMaker(proposal);
  const link = linkMaker(proposal);

  const memberUrlV1 = (addr) => {
    return `/dao/${daoData.contractAddress}/member/${daoData.contractAddress}-member-${addr}`;
  };
  return (
    <ProposalDetailDiv>
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
        <p className="Data">{countDown}</p>
      </TimerDiv>
      {proposal.proposalType ? <h5>{proposal.proposalType}</h5> : null}

      <h2>{title}</h2>
      {+daoData.version === 2 ? (
        <ProposalV2Guts proposal={proposal} daoData={daoData} />
      ) : (
        <>
          <h5 className="Label">Applicant Address</h5>
          <p className="Data">{proposal.applicant}</p>
          <h5 className="Label">Proposor Address</h5>
          <p className="Data">
            <a href={memberUrlV1(proposal.proposer)}>{proposal.proposer}</a>
          </p>

          <div className="Offer">
            <div className="Shares">
              <h5>Shares</h5>
              <h2 className="Data">{proposal.sharesRequested}</h2>
            </div>
            <div className="Tribute">
              <h5>Tribute</h5>
              <h2 className="Data">
                {web3Service && (
                  <ValueDisplay
                    value={web3Service.fromWei(proposal.tributeOffered)}
                    symbolOverride={proposal.tributeTokenSymbol}
                  />
                )}
              </h2>
            </div>
          </div>
        </>
      )}

      <p>{proposal.description}</p>

      {proposal.status === 'ReadyForProcessing' && currentUser && (
        <button onClick={() => processProposal(proposal)}>Process</button>
      )}

      <div>
        {description ? (
          <div>
            <h5>Description</h5>
            {description.indexOf('http') > -1 ? (
              <a href={description} rel="noopener noreferrer" target="_blank">
                {description}
              </a>
            ) : (
              <p>{description}</p>
            )}
          </div>
        ) : null}
        {link && ReactPlayer.canPlay(link) ? (
          <div className="Video">
            <ReactPlayer url={link} playing={false} loop={false} />
          </div>
        ) : link && link.indexOf('http') > -1 ? (
          <div className="Link">
            <a href={link} rel="noopener noreferrer" target="_blank">
              Link
            </a>
          </div>
        ) : null}
      </div>
      {+daoData.version !== 2 || proposal.sponsored ? (
        <VoteControl
          submitVote={submitVote}
          proposal={proposal}
          canVote={canVote}
        />
      ) : (
        <>
          {+daoData.version === 2 && currentUser ? (
            <ProposalActions proposal={proposal} />
          ) : null}
        </>
      )}
    </ProposalDetailDiv>
  );
};

export default withRouter(ProposalDetail);
