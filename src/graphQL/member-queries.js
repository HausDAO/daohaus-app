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
