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

export const SUPERFLUID_MINION_STREAMS = gql`
  query minionStream($minionId: String!) {
    minionStreams(where: { minion: $minionId }, orderBy: createdAt, orderDirection: asc) {
      ${baseListFields}
    }
  }
`;

export const SUPERFLUID_ACTIVE_STREAMS_TO = gql`
  query minionStream($minionId: String!, $tokenAddress: String!, $to: String!) {
    minionStreams(where: { minion: $minionId, tokenAddress: $tokenAddress, to: $to, active: true }) {
      ${baseListFields}
    }
  }
`;
