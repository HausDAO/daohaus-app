import { gql } from 'apollo-boost';

export const GET_METADATA_SUPER = gql`
  query Metadata {
    currentPeriod @client
    guildBankValue @client
    tokenSymbol @client
    shareValue @client
  }
`;

export const GET_MOLOCH_SUPER = gql`
  query moloch($contractAddr: String!) {
    moloch(id: $contractAddr) {
      meta @client
      id
      title
      summoner
      summoningTime
      newContract
      totalShares
      version
      guildBankAddress
      tokenBalances {
        token {
          tokenAddress
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
