import { EthereumAuthProvider, SelfID, WebClient } from '@self.id/web';
import { Core } from '@self.id/core';

import { Caip10Link } from '@ceramicnetwork/stream-caip10-link';

const ceramicNodeUrl = process.env.REACT_APP_CERAMIC_NODE_URL || 'testnet-clay';
const ceramicNetwork = process.env.REACT_APP_CERAMIC_NETWORK || 'testnet-clay';

export const authenticateDid = async address => {
  // Always associate current chain with mainnet
  // https://developers.ceramic.network/streamtypes/caip-10-link/api/#set-did-to-caip10link
  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0x1' }],
  });

  const authProvider = new EthereumAuthProvider(window.ethereum, address);
  const client = new WebClient({
    ceramic: ceramicNodeUrl,
    connectNetwork: ceramicNetwork,
  });
  let did = null;
  try {
    did = await client.authenticate(authProvider, true);

    const link = await Caip10Link.fromAccount(
      client.ceramic,
      `${address}@eip155:1`,
      {},
    );
    if (!link.did || link.did !== did.id) {
      await link.setDid(did, authProvider, {});
    }
  } catch (err) {
    console.error(err);
  }

  return [client, did];
};

export const getBasicProfile = async did => {
  const core = new Core({ ceramic: ceramicNodeUrl });
  return core.get('basicProfile', did);
};

export const setBasicProfile = async (client, did, values) => {
  const selfId = new SelfID({ client, did });
  return selfId.set('basicProfile', values);
};

const get3boxProfile = async address => {
  try {
    const response = await fetch(
      `https://ipfs.3box.io/profile?address=${address}`,
    );

    if (response.status === 'error' || response.status === 404) {
      console.warn('Profile does not exist');
      return null;
    }

    // boxProfile
    return await response.json();
  } catch (error) {
    console.warn(error);
  }
};

export const fetchProfile = async address => {
  try {
    const core = new Core({ ceramic: ceramicNodeUrl });
    const link = await Caip10Link.fromAccount(
      core.ceramic,
      `${address}@eip155:1`,
    );
    if (link.did) {
      const values = await getBasicProfile(link.did);
      if (values) {
        return values;
      }
    }
    return get3boxProfile(address);
  } catch (err) {
    console.error(err);
    return get3boxProfile(address);
  }
};

export const cacheProfile = (newProfile, memberAddress) => {
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

export const getCachedProfile = memberAddress => {
  const profileData = JSON.parse(window.sessionStorage.getItem('3BoxProfiles'));
  return profileData[memberAddress] ? profileData[memberAddress] : false;
};

export const ensureCacheExists = () => {
  const cacheExists = window.sessionStorage.getItem('3BoxProfiles');
  if (cacheExists) {
    return true;
  }
  try {
    window.sessionStorage.setItem('3BoxProfiles', JSON.stringify({}));
  } catch (error) {
    console.log('Sessions storage is full');
    console.log('clearing sessions storage');
    sessionStorage.clear();
  }
};

export const handleGetProfile = async memberAddress => {
  ensureCacheExists();
  const cachedProfile = getCachedProfile(memberAddress);
  if (cachedProfile) {
    return cachedProfile;
  }
  const newProfile = await fetchProfile(memberAddress);
  if (newProfile) {
    cacheProfile(newProfile, memberAddress);
  }
  return newProfile;
};
