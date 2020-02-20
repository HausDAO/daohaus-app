import { gql } from 'apollo-boost';

export const GET_METADATA_V2 = gql`
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

// /apiData @client

export const GET_MOLOCH_V2 = gql`
  query dao($contractAddr: String!) {
    dao(id: $contractAddr) {
      id
      index
      moloch
      summoner
      version
      title
    }
    moloch(id: $contractAddr) {
      id
      totalShares
      summoningTime
      members {
        id
      }
    }
  }
`;

const baseProposalFields = `
  proposalIndex
  cancelled
  moloch
  id
  startingPeriod
  tributeOffered
  tributeToken
  sharesRequested
  lootRequested
  paymentToken
  yesVotes
  noVotes
  applicant
  didPass
  details
  processed
  guildkick
  whitelist
  newMember
  sponsor
  sponsored
  trade
  yesShares
  noShares
  timestamp
  memberAddress
  proposer
`;

// status @client
// gracePeriod @client
// votingEnds @client
// votingStarts @client
// readyForProcessing @client

export const GET_PROPOSALS_V2 = gql`
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

export const GET_MEMBERS_V2 = gql`
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
      kicked
      tokenTribute
      didRagequit
      memberAddress
    }
  }
`;

export const GET_MEMBER_V2 = gql`
  query member($id: String!) {
    member(id: $id) {
      id
      delegateKey
      shares
      kicked
      tokenTribute
      memberAddress
      didRagequit
      submissions {
        proposalIndex
        yesVotes
        noVotes
        processed
        didPass
        cancelled
      }
    }
  }
`;
