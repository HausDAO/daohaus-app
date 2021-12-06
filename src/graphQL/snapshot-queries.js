import { gql } from 'apollo-boost';

export const SNAPSHOT_SPACE_QUERY = gql`
  query Spaces($id: String) {
    space(id: $id) {
      id
      name
    }
  }
`;
