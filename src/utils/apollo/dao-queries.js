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
      proposalDeposit
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
      proposals {
        id
        createdAt
        proposalId
        proposalIndex
        processed
        sponsored
        details
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
        proposer
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
        shares
        loot
      }
    }
  }
`;
