import { utils } from 'web3';
import { DAO_DOC_COLLECTION } from '../graphQL/postQueries';
import { graphQuery } from './apollo';
import { chainByID } from './chain';
import { parseIfJSON } from './general';
import { getIPFSPinata } from './metadata';

export const POSTER_TAGS = {
  MINION: 'daohaus.document.minion',
  MEMBER: 'daohaus.document.member',
};

export const CONTENT_TYPES = {
  PINATA: 'IPFS-pinata',
  ON_CHAIN: 'encoded',
};

export const POST_LOCATIONS = {
  FRONT_PAGE: 'front-page',
  DOCS: 'docs',
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

export const contentFromMinionAction = async ({ minionAction }) => {
  const rawJSON = minionAction?.decoded?.actions?.[0]?.data?.params?.[0]?.value;
  if (rawJSON) {
    const data = parseIfJSON(rawJSON);

    try {
      if (data.contentType === CONTENT_TYPES.ON_CHAIN) {
        const withDecoded = {
          ...data,
          content: utils.hexToUtf8(data.content),
        };
        if (withDecoded) return withDecoded;
      }
      if (data.contentType === CONTENT_TYPES.PINATA) {
        const hydrated = JSON.parse(data.content);
        const { IpfsHash } = hydrated;
        const ipfsContent = await getIPFSPinata({ hash: IpfsHash });
        return ipfsContent;
      }
    } catch (error) {
      console.log('rawJSON', rawJSON);
      return { error: true, message: 'Could decode content' };
    }
  }
};
