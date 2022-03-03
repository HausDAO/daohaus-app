// For some reason, I have to brin pipe in manually instead of importing it,
//  Otherwise I get a 'cannot import before utilization error'

export const firePlugins = ({ plugins, data }) => {
  plugins.forEach(plugin => plugin(data));
  return data.lego;
};

export const checkDuplicateKeys = data => {
  const { key, current } = data;
  if (current[key]) {
    throw new Error(`Key ${key} already exists!`);
  }
  return data;
};

export const checkRequiredFields = ({ typeModel, typeName }) => data => {
  const { lego, key } = data;
  const unfoundField = typeModel.find(
    modelField => lego[modelField] === undefined,
  );
  if (unfoundField) {
    throw new Error(
      `Error in ${key}: ${typeName} requires field ${unfoundField}`,
    );
  }
  return data;
};

export const validateLegos = ({ collections, plugins }) => {
  if (process.env.REACT_APP_DEV) {
    return collections.reduce(
      (acc, collection) => ({
        ...acc,
        ...Object.entries(collection).reduce(
          (childAcc, [legoKey, lego]) => ({
            ...childAcc,
            [legoKey]: firePlugins({
              plugins,
              data: {
                lego,
                collection,
                key: legoKey,
                current: acc,
                all: collections,
              },
            }),
          }),
          {},
        ),
      }),
      {},
    );
  }
  return collections.reduce((acc, collection) => ({ ...acc, ...collection }));
};
