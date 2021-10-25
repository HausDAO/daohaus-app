import Ceramic from '@ceramicnetwork/http-client';
import { ThreeIdConnect, EthereumAuthProvider } from '@3id/connect';
import { DataModel } from '@glazed/datamodel';
import { DIDDataStore } from '@glazed/did-datastore';
import { model as publishedBasicProfileModel } from '@datamodels/identity-profile-basic';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import { DID } from 'dids';

const ceramicInstance = new Ceramic('https://ceramic-clay.3boxlabs.com');

export const getCeramic = () => {
  try {
    const resolver = {
      ...ThreeIdResolver.getResolver(ceramicInstance),
    };
    const did = new DID({ resolver });
    ceramicInstance.did = did;
    return ceramicInstance;
  } catch (err) {
    console.log(err);
  }
};

export const authenticateDid = async address => {
  const ceramic = getCeramic();

  console.log(address);
  console.log(window.ethereum);
  const threeIdConnect = new ThreeIdConnect();
  const authProvider = new EthereumAuthProvider(window.ethereum, address);
  await threeIdConnect.connect(authProvider);
  const provider = await threeIdConnect.getDidProvider();
  await ceramic.did.setProvider(provider);
  console.log('authenticating');
  await ceramic.did.authenticate();
  console.log('authenticated');

  return ceramic;
};

export const getBasicProfile = async ceramic => {
  const model = new DataModel({ ceramic, model: publishedBasicProfileModel });
  // const schemaURL = model.getSchemaURL('BasicProfile');
  const dataStore = new DIDDataStore({ ceramic, model });
  await dataStore.set('basicProfile', { record: 'content' }); // Expected schema error
  return dataStore.get('basicProfile');
};

export const fetchProfile = async address => {
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
