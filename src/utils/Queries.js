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
  memberAddress
  votes {
    memberAddress
    uintVote
  }
`;

export const GET_PROPOSALS = gql`
  query proposals($contractAddr: String!, $skip: Int) {
    proposals(
      where: { molochAddress: $contractAddr }
      orderBy: proposalIndex
      orderDirection: desc
      first: 100
      skip: $skip
    ) {
      ${baseProposalFields}
    }
  }
`;

export const GET_PROPOSALS_LEGACY = gql`
  query proposals($skip: Int) {
    proposals(
      orderBy: proposalIndex
      orderDirection: desc
      first: 100
      skip: $skip
    ) {
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

// removed member.shares because error. TODO: is this needed
// votes {
//   memberAddress
//   uintVote
//   member {
//     shares
//   }
// }
export const GET_ACTIVE_PROPOSALS_QUERY = gql`
  query proposals($skip: Int) {
    proposals(
      orderBy: proposalIndex, 
      orderDirection: desc, 
      first: 100, 
      skip: $skip, 
      where: { processed: false }
    ) {
      ${baseProposalFields}
    }
  }
`;

export const GET_MEMBERS = gql`
  query members($contractAddr: String!, $skip: Int) {
    members(
      where: { molochAddress: $contractAddr }
      orderBy: shares
      first: 100
      skip: $skip
    ) {
      id
      delegateKey
      shares
      isActive
      tokenTribute
      didRagequit
    }
  }
`;

export const GET_MEMBERS_LEGACY = gql`
  query members($skip: Int) {
    members(orderBy: shares, first: 100, skip: $skip) {
      id
      delegateKey
      shares
      isActive
      tokenTribute
      didRagequit
    }
  }
`;

export const GET_MEMBER_OR_DELEGATE = gql`
  query members(
    $address: String!
    $combinedContractPlusMemberAddress: String!
  ) {
    isDelegate: members(where: { delegateKey: $address }) {
      id
      delegateKey
      shares
      isActive
      tokenTribute
      didRagequit
    }

    isMember: members(where: { id: $combinedContractPlusMemberAddress }) {
      id
      delegateKey
      shares
      isActive
      tokenTribute
      didRagequit
    }
  }
`;

export const GET_MEMBER = gql`
  query member($id: String!) {
    member(id: $id) {
      id
      delegateKey
      shares
      isActive
      tokenTribute
      didRagequit
      submissions {
        proposalIndex
        yesVotes
        noVotes
        processed
        didPass
        aborted
      }
    }
  }
`;
