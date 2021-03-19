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
      proposals(where: { applicant: $memberAddress }) {
        id
        cancelled
        processed
        newMember
        details
      }
    }
    minion(id: $minionId) {
      minionType
      proposals {
        id
        cancelled
        processed
        newMember
        details
      }
    }
  }
`;

export const UBERHAUS_MEMBER_DELEGATE = gql`
  query member($molochAddress: String!, $memberAddress: String!) {
    members(
      where: { molochAddress: $molochAddress, memberAddress: $memberAddress }
    ) {
      memberAddress
      molochAddress
      delegateKey
    }
  }
`;
