export const STANDARD_CONTRACT_TYPE = 'MolochDAOv2.1';
export const LIT_API_HOST = ''; // TODO get lit protocol host endpoint

const AUTH_SIG_STORAGE_KEY = 'lit-protocol-auth-sig';

export const storeAuthSig = authSig => {
  localStorage.setItem(AUTH_SIG_STORAGE_KEY, JSON.stringify(authSig));
};

export const loadStoredAuthSig = () => {
  return JSON.parse(localStorage.getItem(AUTH_SIG_STORAGE_KEY));
};

export const checkIfUserExists = async authSig => {
  // https://github.com/LIT-Protocol/lit-oauth/blob/51b6efc4c45ee6b0bf0ebfed4f8713c6c045b954/server/oauth/google.js#L104-L170
  try {
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
  // https://github.com/LIT-Protocol/lit-oauth/blob/51b6efc4c45ee6b0bf0ebfed4f8713c6c045b954/server/oauth/google.js#L172-L194
  try {
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

export const getAllSharedGoogleDocs = async (authSig, idOnService) => {
  try {
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

export const handleLoadCurrentUser = async authSig => {
  const userInfo = await getUserProfile(authSig);
  // check for google drive scope and sign user out if scope is not present
  if (
    userInfo.data['scope'] &&
    userInfo.data['scope'].includes(
      'https://www.googleapis.com/auth/drive.file',
    )
  ) {
    const profileData = JSON.parse(userInfo.data.extraData);
    // if accessToken is necessary for certain calls (potentially "unshare" document)
    // const accessToken = profileData.accessToken; // if we need jwt access token for some api call
    const userProfile = {
      idOnService: userInfo.data.idOnService,
      email: userInfo.data.email,
      displayName: profileData.displayName,
      avatar: profileData.photoLink,
    };

    await getAllSharedGoogleDocs(authSig, userProfile.idOnService);
  }
};
