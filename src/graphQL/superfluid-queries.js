import { gql } from 'apollo-boost';

const baseListFields = `
  id
  createdAt
  proposalId
  to
  executed
  executedBlock
  execTxHash
  tokenAddress
  superTokenAddress
  rate
  minDeposit
  executed
  executedAt
  active
  canceledAt
  canceledBy
`;

const baseFlowFields = `
  id
  events {
    oldFlowRate
    flowRate
    sum
    transaction {
      id
      blockNumber
      timestamp
    }
  }
  flowRate
  lastUpdate
  sum
  token {
    id
    underlyingAddress
  }
`;

const baseFlowFieldsV2 = `
  id
  createdAtTimestamp
  updatedAtTimestamp
  currentFlowRate
  streamedUntilUpdatedAt
  token {
    id
    isListed
    isSuperToken
    name
    symbol
    underlyingAddress
  }
  receiver {
    id
  }
  flowUpdatedEvents {
    flowRate
    timestamp
    totalAmountStreamedUntilTimestamp
    transactionHash
    type
  }
`;

export const MINION_STREAMS = gql`
  query minionStream($minionId: String!) {
    minionStreams(where: { minion: $minionId }, orderBy: createdAt, orderDirection: asc) {
      ${baseListFields}
    }
  }
`;

export const SF_STREAMS = gql`
  query outStreams($ownerAddress: String!) {
    account(id: $ownerAddress) {
      flowsOwned {
        ${baseFlowFields}
        recipient {
          id
        }
      }
      flowsReceived {
        ${baseFlowFields}
        owner {
          id
        }
      }
    }
  }
`;

export const SF_STREAMS_V2 = gql`
  query outStreams($ownerAddress: String!) {
    account(id: $ownerAddress) {
      id
      inflows {
        ${baseFlowFieldsV2}
      }
      outflows {
        ${baseFlowFieldsV2}
      }
    }
  }
`;

export const SF_ACTIVE_STREAMS = gql`
  query activeStreams($ownerAddress: String!, $recipientAddress: String!) {
    account(id: $ownerAddress) {
      flowsOwned(where: { recipient: $recipientAddress, flowRate_gt: 0 }) {
        id
        flowRate
        lastUpdate
        token {
          id
          underlyingAddress
        }
      }
    }
  }
`;

export const SF_SUPERTOKEN_CREATED = gql`
  query supertoken($underlyingTokenAddress: String!, $createdAt: String!) {
    tokens(
      where: {
        underlyingToken: $underlyingTokenAddress
        createdAtTimestamp_gt: $createdAt
      }
    ) {
      id
      underlyingToken {
        id
      }
    }
  }
`;

export const SF_SUPERTOKEN = gql`
  query supertoken($tokenAddress: String!) {
    superTokenOf: superTokenCreateds(
      where: { underlyingAddress: $tokenAddress }
      orderBy: id
      orderDirection: asc
    ) {
      id
      address
      underlyingAddress
      name
      symbol
    }
    superToken: superTokenCreateds(
      where: { address: $tokenAddress }
      orderBy: id
      orderDirection: asc
    ) {
      id
      address
      underlyingAddress
      name
      symbol
    }
  }
`;

export const SF_SUPERTOKEN_V2 = gql`
  query supertoken($tokenAddress: String!) {
    superTokenOf: tokens(where: { underlyingAddress: $tokenAddress }) {
      address: id
      isSuperToken
      isListed
      name
      symbol
      underlyingAddress
    }
    superToken: tokens(where: { id: $tokenAddress }) {
      address: id
      isSuperToken
      isListed
      name
      symbol
      underlyingAddress
    }
  }
`;
