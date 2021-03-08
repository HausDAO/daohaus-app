import { gql } from 'apollo-boost';

export const UBERHAUS_DATA = gql`
  query moloch(
    $molochAddress: String!
    $memberAddress: String!
    $minionId: String!
  ) {
    moloch(id: $molochAddress) {
      id
      members(where: { memberAddress: $memberAddress }) {
        memberAddress
        createdAt
        loot
        shares
      }
    }
    minion(id: $minionId) {
      minionType
      proposals {
        id
        cancelled
        processed
        newMember
      }
    }
  }
`;
