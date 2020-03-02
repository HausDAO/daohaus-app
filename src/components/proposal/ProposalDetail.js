import React, { useEffect, useState, useContext } from 'react';
import ReactPlayer from 'react-player';
import { withApollo } from 'react-apollo';

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

import './ProposalDetail.scss';
import { withRouter } from 'react-router-dom';
import ProposalActions from './ProposalActions';

const web3Service = new Web3Service();

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
  const tribute =
    +daoData.version === 2 ? proposal.tributeOffered : proposal.tokenTribute;
  const id =
    +daoData.version === 2 ? proposal.proposalId : proposal.proposalIndex;

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

  return (
    <div className="ProposalDetail">
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
      {/* {proposal.newMember ? <h5>New Member Proposal</h5> : null} */}
      {proposal.proposalType ? <h5>{proposal.proposalType}</h5> : null}

      <h2>{title}</h2>
      {+daoData.version === 2 ? (
        <>
          <h5 className="Label">Proposer Address</h5>
          <p className="Data">{proposal.proposer}</p>
          <h5 className="Label">Applicant Address</h5>
          <p className="Data">{proposal.applicant}</p>
          {proposal.cancelled && (
            <p style={{ color: 'red' }}>Proposal Cancelled</p>
          )}
          {proposal.sponsored && (
            <>
              <h5 className="Label">Proposal Sponsored By</h5>
              <p className="Data">{proposal.sponsor}</p>
            </>
          )}
        </>
      ) : (
        <>
          <h5 className="Label">Applicant Address</h5>
          <p className="Data">{proposal.applicantAddress}</p>
        </>
      )}

      <div className="Offer">
        <div className="Shares">
          <h5>Shares</h5>
          <h2 className="Data">{proposal.sharesRequested}</h2>
        </div>
        {+daoData.version === 2 ? (
          <>
            <div className="Tribute">
              <h5>Tribute</h5>
              <h2 className="Data">
                {web3Service && (
                  <ValueDisplay
                    value={tribute / 10 ** proposal.tributeTokenDecimals}
                    symbolOverride={proposal.tributeTokenSymbol}
                  />
                )}
              </h2>
            </div>
          </>
        ) : (
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
        )}
      </div>
      {+daoData.version === 2 ? (
        <div className="Offer">
          <div className="Shares">
            <h5>Loot</h5>
            <h2 className="Data">
              <ValueDisplay
                value={
                  proposal.lootRequested / 10 ** proposal.tributeTokenDecimals
                }
                symbolOverride={proposal.tributeTokenSymbol}
              />
            </h2>
          </div>
        </div>
      ) : null}

      <p>{proposal.description}</p>
      {proposal.status === 'ReadyForProcessing' && currentUser && (
        <button onClick={() => processProposal(proposal.proposalIndex)}>
          Process
        </button>
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
    </div>
  );
};

export default withRouter(withApollo(ProposalDetail));
