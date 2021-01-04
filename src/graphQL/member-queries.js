import { gql } from "apollo-boost";

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
      # networkId @client
      # hubSort @client
      moloch {
        id
        title
        version
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
          # proposalType @client
          # description @client
          # title @client
          # activityFeed @client
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
