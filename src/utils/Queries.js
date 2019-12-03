import { gql } from 'apollo-boost';

export const GET_METADATA = gql`
  query Metadata {
    currentPeriod @client
    totalShares @client
    guildBankAddr @client
    gracePeriodLength @client
    votingPeriodLength @client
    periodDuration @client
    processingReward @client
    proposalDeposit @client
    guildBankValue @client
    shareValue @client
    approvedToken @client
    tokenSymbol @client
  }
`;

const baseProposalFields = `
  id
  timestamp
  startingPeriod
  tokenTribute
  sharesRequested
  yesVotes
  noVotes
  applicantAddress
  proposalIndex
  didPass
  aborted
  details
  processed
  status @client
  gracePeriod @client
  votingEnds @client
  votingStarts @client
  readyForProcessing @client
  votes {
    memberAddress
    uintVote
  }
`;

export const GET_PROPOSALS = gql`
  query proposals($contractAddr: String!) {
    proposals(
      where: { molochAddress: $contractAddr }
      orderBy: proposalIndex
      orderDirection: desc
    ) {
      ${baseProposalFields}
    }
  }
`;

export const GET_PROPOSALS_LEGACY = gql`
  query {
    proposals(orderBy: proposalIndex, orderDirection: desc) {
      ${baseProposalFields}
    }
  }
`;

export const GET_PROPOSAL = gql`
  query proposal($id: String!) {
    proposal(id: $id) {
      ${baseProposalFields}
    }
  }
`;
