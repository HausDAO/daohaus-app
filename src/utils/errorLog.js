import { v4 as uuidv4 } from 'uuid';

const projectId = 'daohaus-err-log';
const posturl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/errors`;

export const testGetData = async () => {
  try {
    const res = await fetch(posturl);
    const json = await res.json();
    console.log(json.documents);
  } catch (error) {
    console.log(error);
  }
};

export const postError = async (data, id) => {
  try {
    await fetch(`${posturl}?documentId=${id}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    });
  } catch (error) {
    console.error(`POST ERROR: ${error}`);
  }
};

const createError = (errData, id) => {
  const { caughtAt, errMsg, daoAddress, type, priority, userAddress } = errData;

  const firestoreError = {
    fields: {
      created: { integerValue: Date.now() },
      data: { stringValue: JSON.stringify(errData) },
      id: { stringValue: id },
    },
  };

  if (type) {
    firestoreError.fields.type = { stringValue: type };
  }
  if (errMsg) {
    firestoreError.fields.errMsg = { stringValue: errMsg };
  }
  if (userAddress) {
    firestoreError.fields.userAddress = {
      stringValue: userAddress.toLowerCase(),
    };
  }
  if (daoAddress) {
    firestoreError.fields.daoAddress = {
      stringValue: daoAddress.toLowerCase(),
    };
  }
  if (priority) {
    firestoreError.fields.priority = { integerValue: priority };
  }
  if (caughtAt) {
    firestoreError.fields.caughtAt = { stringValue: caughtAt };
  }

  return firestoreError;
};

export const LogError = async data => {
  const id = uuidv4();
  try {
    const errData = createError(data, id);
    console.log(errData);
    await postError(errData, id);
  } catch (error) {
    console.error('ERROR LOG FAILED: ', error);
  }
};
