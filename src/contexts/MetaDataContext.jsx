import React, {
  useContext,
  useState,
  createContext,
  useEffect,
  useRef,
  useReducer,
} from 'react';
import { useParams } from 'react-router-dom';

import { useCustomTheme } from './CustomThemeContext';
import { useUser } from './UserContext';
import { proposalConfigReducer } from '../reducers/proposalConfig';
import { fetchMetaData } from '../utils/metadata';

export const MetaDataContext = createContext();

export const MetaDataProvider = ({ children }) => {
  const { userHubDaos, refetchUserHubDaos } = useUser();
  const { updateTheme, resetTheme } = useCustomTheme();
  const { daoid, daochain } = useParams();

  const [customTerms, setCustomTerms] = useState(null);
  const [daoMetaData, setDaoMetaData] = useState(null);
  const [daoProposals, dispatchPropConfig] = useReducer(
    proposalConfigReducer,
    null,
  );

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
        if (daoMeta.customThemeConfig) {
          updateTheme(daoMeta.customThemeConfig);
        } else {
          resetTheme();
        }
        if (daoMeta.customTermsConfig) {
          setCustomTerms(daoMeta.customTermsConfig);
        }
        setDaoMetaData(daoMeta);
        dispatchPropConfig({ action: 'INIT', payload: daoMeta });
        shouldUpdateTheme.current = false;
      }
    }
  }, [userHubDaos, daochain, daoid]);

  useEffect(() => {
    const getApiMetadata = async () => {
      try {
        const [data] = await fetchMetaData(daoid);
        if (shouldUpdateTheme.current && !daoMetaData) {
          if (data.customThemeConfig) {
            updateTheme(data.customThemeConfig);
          } else {
            resetTheme();
          }
          if (data.customTermsConfig) {
            setCustomTerms(data.customTermsConfig);
          }
          setDaoMetaData(data);
          dispatchPropConfig({ action: 'INIT', payload: data });
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
        if (data.customThemeConfig) {
          updateTheme(data.customThemeConfig);
        } else {
          resetTheme();
        }
        if (data.customTermsConfig) {
          setCustomTerms(data.customTermsConfig);
        }

        setDaoMetaData(data);
        dispatchPropConfig({ action: 'INIT', payload: data });
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
        daoProposals,
        dispatchPropConfig,
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
    daoProposals,
    hasFetchedMetadata,
    dispatchPropConfig,
    shouldUpdateTheme,
    customTerms,
    refetchMetaData,
  } = useContext(MetaDataContext);
  return {
    daoMetaData,
    daoProposals,
    hasFetchedMetadata,
    dispatchPropConfig,
    shouldUpdateTheme,
    customTerms,
    refetchMetaData,
  };
};
