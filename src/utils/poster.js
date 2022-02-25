import { DAO_DOC_COLLECTION } from '../graphQL/postQueries';
import { graphQuery } from './apollo';
import { chainByID } from './chain';

export const POSTER_TAGS = {
  MINION: 'daohaus.document.minion',
  MEMBER: 'daohaus.document.member',
};

export const CONTENT_TYPES = {
  PINATA: 'IPFS-pinata',
  ON_CHAIN: 'encoded',
};

export const IPFS_TYPES = [CONTENT_TYPES.PINATA];

export const fetchDAODocs = async ({ daochain, daoid }) => {
  try {
    const endpoint = chainByID(daochain)?.poster_graph_url;
    const result = await graphQuery({
      endpoint,
      query: DAO_DOC_COLLECTION,
      variables: {
        molochAddress: daoid,
      },
    });
    return result.contents;
  } catch (error) {
    console.error(error);
  }
};
