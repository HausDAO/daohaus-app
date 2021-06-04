import React, { useContext, createContext, useEffect } from 'react';

import { useSessionStorage } from '../hooks/useSessionStorage';
import { EXPLORER_DAOS } from '../graphQL/explore-queries';
import { getApiMetadata } from '../utils/metadata';
import { daosqaureCcoQuery } from '../utils/theGraph';

export const DaosquareContext = createContext();

export const DaosquareContextProvider = ({ children }) => {
  const [d2CcoDaos, setD2CcoDaos] = useSessionStorage('daosquareCco', null);

  useEffect(() => {
    daosqaureCcoQuery({
      query: EXPLORER_DAOS,
      apiFetcher: getApiMetadata,
      reactSetter: setD2CcoDaos,
    });
  }, []);

  return (
    <DaosquareContext.Provider
      value={{
        d2CcoDaos,
      }}
    >
      {children}
    </DaosquareContext.Provider>
  );
};

export const useDaosquareCco = () => {
  const { d2CcoDaos } = useContext(DaosquareContext);
  return {
    d2CcoDaos,
  };
};
