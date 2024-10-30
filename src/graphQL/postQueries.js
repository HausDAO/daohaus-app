import { gql } from 'apollo-boost';

export const TX_HASH_POSTER = gql`
  query contents($transactionHash: String!) {
    contents(where: { transactionHash: $transactionHash }) {
      id
      createdAt
      transactionHash
    }
  }
`;

export const DAO_DOC_COLLECTION = gql`
  query contents($molochAddress: String!) {
    contents(
      where: { molochAddress: $molochAddress }
      first: 1000
      orderBy: createdAt
      orderDirection: desc
    ) {
      id
      createdAt
      transactionHash
      title
      molochAddress
      memberAddress
      content
      contentType
      location
      ratified
      description
    }
  }
`;

export const DAO_DOC = gql`
  query contents($id: String!) {
    contents(where: { id: $id }) {
      id
      createdAt
      transactionHash
      title
      molochAddress
      memberAddress
      content
      contentType
      location
      ratified
      description
    }
  }
`;
