import { gql } from 'apollo-boost';

export const GET_METADATA = gql`
  query Metadata {
    currentPeriod @client
    guildBankValue @client
    tokenSymbol @client
    shareValue @client
  }
`;

export const GET_MOLOCH = gql`
  query moloch($contractAddr: String!) {
    moloch(id: $contractAddr) {
      meta @client
      id
      summoner
      summoningTime
      newContract
      totalShares
      totalLoot
      version
      guildBankAddress
      depositToken {
        tokenAddress
        symbol
        decimals
      }
      tokenBalances(where: { guildBank: true }) {
        id
        token {
          tokenAddress
          symbol
          decimals
        }
        symbol @client
        decimals @client
        tokenBalance
        guildBank
        contractTokenBalance @client
        contractBabeBalance @client
        moloch {
          id
        }
      }
    }
  }
`;

export const GET_MEMBERS = gql`
  query members($contractAddr: String!, $skip: Int) {
    members(
      where: { molochAddress: $contractAddr, exists: true }
      orderBy: shares
      orderDirection: desc
      first: 100
      skip: $skip
    ) {
      id
      delegateKey
      shares
      loot
      kicked
      tokenTribute
      didRagequit
      memberAddress
      moloch {
        totalShares
      }
    }
  }
`;

export const GET_MEMBER = gql`
  query member($id: String!) {
    member(id: $id) {
      id
      delegateKey
      shares
      loot
      kicked
      tokenTribute
      memberAddress
      didRagequit
      tokenBalances {
        token {
          tokenAddress
          symbol
          decimals
        }
        tokenBalance
      }
      submissions {
        proposalIndex
        yesVotes
        noVotes
        processed
        didPass
        cancelled
      }
      moloch {
        totalShares
        depositToken {
          tokenAddress
          symbol
          decimals
        }
      }
    }
  }
`;

const baseProposalFields = `
  proposalIndex
  cancelled
  molochAddress
  id
  proposalId
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
  createdAt
  memberAddress
  proposer
  paymentToken
  paymentRequested
  moloch {
    votingPeriodLength
    gracePeriodLength
    version
    periodDuration
    proposalDeposit
    depositToken {
      tokenAddress
      symbol
      decimals
    }
  }
  votes {
    id
    createdAt
    uintVote
    member {
      memberAddress
    }
  }
  tributeTokenSymbol
  tributeTokenDecimals
  paymentTokenSymbol
  paymentTokenDecimals

  gracePeriodEnds
  votingPeriodStarts
  votingPeriodEnds


  status @client
  gracePeriod @client
  votingEnds @client
  votingStarts @client
  readyForProcessing @client
  proposalType @client
`;

export const GET_PROPOSALS_LIST = gql`
  query proposals($contractAddr: String!, $skip: Int) {
    proposals(
      where: { molochAddress: $contractAddr }
      orderBy: proposalId
      orderDirection: desc
      first: 100
      skip: $skip
    ) {
      id
      aborted
      cancelled
      details
      didPass
      gracePeriodEnds
      guildkick
      lootRequested
      newMember
      paymentRequested
      paymentTokenDecimals
      paymentTokenSymbol
      processed
      proposalId
      proposalIndex
      sharesRequested
      sponsored
      startingPeriod
      trade
      tributeOffered
      tributeTokenDecimals
      tributeTokenSymbol
      votingPeriodStarts
      votingPeriodEnds
      whitelist

      moloch {
        gracePeriodLength
        periodDuration
        version
        votingPeriodLength
      }

      status @client
      proposalType @client
      gracePeriod @client
      votingEnds @client
      votingStarts @client
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

export const GET_ACTIVE_PROPOSALS = gql`
  query proposals($contractAddr: String!) {
    proposals(
      orderBy: proposalIndex, 
      orderDirection: desc, 
      where: { processed: false, molochAddress: $contractAddr }
    ) {
      ${baseProposalFields}
    }

    moloch(id: $contractAddr) {
      id
      meta @client
      proposalDeposit
      totalShares
    }
  }
`;

export const GET_RAGES = gql`
  query rageQuits($contractAddr: String!, $skip: Int) {
    rageQuits(
      where: { molochAddress: $contractAddr }
      orderBy: createdAt
      orderDirection: desc
      first: 100
      skip: $skip
    ) {
      id
      createdAt
      shares
      loot
      memberAddress
      molochAddress
    }
  }
`;

export const GET_TRANSMUTATION = gql`
  query transmutations($contractAddr: String!) {
    transmutations(where: { moloch: $contractAddr }) {
      id
      transmutation
      moloch
      distributionToken
      minion
      trust
      getToken
      giveToken
    }
  }
`;
