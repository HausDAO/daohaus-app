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
        contractBalances @client
        moloch {
          id
          version
        }
      }
    }
  }
`;

export const DAO_ACTIVITIES = gql`
  query molochActivities($contractAddr: String!) {
    moloch(id: $contractAddr) {
      id
      title
      version
      proposals(orderBy: createdAt, orderDirection: desc) {
        id
        createdAt
        proposalId
        proposalIndex
        details
        memberAddress
        applicant
        newMember
        whitelist
        guildkick
        trade
        cancelled
        aborted
        votingPeriodStarts
        votingPeriodEnds
        gracePeriodEnds
        molochAddress
        molochVersion
        yesVotes
        noVotes
        processed
        processedAt
        processor
        proposer
        sponsored
        sponsoredAt
        sponsor
        proposalType @client
        title @client
        votes {
          id
          createdAt
          uintVote
          memberAddress
          molochAddress
        }
      }
      rageQuits {
        id
        createdAt
        memberAddress
        molochAddress
        shares
        loot
      }
    }
  }
`;
