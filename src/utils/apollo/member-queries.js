import { gql } from 'apollo-boost';

export const MEMBERS_LIST = gql`
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
      loot
      kicked
      tokenTribute
      didRagequit
      memberAddress
      profile @client
      moloch {
        totalShares
        depositToken {
          tokenAddress
          symbol
          decimals
        }
      }
      tokenBalances {
        tokenBalance
        token {
          tokenAddress
          symbol
          decimals
        }
      }
      submissions {
        proposalIndex
        yesVotes
        noVotes
        processed
        didPass
        cancelled
      }
    }
  }
`;
