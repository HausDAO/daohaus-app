import React, {
  useContext,
  createContext,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

import { useParams } from "react-router-dom";

import { omit } from "../utils/general";
import { useSessionStorage } from "../hooks/useSessionStorage";
import { fetchMetaData, formatBoosts } from "../utils/metadata";
import { useCustomTheme } from "./CustomThemeContext";

export const MetaDataContext = createContext();

export const MetaDataProvider = ({ children }) => {
  const { updateTheme, resetTheme } = useCustomTheme();
  const { daoid } = useParams();

  const [daoBoosts, setDaoBoosts] = useSessionStorage(`boosts-${daoid}`, null);
  const [daoMetadata, setMetaData] = useSessionStorage(
    `metaData=${daoid}`,
    null
  );
  const [daoCustomTheme, setCustomTheme] = useSessionStorage(
    `customTheme=${daoid}`,
    null
  );

  const hasFetched = useRef(false);
  const shouldUpdateTheme = useRef(true);

  useEffect(() => {
    const InitMetaData = async () => {
      try {
        const payload = await fetchMetaData(`dao/${daoid}`);
        if (payload.boosts) {
          const boosts = formatBoosts(payload.boosts);
          if (boosts.customTheme) {
            setCustomTheme(boosts.customTheme);
            shouldUpdateTheme.current = true;
          } else {
            shouldUpdateTheme.current = true;
            setCustomTheme("No Theme");
          }
          setDaoBoosts(boosts);
        }
        setMetaData(omit("boosts", payload));
      } catch (error) {
        console.error(error);
      }
    };

    if (!hasFetched.current && !daoMetadata) {
      InitMetaData();
      hasFetched.current = true;
    }
  }, [
    daoid,
    setDaoBoosts,
    daoMetadata,
    setMetaData,
    setCustomTheme,
    updateTheme,
    resetTheme,
  ]);

  //This synchronously checks if we have theme metadata in session storage, changes the theme accordingly
  //then resets or updates ChakraContext before we render the rest of the component tree.

  //This is slower and messier than I would like, but it prevents async calls and renenders.
  useLayoutEffect(() => {
    if (shouldUpdateTheme.current && daoCustomTheme === "No Theme") {
      resetTheme();
      shouldUpdateTheme.current = false;
    } else if (shouldUpdateTheme.current && daoCustomTheme) {
      updateTheme(daoCustomTheme);
      shouldUpdateTheme.current = false;
    }
  }, [daoCustomTheme, updateTheme, resetTheme]);

  return (
    <MetaDataContext.Provider
      value={{ daoMetadata, daoBoosts, daoCustomTheme }}
    >
      {children}
    </MetaDataContext.Provider>
  );
};

export const useMetaData = () => {
  const { daoMetadata, daoBoosts, daoCustomTheme } = useContext(
    MetaDataContext
  );
  return { daoMetadata, daoBoosts, daoCustomTheme };
};
