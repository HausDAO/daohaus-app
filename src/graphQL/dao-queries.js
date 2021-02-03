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
      totalLoot
      version
      periodDuration
      votingPeriodLength
      gracePeriodLength
      proposalDeposit
      processingReward
      guildBankAddress
      minions {
        minionAddress
        minionType
        details
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
  query moloches($summoner: String!, $summoningTime: String!) {
    moloches(where: { summoner: $summoner, summoningTime_gt: summoningTime }) {
      id
      summoner
      summoningTime
    }
  }
`;
