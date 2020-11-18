import { gql } from 'apollo-boost';

// todo: add a usd amount and resolver
// chop it up

export const BANK_BALANCES = gql`
  query balances($molochAddress: String!) {
    balances(
      where: { molochAddress: $molochAddress }
      first: 100
      orderBy: timestamp
      orderDirection: asc
    ) {
      id
      timestamp
      balance
      tokenAddress
      tokenDecimals
    }
  }
`;
