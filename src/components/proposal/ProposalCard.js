import React, { useContext } from 'react';
import { withApollo } from 'react-apollo';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
import styled from 'styled-components';

import {
  getProposalCountdownText,
  titleMaker,
} from '../../utils/ProposalHelper';

import { DaoServiceContext, DaoDataContext } from '../../contexts/Store';
import ValueDisplay from '../shared/ValueDisplay';

import { getAppDark, getAppLight, phone } from '../../variables.styles';
import { DataP, DataH2, OfferDiv } from '../../App.styles';

import StackedVote from './StackedVote';

const ProposalCardDiv = styled.div`
  position: relative;
  margin-top: 25px;
  border-top: 2px solid ${(props) => getAppDark(props.theme)};
  border-bottom: 2px solid ${(props) => getAppDark(props.theme)};
  background-color: ${(props) => getAppLight(props.theme)};
  padding: 25px;
  transition: all 0.15s linear;
  &:hover {
    background-color: ${(props) => props.theme.primary};
    color: white;
    @media (min-width: ${phone}) {
      scale: 1.05;
    }
  }
  a {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  @media (min-width: ${phone}) {
    width: 320px;
    border: 2px solid ${(props) => getAppDark(props.theme)};
    border-radius: 10px;
    margin-bottom: 25px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
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

const CardVoteDiv = styled.div`
  margin: 25px auto;
`;

const OfferDivProposalCard = styled(OfferDiv)`
  padding-bottom: 25px;
`;

const ProcessNextSpan = styled.div`
  color: red;
  font-size: 12px;
  margin-left: 20px;
`;

const ProposalCard = ({ proposal, index }) => {
  const [daoService] = useContext(DaoServiceContext);
  const [daoData] = useContext(DaoDataContext);

  const countDown = getProposalCountdownText(
    proposal,
    proposal.moloch.periodDuration,
  );

  const title = titleMaker(proposal);

  const id =
    +daoData.version === 2 ? proposal.proposalId : proposal.proposalIndex;

  return (
    <ProposalCardDiv>
      <Link
        to={{
          pathname: `/dao/${daoService.daoAddress}/proposal/${id}`,
        }}
      ></Link>
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
        {proposal.status === 'ReadyForProcessing' && index === 0 ? (
          <ProcessNextSpan>Process Me Next</ProcessNextSpan>
        ) : null}
      </TimerDiv>
      {proposal.proposalType ? <h5>{proposal.proposalType} </h5> : null}
      <h3
        style={{
          wordBreak: 'break-word',
          maxHeight: '67px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {title}
      </h3>
      {!proposal.guildkick && !proposal.whitelist ? (
        <OfferDivProposalCard>
          {proposal.trade ? (
            <div>
              <h5>Requesting</h5>

              <DataH2>
                <ValueDisplay
                  value={
                    proposal.paymentRequested /
                    10 ** (proposal.paymentTokenDecimals || 18)
                  }
                  symbolOverride={proposal.paymentTokenSymbol}
                />
              </DataH2>
            </div>
          ) : (
            <>
              <div>
                <h5>Shares</h5>
                <DataH2>{proposal.sharesRequested}</DataH2>
              </div>
              <div>
                <h5>Loot</h5>
                <DataH2>{proposal.lootRequested}</DataH2>
              </div>
            </>
          )}

          {+daoData.version === 2 ? (
            <div>
              <h5>{proposal.trade ? 'Giving' : 'Tribute'}</h5>
              <DataH2>
                <ValueDisplay
                  value={
                    proposal.tributeOffered /
                    10 ** proposal.tributeTokenDecimals
                  }
                  symbolOverride={proposal.tributeTokenSymbol}
                />
              </DataH2>
            </div>
          ) : (
            <div>
              <h5>Tribute</h5>
              <DataH2>
                <ValueDisplay
                  value={Web3.utils.fromWei(proposal.tributeOffered)}
                  symbolOverride={proposal.tributeTokenSymbol}
                />
              </DataH2>
            </div>
          )}
        </OfferDivProposalCard>
      ) : null}
      {proposal.proposalType === 'Funding Proposal' ? (
        <OfferDivProposalCard>
          {proposal.paymentRequested > 0 ? (
            <div className="Shares">
              <h5>Funds Requested</h5>
              <DataH2>
                <ValueDisplay
                  value={
                    proposal.paymentRequested /
                    10 ** (proposal.paymentTokenDecimals || 18)
                  }
                  symbolOverride={proposal.paymentTokenSymbol}
                />
              </DataH2>
            </div>
          ) : null}
          {proposal.lootRequested > 0 ? (
            <div className="Shares">
              <h5>Loot Requested</h5>
              <DataH2>{proposal.lootRequested} LOOT</DataH2>
            </div>
          ) : null}
        </OfferDivProposalCard>
      ) : null}

      {proposal.whitelist ? (
        <>
          <h5>Token Symbol</h5>
          <p className="Data">{proposal.tributeTokenSymbol}</p>
        </>
      ) : null}

      <CardVoteDiv>
        {daoData.version !== 2 ? (
          <StackedVote id={id} page="ProposalCard" />
        ) : null}
        {daoData.version === 2 && proposal.sponsored ? (
          <StackedVote id={id} page="ProposalCard" />
        ) : null}
      </CardVoteDiv>
    </ProposalCardDiv>
  );
};

export default withApollo(ProposalCard);
