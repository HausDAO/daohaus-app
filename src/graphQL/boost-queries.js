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
      capitalToken
    }
  }
`;

export const GET_WRAP_N_ZAPS = gql`
  query wrapNZaps($contractAddress: String!) {
    wrapNZaps(where: { moloch: $contractAddress }) {
      id
    }
  }
`;
