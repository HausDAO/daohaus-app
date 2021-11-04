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

export const GET_TRANSMUTATIONS = gql`
  query transmutations($contractAddress: String!) {
    transmutations(where: { moloch: $contractAddress }) {
      id
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

export const GET_POAP = gql`
  query event($eventId: String!) {
    event(id: $eventId) {
      id
      tokens {
        owner {
          id
        }
      }
    }
  }
`;

// {
//   event(id: "8540") {
//     id
//     tokens {
//       owner {
//         id
//       }
//     }
//   }
// }

export const GET_ERC721 = gql`
  query tokens($tokenHolder: String!) {
    tokens(where: { owner: $tokenHolder }) {
      id
      identifier
      uri
      registry {
        id
        name
        symbol
      }
    }
  }
`;

export const GET_ERC1155 = gql`
  query balances($tokenHolder: String!) {
    balances(where: { account: $tokenHolder }) {
      id
      value
      token {
        id
        identifier
        name
        symbol
        URI
        registry {
          id
        }
      }
    }
  }
`;
