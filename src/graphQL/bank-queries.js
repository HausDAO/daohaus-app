import { gql } from 'apollo-boost';

// todo: add a usd amount and resolver
// chop it up

export const BANK_BALANCES = gql`
  query balances($molochAddress: String!, $skip: Int) {
    balances(
      where: { molochAddress: $molochAddress }
      first: 100
      orderBy: timestamp
      orderDirection: asc
      skip: $skip
    ) {
      id
      timestamp
      balance
      tokenAddress
      tokenDecimals
      currentShares
      currentLoot
      action
    }
  }
`;

export const ADDRESS_BALANCES = gql`
  query addressBalances($memberAddress: String!) {
    addressBalances: members(where: { memberAddress: $memberAddress }) {
      id
      memberAddress
      molochAddress
      moloch {
        id
        version
        summoner
      }
      tokenBalances {
        id
        tokenBalance
        token {
          tokenAddress
          symbol
          decimals
        }
      }
    }
  }
`;
