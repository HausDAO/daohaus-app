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

export const MINION_STREAMS = gql`
  query minionStream($minionId: String!) {
    minionStreams(where: { minion: $minionId }, orderBy: createdAt, orderDirection: asc) {
      ${baseListFields}
    }
  }
`;

export const SF_OUTGOING_STREAMS = gql`
  query outStreams($ownerAddress: String!) {
    account(id: $ownerAddress) {
      flowsOwned {
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
        recipient {
          id
        }
        sum
        token {
          id
          underlyingAddress
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
