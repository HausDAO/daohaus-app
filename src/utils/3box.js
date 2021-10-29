import Ceramic from '@ceramicnetwork/http-client';
import { DataModel } from '@glazed/datamodel';
import { DIDDataStore } from '@glazed/did-datastore';
import { model as publishedBasicProfileModel } from '@datamodels/identity-profile-basic';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import { DID } from 'dids';
import { EthereumAuthProvider, SelfID, WebClient } from '@self.id/web';
import { Core } from '@self.id/core';

import { Caip10Link } from '@ceramicnetwork/stream-caip10-link';

export const authenticateDid = async address => {
  const authProvider = new EthereumAuthProvider(window.ethereum, address);
  const client = new WebClient({
    ceramic: 'testnet-clay',
    connectNetwork: 'testnet-clay',
  });
  const did = await client.authenticate(authProvider, true);
  // Always associate current chain with mainnet
  // https://developers.ceramic.network/streamtypes/caip-10-link/api/#set-did-to-caip10link

  return [client, did];
};

export const getAuthenticatedBasicProfile = async (client, did) => {
  const self = new SelfID({ client, did });
  return self.get('basicProfile');
};

export const getBasicProfile = async did => {
  const core = new Core({ ceramic: 'testnet-clay' });
  return await core.get('basicProfile', did);
};

export const setBasicProfile = async (client, did, values) => {
  const selfId = new SelfID({ client, did });
  console.log(did);
  return await selfId.set('basicProfile', values);
};

export const fetchProfile = async address => {
  console.log('Fetching profile');
  // Try fetch if exists return
  // getAccountDid
  const core = new Core({ ceramic: 'testnet-clay' });
  const ethAuthProvider = new EthereumAuthProvider(window.ethereum, address);
  const accountId = await ethAuthProvider.accountId();
  const link = await Caip10Link.fromAccount(core.ceramic, accountId);

  const values = await getBasicProfile(link.did);
  console.log('values');
  console.log(values);
  if (values) {
    return values;
  }
  try {
    const response = await fetch(
      `https://ipfs.3box.io/profile?address=${address}`,
    );
    if (response.status === 'error') {
      console.log('Profile does not exist');
    }

    const boxProfile = response.json();
    return boxProfile;
  } catch (error) {
    console.log(error);
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
