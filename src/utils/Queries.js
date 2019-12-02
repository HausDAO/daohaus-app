import { gql } from 'apollo-boost';

export const GET_METADATA = gql`
  query Metadata {
    currentPeriod @client
    totalShares @client
    guildBankAddr @client
    gracePeriodLength @client
    votingPeriodLength @client
    periodDuration @client
    processingReward @client
    proposalDeposit @client
    guildBankValue @client
    shareValue @client
    approvedToken @client
    tokenSymbol @client
  }
`;

export const GET_PROPOSALS_QUERY = gql`
  query proposals($contractAddr: String!) {
    proposals(
      where: { molochAddress: $contractAddr }
      orderBy: proposalIndex
      orderDirection: desc
    ) {
      id
      timestamp
      startingPeriod
      tokenTribute
      sharesRequested
      yesVotes
      noVotes
      applicantAddress
      proposalIndex
      didPass
      aborted
      details
      processed
      status @client
      gracePeriod @client
      votingEnds @client
      votingStarts @client
      readyForProcessing @client
      votes {
        memberAddress
        uintVote
      }
    }
  }
`;

export const GET_PROPOSALS_LEGACY = gql`
  query {
    proposals(orderBy: proposalIndex, orderDirection: desc) {
      id
      timestamp
      tokenTribute
      sharesRequested
      startingPeriod
      applicantAddress
      proposalIndex
      yesVotes
      noVotes
      didPass
      aborted
      details
      processed
      status @client
      gracePeriod @client
      votingEnds @client
      votingStarts @client
      readyForProcessing @client
      votes {
        memberAddress
        uintVote
      }
    }
  }
`;

export const GET_PROPOSAL_QUERY = gql`
  query proposal($id: String!) {
    proposal(id: $id) {
      id
      timestamp
      tokenTribute
      sharesRequested
      startingPeriod
      applicantAddress
      proposalIndex
      yesVotes
      noVotes
      didPass
      aborted
      details
      processed
      status @client
      gracePeriod @client
      votingEnds @client
      votingStarts @client
      readyForProcessing @client
      votes {
        memberAddress
        uintVote
      }
    }
  }
`;
