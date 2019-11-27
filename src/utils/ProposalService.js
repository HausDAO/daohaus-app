import { gql } from 'apollo-boost';

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

export const GET_PROPOSAL_QUERY = gql`
  query proposal($id: String!) {
    proposal(id: $id) {
      id
      timestamp
      tokenTribute
      sharesRequested
      startingPeriod
      applicantAddress
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

// have to remove
// member {
//   shares
// }