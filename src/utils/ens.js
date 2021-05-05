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

const fetchENS = async address => {
  try {
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

    return false;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getCachedENS = address => {
  const ensData = JSON.parse(window.sessionStorage.getItem('ensCache'));
  return ensData[address] ? ensData[address] : false;
};

export const cacheENS = (ens, address) => {
  const ensCache = JSON.parse(window.sessionStorage.getItem('ensCache'));
  const newCache = JSON.stringify({ ...ensCache, [address]: ens });
  try {
    window.sessionStorage.setItem('ensCache', newCache);
  } catch (error) {
    console.log('Session storage is full');
    console.log('clearing session storage');
    sessionStorage.clear();
  }
};

export const ensureENSCacheExists = () => {
  const cacheExists = window.sessionStorage.getItem('ensCache');
  if (cacheExists) {
    return true;
  }
  try {
    window.sessionStorage.setItem('ensCache', JSON.stringify({}));
  } catch (error) {
    console.log('Sessions storage is full');
    console.log('clearing sessions storage');
    sessionStorage.clear();
  }
};

export const handleGetENS = async address => {
  ensureENSCacheExists();
  const cachedENS = getCachedENS(address);
  if (cachedENS) {
    return cachedENS;
  }
  const ens = await fetchENS(address);
  cacheENS(ens, address);
  return ens;
};
