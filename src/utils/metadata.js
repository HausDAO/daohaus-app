import { chainByNetworkId } from './chain';
import { omit } from './general';

const metadataApiUrl = 'https://data.daohaus.club';

export const fetchMetaData = async (endpoint) => {
  const url = `${metadataApiUrl}/dao/${endpoint}`;
  try {
    const response = await fetch(url);
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const getApiMetadata = async () => {
  try {
    const response = await fetch(
      'https://daohaus-metadata.s3.amazonaws.com/daoMeta.json',
    );
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const formatBoosts = (boostsArr) =>
  boostsArr.reduce((obj, boost) => {
    return {
      ...obj,
      [boost.boostKey[0]]: omit('boostKey', boost),
    };
  }, {});

export const themeImagePath = (imageValue) => {
  if (
    !imageValue ||
    imageValue.slice(0, 1) === '/' ||
    imageValue.slice(0, 4) === 'http'
  ) {
    return imageValue;
  }

  if (imageValue.slice(0, 2) === 'Qm') {
    return `https://gateway.pinata.cloud/ipfs/${imageValue}`;
  }
};

export const pokemolUrlHubList = (dao) => {
  const domain =
    dao.meta.network === 'mainnet'
      ? 'pokemol.com'
      : `${dao.meta.network}.pokemol.com`;
  return `https://${domain}/dao/${dao.moloch.id}`;
};

export const pokemolUrlExplore = (dao) => {
  const networkName = chainByNetworkId(+dao.networkId).network;
  const domain =
    networkName === 'mainnet' ? 'pokemol.com' : `${networkName}.pokemol.com`;
  return `https://${domain}/dao/${dao.id}`;
};

export const getCopy = (metaData, word) => {
  if (!metaData) {
    return;
  }
  word = word.toLowerCase();

  if (word === 'name') return metaData.name;
  else if (word === 'description') return metaData.description;
  else {
    const customCopy = metaData?.customTheme?.daoMeta;
    if (word === 'proposal') {
      return customCopy?.proposal || 'Proposal';
    } else if (word === 'proposals') {
      return customCopy?.proposals || 'Proposals';
    } else if (word === 'bank') {
      return customCopy?.bank || 'Bank';
    } else if (word === 'boost') {
      return customCopy?.boost || 'Boost';
    } else if (word === 'boosts') {
      return customCopy?.boosts || 'Boosts';
    } else if (word === 'members') {
      return customCopy?.members || 'Members';
    } else if (word === 'member') {
      return customCopy?.member || 'Member';
    } else if (word === 'settings') {
      return customCopy?.settings || 'Settings';
    } else if (word === 'profile') {
      return customCopy?.profile || 'Profile';
    } else if (word === 'f04title') {
      return customCopy?.f04title || "404 What's Lost Can Be Found";
    } else if (word === 'f04heading') {
      return customCopy?.f04heading || 'You have been slain';
    } else if (word === 'f04subhead') {
      return (
        customCopy?.f04subhead ||
        'Please reload from the most recent save point.'
      );
    } else if (word === 'f04cta') {
      return customCopy?.f04cta || 'Start Over.';
    } else {
      return 'WORD!';
    }
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

/// //////////DEFAULTS//////////////

// const defaultMeta = {
//   proposals: "Proposals",
//   proposal: "Proposal",
//   bank: "Bank",
//   members: "Members",
//   member: "Member",
//   boosts: "Apps",
//   boost: "App",
//   discord: "https://discord.gg/NPEJysW",
//   medium: "https://medium.com/daohaus-club",
//   telegram: "https://t.me/joinchat/IJqu9xPa0xzYLN1mmFKo8g",
//   website: "https://daohaus.club",
//   other: "https://wikipedia.com",
//   f04title: "404 What's Lost Can Be Found",
//   f04heading: "You have been slain",
//   f04subhead: "Please reload from the most recent save point.",
//   f04cta: "Start Over",
// };
