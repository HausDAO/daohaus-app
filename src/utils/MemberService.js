import { Storage } from 'aws-amplify';
import { gql } from 'apollo-boost';

export const GetMetaData = async (id) => {
  const uri = await Storage.get(`member_${id.toUpperCase()}.json`);

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

export const GET_MEMBERS_QUERY = gql`
  query {
    members(orderBy: shares) {
      id
      delegateKey
      shares
      isActive
      tokenTribute
      didRagequit
    }
  }
`;

export const GET_MEMBER_QUERY = gql`
  query member($id: String!) {
    member(id: $id) {
      id
      delegateKey
      shares
      isActive
      tokenTribute
      didRagequit
      votes {
        proposal {
          proposalIndex
          yesVotes
          noVotes
        }
      }
      submissions {
        proposalIndex
        yesVotes
        noVotes
        processed
        didPass
        aborted
      }
    }
  }
`;
