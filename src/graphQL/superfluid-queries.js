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
