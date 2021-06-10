import { gql } from 'apollo-boost';

export const USER_MEMBERSHIPS = gql`
  query membersUser($memberAddress: String!) {
    members(where: { memberAddress: $memberAddress, exists: true }) {
      id
      memberAddress
      moloch {
        id
        title
        version
      }
    }
  }
`;

export const HUB_MEMBERSHIPS = gql`
  query membersHub($memberAddress: String!) {
    membersHub: members(
      where: { memberAddress: $memberAddress, exists: true }
    ) {
      id
      memberAddress
      molochAddress
      moloch {
        id
        version
        summoner
        proposals(orderBy: proposalId, orderDirection: desc, first: 10) {
          id
          createdAt
          proposalId
          proposalIndex
          proposer
          processed
          processor
          sponsored
          sponsor
          sponsoredAt
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
          votes(where: { memberAddress: $memberAddress }) {
            id
            memberAddress
          }
        }
        rageQuits {
          id
          createdAt
          shares
          loot
          memberAddress
          molochAddress
        }
      }
      tokenBalances {
        tokenBalance
        moloch {
          id
        }
        token {
          tokenAddress
          symbol
          decimals
        }
      }
    }
  }
`;
export const MEMBERS_LIST = gql`
  query membersList($contractAddr: String!, $skip: Int) {
    daoMembers: members(
      where: { molochAddress: $contractAddr }
      orderBy: shares
      orderDirection: desc
      first: 1000
      skip: $skip
    ) {
      id
      delegateKey
      shares
      loot
      kicked
      jailed
      tokenTribute
      didRagequit
      memberAddress
      exists
      createdAt
      moloch {
        id
        totalShares
        depositToken {
          tokenAddress
          symbol
          decimals
        }
      }
      highestIndexYesVote {
        proposalId
        proposalIndex
      }
      tokenBalances {
        id
        tokenBalance
        token {
          id
          tokenAddress
          symbol
          decimals
        }
      }
      submissions {
        id
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

export const MEMBER_DELEGATE_KEY = gql`
  query membersList($contractAddr: String!, $memberAddr: String!) {
    members(
      where: { molochAddress: $contractAddr, memberAddress: $memberAddr }
    ) {
      memberAddress
      delegateKey
    }
  }
`;

export const RAGE_KICK_POLL = gql`
  query membersList($contractAddr: String!, $memberAddr: String!) {
    members(
      where: { molochAddress: $contractAddr, memberAddress: $memberAddr }
    ) {
      memberAddress
      loot
    }
  }
`;
