import { gql } from 'apollo-boost';

export const HOME_DAO = gql`
  query moloch($contractAddr: String!) {
    moloch(id: $contractAddr) {
      id
      title
      summoner
      summoningTime
      newContract
      totalShares
      totalLoot
      version
      guildBankAddress
      depositToken {
        tokenAddress
        symbol
        decimals
      }
      tokenBalances(where: { guildBank: true }) {
        id
        token {
          tokenAddress
          symbol
          decimals
        }
        symbol @client
        decimals @client
        tokenBalance
        guildBank
        contractTokenBalance @client
        contractBabeBalance @client
        moloch {
          id
        }
      }
    }
  }
`;
