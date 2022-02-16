import { gql } from 'apollo-boost';

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
      content
      location
    }
  }
`;

// export const DAO_DOC = gql`

// `
