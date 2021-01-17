import React, { useContext, createContext } from "react";
import { useLocalDaoData } from "./DaoContext";
import { useMetaData } from "./MetaDataContext";
import { useToken } from "./TokenContext";

export const TXContext = createContext();

export const TXProvider = ({ children }) => {
  const { hasPerformedBatchQuery, currentMember, refetch } = useLocalDaoData();
  const { hasFetchedMetadata, shouldUpdateTheme } = useMetaData();
  const { shouldFetchInit, shouldFetchContract } = useToken();

  const refreshDao = () => {
    //I use useRef to stop excessive rerenders in most of the contexts
    //I need to reset them in order to prevent them from locking up
    //the rerendering flow

    //DaoContext
    hasPerformedBatchQuery.current = false;
    currentMember.current = false;
    //TokenContext
    shouldFetchInit.current = true;
    shouldFetchContract.current = true;
    //MetadataContext
    hasFetchedMetadata.current = false;
    shouldUpdateTheme.current = true;

    //Now, I call rerender on DaoContext, which should re-fetch all the graphQueries
    //This should get up all the up to date data from the Graph and spread across the
    //entire component tree. It should also recache the new data automatically
    refetch();
  };

  return (
    <TXContext.Provider value={{ refreshDao }}>{children}</TXContext.Provider>
  );
};

export const useTX = () => {
  const { refreshDao } = useContext(TXContext);
  return { refreshDao };
};
