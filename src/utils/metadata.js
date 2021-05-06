import { chainByNetworkId } from './chain';
import { capitalize, omit } from './general';

const metadataApiUrl = 'https://data.daohaus.club';
const ccoApiUrl = 'https://cco.daohaus.club';

export const fetchMetaData = async endpoint => {
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

export const formatBoosts = boostsArr =>
  boostsArr.reduce((obj, boost) => {
    return {
      ...obj,
      [boost.boostKey[0]]: omit('boostKey', boost),
    };
  }, {});

export const themeImagePath = imageValue => {
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

export const pokemolUrlHubList = dao => {
  const domain =
    dao.meta.network === 'mainnet'
      ? 'pokemol.com'
      : `${dao.meta.network}.pokemol.com`;
  return `https://${domain}/dao/${dao.moloch.id}`;
};

export const pokemolUrlExplore = dao => {
  const networkName = chainByNetworkId(+dao.networkId).network;
  const domain =
    networkName === 'mainnet' ? 'pokemol.com' : `${networkName}.pokemol.com`;
  return `https://${domain}/dao/${dao.id}`;
};

export const getTerm = (customTerms, word) => {
  if (!customTerms) {
    return capitalize(word);
  }
  word = word?.toLowerCase();
  if (word === 'proposal') {
    return customTerms?.proposal || 'Proposal';
  }
  if (word === 'proposals') {
    return customTerms?.proposals || 'Proposals';
  }
  if (word === 'bank') {
    return customTerms?.bank || 'Bank';
  }
  if (word === 'boost') {
    return customTerms?.boost || 'Boost';
  }
  if (word === 'boosts') {
    return customTerms?.boosts || 'Boosts';
  }
  if (word === 'members') {
    return customTerms?.members || 'Members';
  }
  if (word === 'member') {
    return customTerms?.member || 'Member';
  }
  if (word === 'settings') {
    return customTerms?.settings || 'Settings';
  }
  if (word === 'profile') {
    return customTerms?.profile || 'Profile';
  }
  if (word === 'f04title') {
    return customTerms?.f04title || "404 What's Lost Can Be Found";
  }
  if (word === 'f04heading') {
    return customTerms?.f04heading || 'You have been slain';
  }
  if (word === 'settings') {
    return customTerms?.settings || 'Settings';
  }
  if (word === 'rage quit' || word === 'ragequit') {
    return customTerms?.ragequit || 'Rage Quit';
  }
  if (word === 'guild kick' || word === 'guildkick') {
    return customTerms?.guildkick || 'Guild Kick';
  }
  if (word === 'minion') {
    return customTerms?.minion || 'minion';
  }
  if (word === 'minions') {
    return customTerms?.minions || 'Minions';
  }
  if (word === 'f04subhead') {
    return (
      customTerms?.f04subhead ||
      'Please reload from the most recent save point.'
    );
  }
  if (word === 'f04cta') {
    return customTerms?.f04cta || 'Start Over.';
  }
  if (typeof word !== 'string') {
    return 'Error';
  }
  return capitalize(word);
};

export const getCustomProposalTerm = (customTerms, proposalTerm) => {
  if (
    customTerms?.proposal &&
    customTerms?.proposal !== 'Proposal' &&
    proposalTerm
  ) {
    return proposalTerm.replace('Proposal', customTerms.proposal);
  }
  if (proposalTerm) {
    return proposalTerm;
  }
  return 'Proposal';
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

export const ccoPost = async (endpoint, data) => {
  const url = `${ccoApiUrl}/${endpoint}`;
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

export const getForumTopics = async categoryId => {
  const url = `${metadataApiUrl}/dao/discourse-topics/${categoryId}`;

  try {
    const response = await fetch(url);

    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const getEligibility = async (ccoId, address) => {
  try {
    const response = await fetch(
      `${ccoApiUrl}/cco/eligibility/${ccoId}/${address}`,
    );
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const getDateTime = async () => {
  try {
    const response = await fetch('https://data.daohaus.club/dao/get-utc');
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const getNftMeta = async url => {
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    throw new Error(error);
  }
};
