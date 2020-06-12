import React, { useState, useEffect } from 'react';

import ValueDisplay from '../shared/ValueDisplay';
import ProposalKickedMember from './ProposalKickedMember';
import config from '../../config';
import { DataP, LabelH5, DataH2 } from '../../App.styles';

import { truncateAddr } from '../../utils/Helpers';
import makeBlockie from 'ethereum-blockies-base64';
import { getProfile } from '3box/lib/api';
import {
  MemberCardIdentityDiv,
  MemberCardImage,
  ProfileImgCard,
} from '../member/Member.styles';

const ProposalGutsV2 = ({ proposal, daoData }) => {
  const [proposerProfile, setProposerProfile] = useState({});
  const [sponsorerProfile, setSponsorerProfile] = useState({});
  const [applicantProfile, setApplicantProfile] = useState({});

  useEffect(() => {
    const setup = async () => {
      let proposerProfile;
      let sponsorerProfile;
      let applicantProfile;
      try {
        proposerProfile = await getProfile(proposal.proposer);
        sponsorerProfile = await getProfile(proposal.sponsor);
        applicantProfile = await getProfile(proposal.applicant);
      } catch {
        proposerProfile = {};
        sponsorerProfile = {};
        applicantProfile = {};
      }
      setProposerProfile(proposerProfile);
      setSponsorerProfile(sponsorerProfile);
      setApplicantProfile(applicantProfile);
    };

    setup();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const memberUrlV2 = (addr) => {
    return `/dao/${daoData.contractAddress}/member/${daoData.contractAddress}-member-${addr}`;
  };

  return (
    <div className="ProposalGuts">
      {proposal.cancelled && <p style={{ color: 'red' }}>Proposal Cancelled</p>}

      {proposal.sponsored ? (
        <>
          <LabelH5>Sponsored By</LabelH5>
          <MemberCardIdentityDiv>
            <MemberCardImage>
              {sponsorerProfile &&
              sponsorerProfile.image &&
              sponsorerProfile.image[0] ? (
                <ProfileImgCard
                  style={{
                    backgroundImage: `url(${'https://ipfs.infura.io/ipfs/' +
                      sponsorerProfile.image[0].contentUrl['/']})`,
                  }}
                >
                  {''}
                </ProfileImgCard>
              ) : (
                <ProfileImgCard
                  style={{
                    backgroundImage: `url("${makeBlockie(proposal.sponsor)}")`,
                  }}
                >
                  {''}
                </ProfileImgCard>
              )}
            </MemberCardImage>
            <div>
              <h3>
                {sponsorerProfile.name || 'unknown'}{' '}
                {sponsorerProfile.emoji ? (
                  <span>{sponsorerProfile.emoji} </span>
                ) : null}
              </h3>
              <DataP>{truncateAddr(proposal.sponsor)}</DataP>
            </div>
          </MemberCardIdentityDiv>
          <DataP>
            <a href={memberUrlV2(proposal.sponsor)}>{proposal.sponsor}</a>
          </DataP>
        </>
      ) : null}

      {proposal.newMember || proposal.proposalType === 'Funding Proposal' ? (
        <>
          {proposal.newMember || +proposal.tributeOffered > 0 ? (
            <div className="Tribute">
              <LabelH5>Tribute</LabelH5>
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
          ) : null}

          <div className="Offer">
            <div className="Shares">
              <LabelH5>Shares</LabelH5>
              <DataH2>{proposal.sharesRequested}</DataH2>
            </div>
            <div className="Shares">
              <LabelH5>Loot</LabelH5>
              <DataH2>{proposal.lootRequested}</DataH2>
            </div>
            <div className="Shares">
              <LabelH5>Requesting</LabelH5>
              <DataH2>
                <ValueDisplay
                  value={
                    proposal.paymentRequested /
                    10 ** proposal.paymentTokenDecimals
                  }
                  symbolOverride={proposal.paymentTokenSymbol}
                />
              </DataH2>
            </div>
          </div>

          {proposal.proposalType === 'Funding Proposal' ? (
            <>
              <LabelH5>Proposed by</LabelH5>
              <MemberCardIdentityDiv>
                <MemberCardImage>
                  {proposerProfile &&
                  proposerProfile.image &&
                  proposerProfile.image[0] ? (
                    <ProfileImgCard
                      style={{
                        backgroundImage: `url(${'https://ipfs.infura.io/ipfs/' +
                          proposerProfile.image[0].contentUrl['/']})`,
                      }}
                    >
                      {''}
                    </ProfileImgCard>
                  ) : (
                    <ProfileImgCard
                      style={{
                        backgroundImage: `url("${makeBlockie(
                          proposal.proposer,
                        )}")`,
                      }}
                    >
                      {''}
                    </ProfileImgCard>
                  )}
                </MemberCardImage>
                <div>
                  <h3>
                    {proposerProfile.name || 'unknown'}{' '}
                    {proposerProfile.emoji ? (
                      <span>{proposerProfile.emoji} </span>
                    ) : null}
                  </h3>
                  <DataP>{truncateAddr(proposal.proposer)}</DataP>
                </div>
              </MemberCardIdentityDiv>
              <LabelH5>Funding for</LabelH5>
              <MemberCardIdentityDiv>
                <MemberCardImage>
                  {applicantProfile &&
                  applicantProfile.image &&
                  applicantProfile.image[0] ? (
                    <ProfileImgCard
                      style={{
                        backgroundImage: `url(${'https://ipfs.infura.io/ipfs/' +
                          applicantProfile.image[0].contentUrl['/']})`,
                      }}
                    >
                      {''}
                    </ProfileImgCard>
                  ) : (
                    <ProfileImgCard
                      style={{
                        backgroundImage: `url("${makeBlockie(
                          proposal.applicant,
                        )}")`,
                      }}
                    >
                      {''}
                    </ProfileImgCard>
                  )}
                </MemberCardImage>
                <div>
                  <h3>
                    {applicantProfile.name || 'unknown'}{' '}
                    {applicantProfile.emoji ? (
                      <span>{applicantProfile.emoji} </span>
                    ) : null}
                  </h3>
                  <DataP>{truncateAddr(proposal.applicant)}</DataP>
                </div>
              </MemberCardIdentityDiv>
            </>
          ) : (
            <>
              <LabelH5>Applicant</LabelH5>
              <MemberCardIdentityDiv>
                <MemberCardImage>
                  {applicantProfile &&
                  applicantProfile.image &&
                  applicantProfile.image[0] ? (
                    <ProfileImgCard
                      style={{
                        backgroundImage: `url(${'https://ipfs.infura.io/ipfs/' +
                          applicantProfile.image[0].contentUrl['/']})`,
                      }}
                    >
                      {''}
                    </ProfileImgCard>
                  ) : (
                    <ProfileImgCard
                      style={{
                        backgroundImage: `url("${makeBlockie(
                          proposal.applicant,
                        )}")`,
                      }}
                    >
                      {''}
                    </ProfileImgCard>
                  )}
                </MemberCardImage>
                <div>
                  <h3>
                    {applicantProfile.name || 'unknown'}{' '}
                    {applicantProfile.emoji ? (
                      <span>{applicantProfile.emoji} </span>
                    ) : null}
                  </h3>
                  <DataP>{truncateAddr(proposal.applicant)}</DataP>
                </div>
              </MemberCardIdentityDiv>
            </>
          )}
        </>
      ) : null}

      {proposal.whitelist ? (
        <>
          <LabelH5>Proposed by</LabelH5>
          <DataP>{proposal.proposer}</DataP>
          <LabelH5>Token Symbol</LabelH5>
          <DataP>{proposal.tributeTokenSymbol}</DataP>
          <LabelH5>Token Contract</LabelH5>
          <DataP>{proposal.tributeToken}</DataP>

          <DataP>
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
          </DataP>
        </>
      ) : null}

      {proposal.guildkick ? (
        <>
          <LabelH5>Member to kick</LabelH5>
          <DataP>{proposal.applicant}</DataP>

          <LabelH5>Proposed by</LabelH5>
          <DataP>{proposal.proposer}</DataP>
          <ProposalKickedMember proposal={proposal} />
        </>
      ) : null}

      {proposal.trade ? (
        <>
          <LabelH5>Applicant</LabelH5>
          <DataP>{proposal.applicant}</DataP>

          <LabelH5>Proposed by</LabelH5>
          <DataP>{proposal.proposer}</DataP>

          <div className="Offer">
            <div className="Shares">
              <LabelH5>Giving</LabelH5>
              <DataH2>
                <ValueDisplay
                  value={
                    proposal.tributeOffered /
                    10 ** (proposal.tributeTokenDecimals || 18)
                  }
                  symbolOverride={proposal.tributeTokenSymbol}
                />
              </DataH2>
            </div>
          </div>

          <div className="Offer">
            <div className="Shares">
              <LabelH5>Requesting</LabelH5>
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
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ProposalGutsV2;
