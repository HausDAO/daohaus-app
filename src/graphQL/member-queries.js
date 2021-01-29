import { gql } from 'apollo-boost';

export const USER_MEMBERSHIPS = gql`
  query membersUser($memberAddress: String!) {
    members(where: { memberAddress: $memberAddress, exists: true }) {
      id
      memberAddress
      # hubSort @client
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
      moloch {
        id
        version
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
    }
  }
`;
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
      delegateKey
      shares
      loot
      kicked
      tokenTribute
      didRagequit
      memberAddress
      createdAt
      # profile @client // handled with 3box queries at component level
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
