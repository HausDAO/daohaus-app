import React, {
  useContext,
  useState,
  createContext,
  useEffect,
  useRef,
} from 'react';

import { useParams } from 'react-router-dom';
import { daosquareCcoTheme } from '../themes/defaultTheme';
import { fetchMetaData } from '../utils/metadata';

import { useCustomTheme } from './CustomThemeContext';
import { useUser } from './UserContext';

export const MetaDataContext = createContext();

export const MetaDataProvider = ({ children }) => {
  const { userHubDaos, refetchUserHubDaos } = useUser();
  const { updateTheme, resetTheme } = useCustomTheme();
  const { daoid, daochain } = useParams();

  const [customTerms, setCustomTerms] = useState(null);
  const [daoMetaData, setDaoMetaData] = useState(null);

  const hasFetchedMetadata = useRef(false);
  const shouldUpdateTheme = useRef(true);

  //  We're essentially calling the same function 3 times here.
  //  I have to keep them separate so that the useEffect has
  //  access to relevant state. I can investigate the useCallback/Effect pattern
  //  of handling this in the future.

  useEffect(() => {
    if (userHubDaos) {
      const daoMeta = userHubDaos
        ?.find(network => network.networkID === daochain)
        ?.data.find(dao => {
          return dao.meta?.contractAddress === daoid;
        })?.meta;

      if (daoMeta && shouldUpdateTheme.current) {
        if (daoMeta.customTheme) {
          updateTheme(daoMeta.customTheme);
        } else if (daoMeta.daosquarecco) {
          updateTheme(daosquareCcoTheme);
        } else {
          resetTheme();
        }
        if (daoMeta.customTerms) {
          setCustomTerms(daoMeta.customTerms);
        }
        setDaoMetaData(daoMeta);
        shouldUpdateTheme.current = false;
      }
    }
  }, [userHubDaos, daochain, daoid]);

  useEffect(() => {
    const getApiMetadata = async () => {
      try {
        const [data] = await fetchMetaData(daoid);
        if (shouldUpdateTheme.current && !daoMetaData) {
          if (data.customTheme) {
            updateTheme(data.customTheme);
          } else if (data.daosquarecco) {
            updateTheme(daosquareCcoTheme);
          } else {
            resetTheme();
          }
          if (data.customTerms) {
            setCustomTerms(data.customTerms);
          }
          setDaoMetaData(data);
          shouldUpdateTheme.current = false;
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (daoid) {
      getApiMetadata();
    }
  }, [daoid]);

  const fetchApiMetadata = async () => {
    try {
      const [data] = await fetchMetaData(daoid);
      if (shouldUpdateTheme.current && !daoMetaData) {
        if (data.customTheme) {
          updateTheme(data.customTheme);
        } else if (data.daosquarecco) {
          updateTheme(daosquareCcoTheme);
        } else {
          resetTheme();
        }
        if (data.customTerms) {
          setCustomTerms(data.customTerms);
        }
        setDaoMetaData(data);
        shouldUpdateTheme.current = false;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const refetchMetaData = () => {
    shouldUpdateTheme.current = true;
    fetchApiMetadata();
    refetchUserHubDaos();
  };

  return (
    <MetaDataContext.Provider
      value={{
        daoMetaData,
        customTerms,
        hasFetchedMetadata,
        shouldUpdateTheme,
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
    customTerms,
    refetchMetaData,
  } = useContext(MetaDataContext);
  return {
    daoMetaData,
    hasFetchedMetadata,
    shouldUpdateTheme,
    customTerms,
    refetchMetaData,
  };
};
