import { BOOSTS } from '../data/boosts';
import { capitalize, omit } from './general';
import { chainByNetworkId } from './chain';
import {
  addBoostPlaylist,
  checkIsPlaylist,
  hasPlaylist,
} from '../data/playlists';

const metadataApiUrl = 'https://data.daohaus.club';

export const fetchMetaData = async endpoint => {
  const url = `${metadataApiUrl}/dao/${endpoint}`;

  try {
    const response = await fetch(url);
    return response.json();
  } catch (err) {
    console.error(err);
  }
};

export const getApiMetadata = async () => {
  try {
    const response = await fetch(
      'https://daohaus-metadata.s3.amazonaws.com/daoMeta.json',
    );
    return response.json();
  } catch (err) {
    console.error(err);
  }
};

export const fetchApiVaultData = async (network, minions) => {
  try {
    const response = await fetch(`${metadataApiUrl}/dao/vaults`, {
      method: 'POST',
      body: JSON.stringify({ network, minions }),
    });

    return response.json();
  } catch (err) {
    console.error(err);
  }
};

export const putRefreshApiVault = async args => {
  try {
    const body = { ...args };
    const response = await fetch(`${metadataApiUrl}/dao/refresh-vault`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    console.log('response', response);

    return response.json();
  } catch (err) {
    console.error(err);
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
    return `https://daohaus.mypinata.cloud/ipfs/${imageValue}`;
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
  // if (word === 'vaults') {
  //   return customTerms?.bank || 'Vaults';
  // }
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
    return customTerms?.minion || 'Minion';
  }
  if (word === 'minions') {
    return customTerms?.minions || 'Minions';
  }
  if (word === 'nft gallery') {
    return 'NFT Gallery';
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

export const getTitle = (customTerms, word) => {
  if (!customTerms) {
    return capitalize(word);
  }

  if (getTerm(customTerms, word).toLowerCase() !== word.toLowerCase()) {
    return word;
  }
  return null;
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
    console.error(err);
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
    console.error(err);
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
    console.error(err);
  }
};

export const ipfsJsonPin = async (creds, obj) => {
  const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        pinata_api_key: creds.pinata_api_key,
        pinata_secret_api_key: creds.pinata_api_secret,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    });
    return response.json();
  } catch (err) {
    console.error(err);
  }
};

export const getIPFSPinata = async ({ hash }) => {
  const url = `https://daohaus.mypinata.cloud/ipfs/${hash}`;
  try {
    const res = await fetch(url);
    return res.json();
  } catch (error) {
    console.error(error);
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
    console.error(err);
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
    console.error(err);
  }
};

export const getForumTopics = async categoryId => {
  const url = `${metadataApiUrl}/dao/discourse-topics/${categoryId}`;

  try {
    const response = await fetch(url);

    return response.json();
  } catch (err) {
    console.error(err);
  }
};

export const getDateTime = async () => {
  try {
    const response = await fetch('https://data.daohaus.club/dao/get-utc');
    return response.json();
  } catch (err) {
    console.error(err);
  }
};

export const getNftMeta = async url => {
  try {
    const response = await fetch(url);

    return response.json();
  } catch (error) {
    console.error(error);
  }
};

export const updateProposalConfig = async (daoProposals, params) => {
  const {
    meta,
    injectedProvider,
    address,
    network,
    onError,
    onSuccess,
  } = params;

  const proposalConfig = omit(['devList'], daoProposals);
  if (!meta || !injectedProvider || !proposalConfig || !network)
    throw new Error('proposalConfig => handlePostNewConfig');
  try {
    const messageHash = injectedProvider.utils.sha3(meta.contractAddress);
    const signature = await injectedProvider.eth.personal.sign(
      messageHash,
      address,
    );
    const updateData = {
      proposalConfig,
      contractAddress: meta.contractAddress,
      network,
      signature,
    };
    const res = await put('dao/update', updateData);

    if (res.error) throw new Error(res.error);
    onSuccess?.(res, params);
    return true;
  } catch (error) {
    onError?.(error, params);
    console.error(error);
  }
};

export const addBoost = async ({
  meta,
  injectedProvider,
  address,
  network,
  boostData,
  proposalConfig,
  extraMetaData = {},
  onSuccess,
  onError,
}) => {
  const propConfig = proposalConfig && omit(['devList'], proposalConfig);
  if (!meta || !injectedProvider || !address || !network)
    throw new Error('proposalConfig => @ addBoost(), undefined param(s)');

  try {
    const messageHash = injectedProvider.utils.sha3(meta.contractAddress);
    const signature = await injectedProvider.eth.personal.sign(
      messageHash,
      address,
    );
    const updateData = {
      contractAddress: meta.contractAddress,
      network,
      boostKey: boostData.id,
      metadata: extraMetaData,
      signature,
    };

    if (propConfig) {
      const newPropConfig = addBoostPlaylist(propConfig, boostData.playlist);
      updateData.proposalConfig = newPropConfig;
    }

    const res = await boostPost('dao/boost', updateData);

    if (res.error)
      throw new Error(
        typeof res.error === 'string'
          ? res.error
          : 'API rejected playlist update',
      );
    onSuccess?.(res);
    return true;
  } catch (error) {
    onError?.(error);
  }
};

export const handleExtractBoosts = ({ daoMetaData, returnIDs = false }) => {
  const IDs = [
    ...new Set(
      Object.keys(daoMetaData.boosts).reduce((array, boostKey) => {
        if (BOOSTS[boostKey]) {
          return [...array, BOOSTS[boostKey].id];
        }
        return array;
      }, []),
    ),
  ];
  if (returnIDs) return IDs;
  return IDs.map(boostKey => BOOSTS[boostKey]);
};

export const handleRestorePlaylist = async params => {
  const { meta, playlist, proposalConfig, onError } = params;
  const isPlaylistType = checkIsPlaylist(playlist);
  const isMissingPlaylist = hasPlaylist(meta, playlist) === false;
  if (isPlaylistType && isMissingPlaylist) {
    const newProposalConfig = {
      ...proposalConfig,
      playlists: [...proposalConfig.playlists, playlist],
    };
    return updateProposalConfig(newProposalConfig, params);
  }
  if (!isPlaylistType) {
    console.log('Is Playlist:', checkIsPlaylist(playlist));
    console.log('params: ', params);

    onError?.(new Error('Playlist data does not match playlist model'), params);
  }
  if (!isMissingPlaylist) {
    console.log('Has Playlist', hasPlaylist(meta, playlist));
    console.log('params: ', params);
    onError?.(new Error('DAO already has playlist'), params);
  }
};
