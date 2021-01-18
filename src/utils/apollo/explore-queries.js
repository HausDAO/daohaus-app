// guildBankValue @client

import { gql } from 'apollo-boost';

export const EXPLORER_DAOS = gql`
  query moloches($skip: Int) {
    moloches(orderBy: summoningTime, first: 100, skip: $skip) {
      id
      title
      version
      totalShares
      guildBankAddress
      summoningTime
      guildBankBalanceV1
      guildBankValue @client
      apiMetadata @client
      networkId @client
      members(where: { exists: true }) {
        id
      }
      proposals {
        id
      }
      tokens {
        id
      }
      depositToken {
        tokenAddress
        symbol
        decimals
      }
      tokenBalances(where: { guildBank: true }) {
        id
        tokenBalance
        guildBank
        token {
          decimals
          tokenAddress
        }
      }
    }
  }
`;

export const GET_TOKENS = gql`
  query tokens($skip: Int) {
    tokens(first: 100, skip: $skip) {
      tokenAddress
      symbol
    }
  }
`;
