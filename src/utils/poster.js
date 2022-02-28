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

export const isIPFS = doc => IPFS_TYPES.includes(doc?.contentType);
export const isEncoded = doc => doc?.contentType === CONTENT_TYPES.ON_CHAIN;
export const isRatified = doc => doc?.ratified;

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

export const getDocContent = async ({ docData }) => {
  try {
    if (docData.contentType === CONTENT_TYPES.ON_CHAIN) {
      const withDecoded = {
        ...docData,
        content: utils.hexToUtf8(docData.content),
        isDecoded: true,
      };
      if (withDecoded) return withDecoded;
    }
    if (docData.contentType === CONTENT_TYPES.PINATA) {
      console.log('docData', docData);
      const hydrated = JSON.parse(docData.content);
      const { IpfsHash } = hydrated;
      const ipfsContent = await getIPFSPinata({ hash: IpfsHash });

      return { ...docData, content: ipfsContent?.content, isDecoded: true };
    }
  } catch (error) {
    console.error(error);
    return { error: true, message: 'Could decode content' };
  }
};

export const contentFromMinionAction = async ({ minionAction }) => {
  const rawJSON = minionAction?.decoded?.actions?.[0]?.data?.params?.[0]?.value;
  if (rawJSON) {
    const docData = parseIfJSON(rawJSON);

    if (docData) {
      const docContent = await getDocContent({ docData });
      return docContent;
    }
    console.error(docData);
    return { error: true, message: 'Post data may be corrupt' };
  }
};
