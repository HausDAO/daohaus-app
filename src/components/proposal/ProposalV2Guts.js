import React from 'react';

import ValueDisplay from '../shared/ValueDisplay';
import ProposalKickedMember from './ProposalKickedMember';
import config from '../../config';

const ProposalGutsV2 = ({ proposal }) => {
  console.log('proposal', proposal);
  return (
    <div className="ProposalGuts">
      {proposal.cancelled && <p style={{ color: 'red' }}>Proposal Cancelled</p>}

      {proposal.sponsored ? (
        <>
          <h5 className="Label">Sponsored By</h5>
          <p className="Data">{proposal.sponsor}</p>
        </>
      ) : null}

      {proposal.newMember || proposal.proposalType === 'Funding Proposal' ? (
        <>
          {proposal.proposalType === 'Funding Proposal' ? (
            <>
              <h5 className="Label">Proposed by</h5>
              <p className="Data">{proposal.memberAddress}</p>
              <h5 className="Label">Funding for</h5>
              <p className="Data">{proposal.applicant}</p>
            </>
          ) : (
            <>
              <h5 className="Label">Applicant</h5>
              <p className="Data">{proposal.applicant}</p>
            </>
          )}

          {proposal.newMember || +proposal.tributeOffered > 0 ? (
            <div className="Tribute">
              <h5>Tribute</h5>
              <h2 className="Data">
                <ValueDisplay
                  value={
                    proposal.tributeOffered /
                    10 ** proposal.tributeTokenDecimals
                  }
                  symbolOverride={proposal.tributeTokenSymbol}
                />
              </h2>
            </div>
          ) : null}

          <div className="Offer">
            <div className="Shares">
              <h5>Shares</h5>
              <h2 className="Data">{proposal.sharesRequested}</h2>
            </div>
            <div className="Shares">
              <h5>Loot</h5>
              <h2 className="Data">{proposal.lootRequested}</h2>
            </div>
          </div>
        </>
      ) : null}

      {proposal.whitelist ? (
        <>
          <h5 className="Label">Proposed by</h5>
          <p className="Data">{proposal.memberAddress}</p>
          <h5 className="Label">Token Symbol</h5>
          <p className="Data">{proposal.tributeTokenSymbol}</p>
          <h5 className="Label">Token Contract</h5>
          <p className="Data">{proposal.tributeToken}</p>

          <p className="Data">
            <a
              href={
                config.SDK_ENV === 'Kovan'
                  ? 'https://kovan.etherscan.io/address/' +
                    proposal.tributeToken
                  : 'https://etherscan.io/address/' + proposal.tributeToken
              }
              target="_blank"
              rel="noreferrer noopener"
            >
              View Token on Etherscan
            </a>
          </p>
        </>
      ) : null}

      {proposal.guildkick ? (
        <>
          <h5 className="Label">Member to kick</h5>
          <p className="Data">{proposal.applicant}</p>

          <h5 className="Label">Proposed by</h5>
          <p className="Data">{proposal.memberAddress}</p>
          <ProposalKickedMember proposal={proposal} />
        </>
      ) : null}

      {proposal.trade ? (
        <>
          <h5 className="Label">Applicant</h5>
          <p className="Data">{proposal.applicant}</p>

          <h5 className="Label">Proposed by</h5>
          <p className="Data">{proposal.memberAddress}</p>

          <div className="Offer">
            <div className="Shares">
              <h5>Giving</h5>
              <h2 className="Data">
                <ValueDisplay
                  value={
                    proposal.tributeOffered /
                    10 ** proposal.tributeTokenDecimals
                  }
                  symbolOverride={proposal.tributeTokenSymbol}
                />
              </h2>
            </div>
          </div>

          <div className="Offer">
            <div className="Shares">
              <h5>Requesting</h5>
              <h2 className="Data">
                <ValueDisplay
                  value={
                    proposal.paymentRequested /
                    10 ** proposal.paymentTokenDecimals
                  }
                  symbolOverride={proposal.paymentTokenSymbol}
                />
              </h2>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ProposalGutsV2;
