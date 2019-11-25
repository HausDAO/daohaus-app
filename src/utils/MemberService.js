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
  query members($contractAddr: String!) {
    members(orderBy: shares, where: { molochAddress: $contractAddr }) {
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
  query member($id: String!, $contractAddr: String!) {
    member(id: $id, where: { molochAddress: $contractAddr }) {
      id
      delegateKey
      shares
      isActive
      tokenTribute
      didRagequit

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

//hand tgo remove
// votes {
//   proposal {
//     proposalIndex
//     yesVotes
//     noVotes
//   }
// }