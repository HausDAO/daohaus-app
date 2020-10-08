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
import { DataP, LabelH5, DataH2 } from '../../App.styles';
import AddressProfileDisplay from '../shared/AddressProfileDisplay';

const web3Service = new Web3Service();

const ProposalDetailDiv = styled.div`
  padding: ${basePadding};
  padding-bottom: 120px;
  margin: 25px auto 0px;
  max-width: 420px;
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

const VideoDiv = styled.div`
  max-width: 100%;
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const urlify = (text) => {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function(url) {
    return (
      '<a rel="noopener noreferrer" target="_blank" href="' +
      url +
      '"> link </a>'
    );
  });
};

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
        <DataP>{countDown}</DataP>
      </TimerDiv>
      {proposal.proposalType ? <h5>{proposal.proposalType}</h5> : null}

      <h2>{title}</h2>

      {proposal.description ? <p>{proposal.description}</p> : null}

      {description ? (
        <div>
          <LabelH5>Description</LabelH5>
          {description.indexOf('http') > -1 ? (
            <p dangerouslySetInnerHTML={{ __html: urlify(description) }} />
          ) : (
            <p>{description}</p>
          )}
        </div>
      ) : null}
      {link && ReactPlayer.canPlay(link) ? (
        <VideoDiv>
          <ReactPlayer url={link} playing={false} loop={false} />
        </VideoDiv>
      ) : link && link.indexOf('http') > -1 ? (
        <div className="Link" style={{ marginBottom: '25px' }}>
          <a href={link} rel="noopener noreferrer" target="_blank">
            Link
          </a>
        </div>
      ) : null}

      {+daoData.version === 2 ? (
        <ProposalV2Guts proposal={proposal} daoData={daoData} />
      ) : (
        <>
          <LabelH5>Applicant</LabelH5>
          <AddressProfileDisplay address={proposal.applicant} />
          <LabelH5>Proposed by</LabelH5>
          <AddressProfileDisplay address={proposal.memberAddress} />

          <div className="Offer">
            <div className="Shares">
              <LabelH5>Shares</LabelH5>
              <DataH2>{proposal.sharesRequested}</DataH2>
            </div>
            <div className="Tribute">
              <LabelH5>Tribute</LabelH5>
              <DataH2>
                {web3Service && (
                  <ValueDisplay
                    value={web3Service.fromWei(proposal.tributeOffered)}
                    symbolOverride={proposal.tributeTokenSymbol}
                  />
                )}
              </DataH2>
            </div>
          </div>
        </>
      )}

      {proposal.status === 'ReadyForProcessing' && currentUser && (
        <button onClick={() => processProposal(proposal)}>Process</button>
      )}

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
