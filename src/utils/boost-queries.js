import { gql } from 'apollo-boost';

export const GET_TRANSMUTATION = gql`
  query transmutations($contractAddress: String!) {
    transmutations(where: { moloch: $contractAddress }) {
      id
      transmutation
      moloch
      distributionToken
      minion
      trust
      getToken
      giveToken
    }
  }
`;
