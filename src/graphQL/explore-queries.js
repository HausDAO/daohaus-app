import { gql } from 'apollo-boost';

// guildBankValue @client
// networkId @client

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
