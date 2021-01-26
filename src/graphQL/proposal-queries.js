import { gql } from 'apollo-boost';

const baseListFields = `
  id
  aborted
  applicant
  cancelled
  cancelledAt
  createdAt
  details
  didPass
  gracePeriodEnds
  guildkick
  isMinion
  lootRequested
  memberAddress
  newMember
  noShares
  noVotes
  paymentRequested
  paymentTokenDecimals
  paymentTokenSymbol
  processed
  processor
  processedAt
  proposer
  proposalId
  proposalIndex
  sharesRequested
  sponsored
  sponsor
  sponsoredAt
  startingPeriod
  trade
  tributeOffered
  tributeTokenDecimals
  tributeTokenSymbol
  votingPeriodStarts
  votingPeriodEnds
  whitelist
  yesShares
  yesVotes
  molochAddress
  molochVersion
  minionAddress
  moloch {
    gracePeriodLength
    periodDuration
    version
    votingPeriodLength
  }
  votes {
    id
    memberAddress
    memberPower
    uintVote
    createdAt
    molochAddress
  }
  `;
// status @client
// title @client
// description @client
// hash @client
// proposalType @client

export const PROPOSALS_LIST = gql`
  query proposals($contractAddr: String!, $skip: Int) {
    proposals(
      where: { molochAddress: $contractAddr }
      orderBy: proposalId
      orderDirection: desc
      first: 100
      skip: $skip
    ) {
      ${baseListFields}
    }
  }
`;

export const PROPOSALS_LIST_IS_MEMBER = gql`
  query proposalsMember($contractAddr: String!, $skip: Int, $memberAddress: String!) {
    proposals(
      where: { molochAddress: $contractAddr }
      orderBy: proposalId
      orderDirection: desc
      first: 100
      skip: $skip
    ) {
      ${baseListFields}
      votes(where: { memberAddress: $memberAddress }) {
        id
        memberAddress
      }
    }
  }
`;
