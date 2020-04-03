import React, { useEffect, useState, useContext } from 'react';
import ReactPlayer from 'react-player';
import { withApollo } from 'react-apollo';
import styled from 'styled-components';
import { basePadding } from '../../variables.styles';

import {
  getProposalCountdownText,
  titleMaker,
  descriptionMaker,
  linkMaker,
} from '../../utils/ProposalHelper';
import {
  CurrentUserContext,
  DaoServiceContext,
  DaoDataContext,
} from '../../contexts/Store';
import { GET_METADATA } from '../../utils/Queries';
import { get } from '../../utils/Requests';
import Web3Service from '../../utils/Web3Service';
import VoteControl from './VoteControl';
import ValueDisplay from '../shared/ValueDisplay';

// import './ProposalDetail.scss';
import { withRouter } from 'react-router-dom';
import ProposalActions from './ProposalActions';
import ProposalV2Guts from './ProposalV2Guts';

const web3Service = new Web3Service();

const ProposalDetailDiv = styled.div`
  padding: ${basePadding};
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

const ProposalDetail = ({
  proposal,
  processProposal,
  submitVote,
  canVote,
  client,
}) => {
  const [detailData, setDetailData] = useState();
  const [currentUser] = useContext(CurrentUserContext);
  const [daoService] = useContext(DaoServiceContext);
  const [daoData] = useContext(DaoDataContext);

  const { periodDuration } =
    +daoData.version === 2
      ? { periodDuration: proposal.moloch.periodDuration }
      : client.cache.readQuery({
          query: GET_METADATA,
        });

  const id =
    +daoData.version === 2 ? proposal.proposalId : proposal.proposalIndex;
  const tribute =
    +daoData.version === 2 ? proposal.tributeOffered : proposal.tokenTribute;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metaData = await get(
          `moloch/proposal/${daoService.daoAddress.toLowerCase()}-${id}`,
        );

        setDetailData(metaData.data);
      } catch (err) {
        console.log(err);

        setDetailData({
          description: descriptionMaker(proposal),
          link: linkMaker(proposal),
        });
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const countDown = getProposalCountdownText(proposal, periodDuration);
  const title = titleMaker(proposal);
  const memberUrlV1 = `/dao/${daoData.contractAddress}/member/${daoData.contractAddress}-${proposal.memberAddress}`;

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
          <p className="Data">{proposal.applicantAddress}</p>
          <h5 className="Label">Proposor Address</h5>
          <p className="Data">
            <a href={memberUrlV1}>{proposal.memberAddress}</a>
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
                    value={web3Service.fromWei(tribute)}
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
        {detailData && detailData.description ? (
          <div>
            <h5>Description</h5>
            {detailData.description.indexOf('http') > -1 ? (
              <a
                href={detailData.description}
                rel="noopener noreferrer"
                target="_blank"
              >
                {detailData.description}
              </a>
            ) : (
              <p>{detailData.description}</p>
            )}
          </div>
        ) : null}
        {detailData &&
        detailData.link &&
        ReactPlayer.canPlay(detailData.link) ? (
          <div className="Video">
            <ReactPlayer url={detailData.link} playing={false} loop={false} />
          </div>
        ) : detailData &&
          detailData.link &&
          detailData.link.indexOf('http') > -1 ? (
          <div className="Link">
            <a href={detailData.link} rel="noopener noreferrer" target="_blank">
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

export default withRouter(withApollo(ProposalDetail));
