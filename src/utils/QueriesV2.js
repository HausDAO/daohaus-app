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

export const GET_MOLOCHES_V2 = gql`
  query daos($skip: Int) {
    daos(orderBy: count, first: 100, skip: $skip) {
      apiData @client
      id
      index
      count
      moloch
      summoner
      newContract
      version
      title
      tokenInfo @client
    }
    moloches(orderBy: summoningTime, first: 100, skip: $skip) {
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
`;

export const GET_PROPOSALS_V2 = gql`
  query proposals($contractAddr: String!, $skip: Int) {
    proposals(
      where: { moloch: $contractAddr }
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
      where: { moloch: $contractAddr }
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
