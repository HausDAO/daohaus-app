import { gql } from 'apollo-boost';

// todo: add a usd amount and resolver
// chop it up

export const BANK_BALANCES = gql`
  query balances($molochAddress: String!, $tokenAddress: String!) {
    balances(
      where: { molochAddress: $molochAddress, tokenAddress: $tokenAddress }
      first: 100
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      timestamp
      balance
      tokenAddress
    }
  }
`;
