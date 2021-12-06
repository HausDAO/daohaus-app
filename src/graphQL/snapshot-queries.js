import { gql } from 'apollo-boost';

export const SNAPSHOT_SPACE_QUERY = gql`
  query Spaces {
    spaces(first: 10000) {
      id
      name
    }
  }
`;
