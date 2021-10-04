import { utils as Web3Utils } from 'web3';

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
    if (response.status >= 400) {
      throw new Error(
        `Failed to fetch Gnosis Safe contract wallet - ${response.statusText}`,
      );
    }
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const fetchSafeDetails = async (networkName, vault) => {
  try {
    return await getApiGnosis(
      networkName,
      `safes/${Web3Utils.toChecksumAddress(vault.safeAddress)}`,
    );
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export const postApiGnosis = async (
  networkName,
  endpoint,
  data,
  getJSONResponse = true,
) => {
  const url = `https://safe-transaction.${networkName}.gnosis.io/api/v1/${endpoint}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status === 400) {
      throw new Error('Malformed Data (404 error)');
    }
    if (response.status === 422) {
      throw new Error('Account is not a valid delegate');
    }
    return {
      statusCode: response.status,
      data: getJSONResponse && (await response.json()),
    };
  } catch (err) {
    throw new Error(err);
  }
};

export const postGnosisRelayApi = async (networkName, endpoint, data) => {
  const relayApiUrl = `https://safe-relay.${networkName}.gnosis.io/api/v2/${endpoint}`;
  try {
    const response = await fetch(relayApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const payload = await response.json();
    if (payload.exception || payload.detail) {
      throw new Error(
        'Error while trying to estimate gas:',
        payload.exception || payload.detail,
      );
    }
    return {
      statusCode: response.status,
      data: payload,
    };
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
