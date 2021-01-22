import { gql } from 'apollo-boost';

export const MEMBERS_LIST = gql`
  query membersList($contractAddr: String!, $skip: Int) {
    daoMembers: members(
      where: { molochAddress: $contractAddr, exists: true }
      orderBy: shares
      orderDirection: desc
      first: 100
      skip: $skip
    ) {
      id
      exists
      delegateKey
      shares
      loot
      kicked
      tokenTribute
      didRagequit
      memberAddress
      createdAt
      profile @client
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

export const HUB_MEMBERSHIPS = gql`
  query membersHub($memberAddress: String!) {
    membersHub: members(
      where: { memberAddress: $memberAddress, exists: true }
    ) {
      id
      memberAddress
      exists
      networkId @client
      hubSort @client
      moloch {
        id
        title
        version
        apiMetadata @client
        proposals(orderBy: proposalId, orderDirection: desc, first: 10) {
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
          proposalType @client
          description @client
          title @client
          activityFeed @client
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
    }
  }
`;

export const USER_MEMBERSHIPS = gql`
  query membersUser($memberAddress: String!) {
    members(where: { memberAddress: $memberAddress, exists: true }) {
      id
      memberAddress
      exists
      hubSort @client
      moloch {
        id
        title
        version
        apiMetadata @client
      }
    }
  }
`;
