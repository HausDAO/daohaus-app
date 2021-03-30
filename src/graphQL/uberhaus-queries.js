import { gql } from 'apollo-boost';

export const UBERHAUS_QUERY = gql`
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

export const UBERHAUS_DELEGATE = gql`
  query member($molochAddress: String!, $delegateAddress: String!) {
    members(
      where: { molochAddress: $molochAddress, delegateKey: $delegateAddress }
    ) {
      memberAddress
      molochAddress
      delegateKey
      moloch {
        id
      }
    }
  }
`;

export const UBER_MINIONS = gql`
  # query minions {
  #   minionType
  #   minionAddress
  #   molochAddress
  #   uberHausAddress
  #   uberHausDelegate
  # }
  # query {
  #   minions(where: { minionType: "UberHaus minion" }) {
  #     minionType
  #     minionAddress
  #     molochAddress
  #     uberHausAddress
  #     uberHausDelegate
  #   }
  # }
  query minion {
    minions(where: { minionType: "UberHaus minion" }) {
      minionType
      minionAddress
      molochAddress
      uberHausAddress
      uberHausDelegate
    }
  }
`;
