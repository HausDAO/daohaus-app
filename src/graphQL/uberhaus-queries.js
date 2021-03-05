import { gql } from 'apollo-boost';

export const UBERHAUS_DATA = gql`
  query moloch($molochAddress: String!, $memberAddress: String!) {
    moloch(id: $molochAddress) {
      id
      members(where: { memberAddress: $memberAddress }) {
        memberAddress
        createdAt
        loot
        shares
      }
    }
  }
`;
