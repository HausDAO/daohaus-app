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
  const { userHubDaos } = useUser();
  const { updateTheme, resetTheme } = useCustomTheme();
  const { daoid, daochain } = useParams();

  const [customCopy, setCustomCopy] = useState(null);
  const [daoMetaData, setDaoMetaData] = useState(null);
  const [apiMetaData, setApiMetaData] = useState(null);

  const hasFetchedMetadata = useRef(false);
  const shouldUpdateTheme = useRef(true);

  useEffect(() => {
    if (userHubDaos) {
      const daoMeta = userHubDaos
        ?.find((network) => network.networkID === daochain)
        ?.data.find((dao) => dao.meta.contractAddress === daoid)?.meta;
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
    const getApiMetadata = async () => {
      try {
        const data = await fetchMetaData(daoid);
        setApiMetaData(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (daoid) {
      getApiMetadata();
    }
  }, [daoid]);

  return (
    <MetaDataContext.Provider
      value={{
        daoMetaData,
        customCopy,
        hasFetchedMetadata,
        shouldUpdateTheme,
        apiMetaData,
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
  } = useContext(MetaDataContext);
  return {
    daoMetaData,
    hasFetchedMetadata,
    shouldUpdateTheme,
    customCopy,
    apiMetaData,
  };
};
