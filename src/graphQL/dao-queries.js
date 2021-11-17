import { gql } from 'apollo-boost';

export const HOME_DAO = gql`
  query moloch($contractAddr: String!) {
    moloch(id: $contractAddr) {
      id
      summoner
      summoningTime
      newContract
      totalShares
      dilutionBound
      totalLoot
      version
      periodDuration
      votingPeriodLength
      gracePeriodLength
      proposalDeposit
      processingReward
      guildBankAddress
      minions {
        createdAt
        minionAddress
        minionType
        details
        minQuorum
        safeAddress
        uberHausAddress
        uberHausDelegate
        uberHausDelegateRewardFactor
      }
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
        tokenBalance
        guildBank
        # contractBalances @client
        moloch {
          id
          version
        }
      }
    }
  }
`;

const proposalFields = `
id
aborted
applicant
cancelled
cancelledAt
createdAt
createdBy
details
didPass
executed
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
tributeToken
votingPeriodStarts
votingPeriodEnds
whitelist
yesShares
yesVotes
molochAddress
molochVersion
minionAddress
uberHausMinionExecuted
minion {
  minionType
  minQuorum
}
actions {
  target
  data
  memberOnly
}
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
escrow {
  tokenAddresses
  tokenTypes
  tokenIds
  amounts
}
`;

export const DAO_ACTIVITIES = gql`
  query molochActivities($contractAddr: String!, $createdAt: String!) {
    proposals(
      where: { molochAddress: $contractAddr, createdAt_gt: $createdAt }
      orderBy: createdAt
      orderDirection: asc
      first: 1000
    ) {
      ${proposalFields}
    }
    rageQuits(where: {molochAddress: $contractAddr}) {
      id
      createdAt
      memberAddress
      shares
      loot
    }
  }
`;

export const SPAM_FILTER_ACTIVITIES = gql`
  query molochActivities($contractAddr: String!, $createdAt: String!) {
    proposals(
      where: { molochAddress: $contractAddr, createdAt_gt: $createdAt, sponsored: true }
      orderBy: createdAt
      orderDirection: asc
      first: 1000
    ) {
      ${proposalFields}
    }
    rageQuits {
      id
      createdAt
      memberAddress
      shares
      loot
    }
  }
`;

export const SPAM_FILTER_GK_WL = gql`
  query molochActivities($contractAddr: String!, $createdAt: String!) {
    proposals(
      where: { 
        molochAddress: $contractAddr
        createdAt_gt: $createdAt
        sponsored: false
        guildkickOrWhitelistOrMinion: true
      }
      orderBy: createdAt
      orderDirection: asc
      first: 1000
    ) {
      ${proposalFields}
    }
    rageQuits {
      id
      createdAt
      memberAddress
      shares
      loot
    }
  }
`;

export const SPAM_FILTER_TRIBUTE = gql`
  query molochActivities($contractAddr: String!, $createdAt: String!, $requiredTributeMin: String!, $requiredTributeToken: String!) {
    proposals(
      where: { 
        molochAddress: $contractAddr
        createdAt_gt: $createdAt
        sponsored: false
        tributeOffered_gte: $requiredTributeMin
        tributeToken: $requiredTributeToken
      }
      orderBy: createdAt
      orderDirection: asc
      first: 1000
    ) {
      ${proposalFields}
    }
    rageQuits {
      id
      createdAt
      memberAddress
      shares
      loot
    }
  }
`;

export const SPAM_FILTER_UNSPONSORED = gql`
  query molochActivities($contractAddr: String!, $createdAt: String!) {
    proposals(
      where: { molochAddress: $contractAddr, createdAt_gt: $createdAt, sponsored: false, guildkickOrWhitelistOrMinion: false }
      orderBy: createdAt
      orderDirection: asc
      first: 1000
    ) {
      ${proposalFields}
    }
  }
`;

export const SINGLE_PROPOSAL = gql`
  query proposal($molochAddress: String!, $proposalId: String!) {
    proposals(where: { molochAddress: $molochAddress, proposalId: $proposalId }) {
      ${proposalFields}
    }
  }
`;

export const DAO_POLL = gql`
  query moloches($summoner: String!, $createdAt: String!) {
    moloches(where: { summoner: $summoner, createdAt_gt: $createdAt }) {
      id
      summoner
      createdAt
    }
  }
`;

export const MINION_POLL = gql`
  query moloch($molochAddress: String!, $createdAt: String!) {
    moloch(id: $molochAddress) {
      id
      minions(where: { createdAt_gt: $createdAt }) {
        id
      }
    }
  }
`;

export const RAGE_QUIT_POLL = gql`
  query rageQuits($molochAddress: String!, $createdAt: String!) {
    moloch(id: $molochAddress) {
      id
      rageQuits(where: { createdAt_gt: $createdAt }) {
        id
      }
    }
  }
`;

export const MINION_PROPOSAL_POLL = gql`
  query minions($minionAddress: String!, $createdAt: String!) {
    minions(where: { minionAddress: $minionAddress }) {
      id
      proposals(where: { createdAt_gt: $createdAt }) {
        id
      }
    }
  }
`;
