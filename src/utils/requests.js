import { getGraphEndpoint } from './chain';
import { graphQuery } from './apollo';
import { GET_WRAP_N_ZAPS } from '../graphQL/boost-queries';

const metadataApiUrl = 'https://data.daohaus.club';
const apiMetadataUrl = 'https://daohaus-metadata.s3.amazonaws.com/daoMeta.json';
const apiPricedataUrl =
  'https://daohaus-metadata.s3.amazonaws.com/daoTokenPrices.json';
const mintGateUrl = 'https://link.mintgate.app/api';
const snapshotUrl = 'https://hub.snapshot.page/api';

export const get = async endpoint => {
  const url = `${metadataApiUrl}/${endpoint}`;
  try {
    const response = await fetch(url);
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const post = async (endpoint, data) => {
  const url = `${metadataApiUrl}/${endpoint}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Haus-Key': process.env.REACT_APP_HAUS_KEY,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const put = async (endpoint, data) => {
  const url = `${metadataApiUrl}/${endpoint}`;
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Haus-Key': process.env.REACT_APP_HAUS_KEY,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const boostPost = async (endpoint, data) => {
  const url = `${metadataApiUrl}/${endpoint}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Haus-Key': process.env.REACT_APP_HAUS_KEY,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const ipfsPrePost = async (endpoint, data) => {
  const url = `${metadataApiUrl}/${endpoint}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Haus-Key': process.env.REACT_APP_HAUS_KEY,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const ipfsPost = async (creds, file) => {
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        // 'Content-Type':
        // 'multipart/form-data; boundary=—-WebKitFormBoundaryfgtsKTYLsT7PNUVD',
        pinata_api_key: creds.pinata_api_key,
        pinata_secret_api_key: creds.pinata_api_secret,
      },
      body: file,
    });
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const getApiMetadata = async () => {
  try {
    const response = await fetch(apiMetadataUrl);
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const getApiPriceData = async () => {
  try {
    const response = await fetch(apiPricedataUrl);
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const getApiGnosis = async (networkName, endpoint) => {
  const apiGnosisUrl = `https://safe-transaction.${networkName}.gnosis.io/api/v1/${endpoint}`;
  try {
    const response = await fetch(apiGnosisUrl);
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const getMintGates = async tokenAddress => {
  const mintGatesUrl = `${mintGateUrl}/links?tid=${tokenAddress}`;
  try {
    const response = await fetch(mintGatesUrl);
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const getSnapshotProposals = async space => {
  const snapshotProposalUrl = `${snapshotUrl}/${space}/proposals`;
  try {
    const response = await fetch(snapshotProposalUrl);
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const getSnapshotVotes = async (space, snapshotId) => {
  const snapshotVoteUrl = `${snapshotUrl}/${space}/proposal/${snapshotId}`;
  try {
    const response = await fetch(snapshotVoteUrl);
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const getSnapshotSpaces = async () => {
  const snapshotSpacesUrl = `${snapshotUrl}/spaces`;
  try {
    const response = await fetch(snapshotSpacesUrl);
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const getWrapNZap = async (daochain, daoid) => {
  const records = await graphQuery({
    endpoint: getGraphEndpoint(daochain, 'boosts_graph_url'),
    query: GET_WRAP_N_ZAPS,
    variables: {
      contractAddress: daoid,
    },
  });
  if (records.wrapNZaps?.length > 0) {
    return records.wrapNZaps[0].id;
  }
  return null;
};
