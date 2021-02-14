// const webAPIKey = 'AIzaSyADOdVxsMq90sQXPZv2gZlcfla-yXgBH5E';
const projectId = 'daohaus-err-log';

const posturl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/errors`;

// export const testGetData = async () => {
//   try {
//     const res = await fetch(url);
//     const json = await res.json();
//     console.log(json.documents);
//   } catch (error) {
//     console.log(error);
//   }
// };

export const postError = async (data) => {
  try {
    await fetch(posturl, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    });
  } catch (error) {
    console.error(`POST ERROR: ${error}`);
  }
};

const createError = ({
  at,
  errMsg,
  type,
  priority,
  userAddress,
  formData,
  TxArgs,
  contextData,
  hash,
}) => {
  const firestoreError = {
    fields: {
      created: { timestampValue: new Date() },
    },
  };

  if (type) {
    firestoreError.fields.type = { stringValue: type };
  }
  if (errMsg) {
    firestoreError.fields.errMsg = { stringValue: errMsg };
  }
  if (userAddress) {
    firestoreError.fields.userAddress = { stringValue: userAddress };
  }
  if (priority) {
    firestoreError.fields.priority = { stringValue: priority.toString() };
  }
  if (at) {
    firestoreError.fields.at = { stringValue: at };
  }
  if (TxArgs) {
    firestoreError.fields.TxArgs = { stringValue: JSON.stringify(TxArgs) };
  }
  if (formData) {
    firestoreError.fields.formData = { stringValue: JSON.stringify(formData) };
  }
  if (contextData) {
    firestoreError.fields.contextData = {
      stringValue: JSON.stringify(contextData),
    };
  }
  if (hash) {
    firestoreError.fields.hash = { stringValue: hash };
  }
  return firestoreError;
};

export const LogError = async (data) => {
  try {
    const errData = createError(data);
    console.log(errData);
    await postError(errData);
  } catch (error) {
    console.error('ERROR LOG FAILED: ', error);
  }
};
