import { Storage } from 'aws-amplify';
import { gql } from 'apollo-boost';

export const GetMetaData = async (id) => {
  const uri = await Storage.get(`proposal_${id}.json`);

  try {
    const res = await fetch(uri);
    
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res.json();
  } catch (err) {
    return { error: err };
  }
};

export const GET_PROPOSALS_QUERY = gql`
  query {
    proposals(orderBy: proposalIndex, orderDirection: desc) {
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
        member {
          shares
        }
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
        member {
          shares
        }
      }
    }
  }
`;
