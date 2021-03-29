import { gql } from 'apollo-boost';
import { graphQuery } from './apollo';

const ensClient =
  'https://api.thegraph.com/subgraphs/name/ezynda3/ens-subgraph';

const REVERSE_RESOLVER_QUERY = gql`
  query reverseRegistrations($user: String!) {
    reverseRegistrations(where: { registrant: $user }) {
      name
      block
    }
  }
`;

export const getENS = async (address) => {
  const result = await graphQuery({
    endpoint: ensClient,
    query: REVERSE_RESOLVER_QUERY,
    variables: {
      user: address.toLowerCase(),
    },
  });
  if (result.reverseRegistrations.length) {
    // look into dealing with multiple. get most recent
    return result.reverseRegistrations.sort((a, b) => b.block - a.block)[0]
      .name;
  }
  return null;
};

export const fetchProfile = async (address) => {
  let ens = null;
  try {
    ens = await getENS(address);
  } catch (err) {
    console.log(err);
  }

  try {
    const response = await fetch(
      `https://ipfs.3box.io/profile?address=${address}`,
    );
    if (response.status === 'error') {
      console.log('Profile does not exist');
    }
    const boxProfile = await response.json();
    console.log(ens);
    return { ...boxProfile, ens: ens };
  } catch (error) {
    console.log(error);
    return { ens };
  }
};

export const cacheProfile = (newProfile, memberAddress) => {
  if (!newProfile) {
    throw new Error('Did not recieve a profile to cache');
  }
  const profileCache = JSON.parse(
    window.sessionStorage.getItem('3BoxProfiles'),
  );
  const newCache = JSON.stringify({
    ...profileCache,
    [memberAddress]: newProfile,
  });
  try {
    window.sessionStorage.setItem('3BoxProfiles', newCache);
  } catch (error) {
    console.log('Session storage is full');
    console.log('clearing session storage');
    sessionStorage.clear();
  }
};

export const getCachedProfile = (memberAddress) => {
  const profileData = JSON.parse(window.sessionStorage.getItem('3BoxProfiles'));
  return profileData[memberAddress] ? profileData[memberAddress] : false;
};

export const ensureCacheExists = () => {
  const cacheExists = window.sessionStorage.getItem('3BoxProfiles');
  if (cacheExists) {
    return true;
  } else {
    try {
      window.sessionStorage.setItem('3BoxProfiles', JSON.stringify({}));
    } catch (error) {
      console.log('Sessions storage is full');
      console.log('clearing sessions storage');
      sessionStorage.clear();
    }
  }
};

export const handleGetProfile = async (memberAddress) => {
  ensureCacheExists();
  const cachedProfile = getCachedProfile(memberAddress);
  if (cachedProfile) {
    return cachedProfile;
  } else {
    const newProfile = await fetchProfile(memberAddress);
    cacheProfile(newProfile, memberAddress);
    return newProfile;
  }
};
