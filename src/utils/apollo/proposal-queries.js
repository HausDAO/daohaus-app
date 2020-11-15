import { gql } from 'apollo-boost';

const baseListFields = `
  id
  aborted
  applicant
  cancelled
  createdAt
  details
  didPass
  gracePeriodEnds
  guildkick
  lootRequested
  memberAddress
  newMember
  noVotes
  paymentRequested
  paymentTokenDecimals
  paymentTokenSymbol
  processed
  proposer
  proposalId
  proposalIndex
  sharesRequested
  sponsored
  sponsoredAt
  startingPeriod
  trade
  tributeOffered
  tributeTokenDecimals
  tributeTokenSymbol
  votingPeriodStarts
  votingPeriodEnds
  whitelist
  yesVotes
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
    uintVote
    createdAt
  }
  status @client
  title @client
  description @client
  proposalType @client
  gracePeriod @client
  votingEnds @client
  votingStarts @client
  `;

// activityFeed @client

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
