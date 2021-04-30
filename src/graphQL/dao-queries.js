import { gql } from 'apollo-boost';

export const HOME_DAO = gql`
  query moloch($contractAddr: String!) {
    moloch(id: $contractAddr) {
      id
      title
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

export const DAO_ACTIVITIES = gql`
  query molochActivities($contractAddr: String!, $skip: Int) {
    moloch(id: $contractAddr) {
      id
      title
      version
      proposals(orderBy: createdAt, orderDirection: desc, skip: $skip) {
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
      }
      rageQuits {
        id
        createdAt
        memberAddress
        shares
        loot
      }
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
