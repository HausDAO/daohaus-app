import React, {
  useContext,
  useState,
  createContext,
  useEffect,
  useRef,
} from 'react';

import { useParams } from 'react-router-dom';
import { fetchMetaData } from '../utils/metadata';

import { useCustomTheme } from './CustomThemeContext';
import { useUser } from './UserContext';

export const MetaDataContext = createContext();

export const MetaDataProvider = ({ children }) => {
  const { userHubDaos, refetchUserHubDaos } = useUser();
  const { updateTheme, resetTheme } = useCustomTheme();
  const { daoid, daochain } = useParams();

  const [customCopy, setCustomCopy] = useState(null);
  const [daoMetaData, setDaoMetaData] = useState(null);
  const [apiMetaData, setApiMetaData] = useState(null);

  const hasFetchedMetadata = useRef(false);
  const shouldUpdateTheme = useRef(true);

  const getApiMetadata = async () => {
    try {
      const data = await fetchMetaData(daoid);
      setApiMetaData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userHubDaos) {
      const daoMeta = userHubDaos
        ?.find((network) => network.networkID === daochain)
        ?.data.find((dao) => {
          return dao.meta?.contractAddress === daoid;
        })?.meta;

      setDaoMetaData(daoMeta);
    }
  }, [userHubDaos, daochain, daoid]);

  useEffect(() => {
    if (daoMetaData?.customTheme) {
      updateTheme(daoMetaData.customTheme);
      if (daoMetaData?.customTheme?.daoMeta) {
        setCustomCopy({
          ...daoMetaData.customTheme.daoMeta,
          name: daoMetaData.name,
        });
      }
    } else {
      resetTheme();
    }
  }, [daoMetaData]);

  useState(() => {
    if (daoid) {
      getApiMetadata();
    }
  }, [daoid]);

  const refetchMetaData = () => {
    getApiMetadata();
    refetchUserHubDaos();
  };

  return (
    <MetaDataContext.Provider
      value={{
        daoMetaData,
        customCopy,
        hasFetchedMetadata,
        shouldUpdateTheme,
        apiMetaData,
        refetchMetaData,
      }}
    >
      {children}
    </MetaDataContext.Provider>
  );
};

export const useMetaData = () => {
  const {
    daoMetaData,
    hasFetchedMetadata,
    shouldUpdateTheme,
    customCopy,
    apiMetaData,
    refetchMetaData,
  } = useContext(MetaDataContext);
  return {
    daoMetaData,
    hasFetchedMetadata,
    shouldUpdateTheme,
    customCopy,
    apiMetaData,
    refetchMetaData,
  };
};
