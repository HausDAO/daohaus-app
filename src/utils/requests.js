const metadataApiUrl = 'https://data.daohaus.club';
const apiMetadataUrl = 'https://daohaus-metadata.s3.amazonaws.com/daoMeta.json';
const apiPricedataUrl =
  'https://daohaus-metadata.s3.amazonaws.com/daoTokenPrices.json';

export const get = async (endpoint) => {
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
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

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
