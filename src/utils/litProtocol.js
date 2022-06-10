export const STANDARD_CONTRACT_TYPE = 'MolochDAOv2.1';
export const LIT_API_HOST = 'https://oauth-app.litgateway.com'; // TODO get lit protocol host endpoint
const AUTH_SIG_STORAGE_KEY = 'lit-auth-signature';

// https://developer.litprotocol.com/docs/LitTools/JSSDK/errorHandling
const LIT_DAO_HAUS_ERROR_MAP = [
  'missing_access_control_conditions',
  'incorrect_access_control_conditions',
  'storage_error',
  'resource_id_not_found',
  'encrypted_symmetric_key_not_found',
  'iat_outside_grace_period',
  'exp_wrong_or_too_large',
  'lit_node_client_not_ready',
  'invalid_unified_condition_type',
  'unknown_error',
];
const USER_ERROR_CODE_MAP = {
  no_wallet: 'You need a wallet to use the Lit Protocol',
  not_authorized: 'You are not authorized to view this page',
  access_control_conditions_check_failed:
    'there are issues with connecting to the current chain',
  invalid_auth_sig:
    'There was an issue with your authentication signature, please reauthenticate',
  rpc_error: 'There are issues talking to the chain, please try again later',
};

export const storeAuthSig = authSig => {
  localStorage.setItem(AUTH_SIG_STORAGE_KEY, JSON.stringify(authSig));
};

export const loadStoredAuthSig = () => {
  return JSON.parse(localStorage.getItem(AUTH_SIG_STORAGE_KEY));
};

export const googleLitSignOut = () => {
  return localStorage.removeItem(AUTH_SIG_STORAGE_KEY);
};

export const getAssetType = assetTypeScope => {
  if (assetTypeScope.includes('file')) {
    return 'file';
  } else if (assetTypeScope.includes('document')) {
    return 'document';
  } else if (assetTypeScope.includes('spreadsheets')) {
    return 'spreadsheets';
  } else if (assetTypeScope.includes('presentation')) {
    return 'presentation';
  } else if (assetTypeScope.includes('forms')) {
    return 'forms';
  }
  return assetTypeScope.split('google-apps.')[1];
};

const handleServerLitError = e => {
  if (e.code === 4001) {
    // redirect to lit oauth connect UI
    // window.location = 'https://litgateway.com/apps';
    return new Error('Could not connect to Lit Protocol');
  }

  if (e?.errorCode === 'wrong_network') {
    return new Error(e.message);
  }

  if (e?.errorCode in LIT_DAO_HAUS_ERROR_MAP) {
    console.error(e);
    return new Error('cannot process action');
  }

  if (e.errorCode in Object.keys(USER_ERROR_CODE_MAP)) {
    return new Error(USER_ERROR_CODE_MAP[e.errorCode]);
  } else {
    console.log(e);
    throw e;
  }
};

// export const loadLitProtocol = async () => {
//   // potentially build a client incorporate error handling
//   // https://developer.litprotocol.com/docs/LitTools/JSSDK/errorHandling
//   const client = new LitJsSdk.LitNodeClient();
//   await client.connect();
// };

// export const signLitAuth = async chain => {
//   try {
//     return await litProtocolClient.checkAndSignAuthMessage({
//       chain,
//     });
//     // storeAuthSig(currentAuthSig);
//     // setAuthSig(currentAuthSig);
//   } catch (e) {
//     return handleServerLitError(e);
//   }
// };

export const checkIfUserExists = async authSig => {
  try {
    // https://github.com/LIT-Protocol/lit-oauth/blob/51b6efc4c45ee6b0bf0ebfed4f8713c6c045b954/server/oauth/google.js#L104-L170
    const response = await fetch(
      `${LIT_API_HOST}/api/google/checkIfUserExists`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authSig,
        }),
      },
    );
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const getUserProfile = async authSig => {
  try {
    // https://github.com/LIT-Protocol/lit-oauth/blob/51b6efc4c45ee6b0bf0ebfed4f8713c6c045b954/server/oauth/google.js#L172-L194
    const response = await fetch(`${LIT_API_HOST}/api/google/getUserProfile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ authSig }),
    });

    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const getSharedGoogleDocs = async (authSig, idOnService) => {
  try {
    // https://github.com/LIT-Protocol/lit-oauth/blob/main/server/oauth/google.js#L196
    const response = await fetch(`${LIT_API_HOST}/api/google/getAllShares`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authSig,
        idOnService,
      }),
    });

    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const getSharedDaoGoogleDocs = async daoAddress => {
  try {
    // https://github.com/LIT-Protocol/lit-oauth/blob/main/server/oauth/google.js#L398
    const response = await fetch(`${LIT_API_HOST}/api/google/getDAOShares`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ daoAddress, source: 'daohaus' }),
    });

    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const handleLoadCurrentUser = async authSig => {
  const userInfo = await getUserProfile(authSig);
  // check for google drive scope and sign user out if scope is not present
  if (
    userInfo['scope'] &&
    userInfo['scope'].includes('https://www.googleapis.com/auth/drive.file')
  ) {
    const profileData = JSON.parse(userInfo.extraData);
    // if accessToken is necessary for certain calls (potentially "unshare" document)
    // const accessToken = profileData.accessToken; // if we need jwt access token for some api call
    const userProfile = {
      idOnService: userInfo.idOnService,
      email: userInfo.email,
      displayName: profileData.displayName,
      avatar: profileData.photoLink,
    };

    return userProfile;
  }
};
