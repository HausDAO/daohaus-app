import { gql } from 'apollo-boost';

export const SNAPSHOT_SPACE_QUERY = gql`
  query Spaces($id: String) {
    space(id: $id) {
      id
      name
    }
  }
`;

export const SNAPSHOT_PROPOSALS_QUERY = gql`
  query Proposals($id: String) {
    proposals(where: { space: $id }) {
      id
      title
      body
      choices
      start
      end
      snapshot
      state
      author
      space {
        id
      }
    }
  }
`;

export const SNAPSHOT_VOTES_QUERY = gql`
  query Votes($id: String) {
    votes(first: 1000, where: { proposal: $id }) {
      id
      voter
      created
      choice
    }
  }
`;
