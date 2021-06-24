import { gql } from 'apollo-boost';

export const TX_HASH = gql`
  query graphTX($id: String!) {
    molochTransaction(id: $id) {
      id
      createdAt
    }
  }
`;
