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

export const GET_MEMBERS_SUPER = gql`
  query members($contractAddr: String!, $skip: Int) {
    members(
      where: { molochAddress: $contractAddr, exists: true }
      orderBy: shares
      orderDirection: desc
      first: 100
      skip: $skip
    ) {
      id
      delegateKey
      shares
      kicked
      tokenTribute
      didRagequit
      memberAddress
      moloch {
        totalShares
      }
    }
  }
`;

export const GET_MEMBER_SUPER = gql`
  query member($id: String!) {
    member(id: $id) {
      id
      delegateKey
      shares
      loot
      kicked
      tokenTribute
      memberAddress
      didRagequit
      moloch {
        totalShares
      }
    }
  }
`;
