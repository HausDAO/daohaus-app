import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useParams } from "react-router-dom";
import { initTokenData, addContractVals } from "../utils/tokenValue";
import { useLocalDaoData } from "./DaoContext";

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  //If we're seeing too many rerenders we can bring daoOverview in
  // as props and React.memo the data.
  const { daoOverview } = useLocalDaoData();

  const { daochain } = useParams();
  const [currentDaoTokens, setCurrentDaoTokens] = useState(null);

  const shouldFetchInit = useRef(true);
  const shouldFetchContract = useRef(true);

  //first fetch API USD values to get fast bank balance
  useEffect(() => {
    const initDaoTokens = async () => {
      const newDaoData = await initTokenData(
        daochain,
        daoOverview.tokenBalances
      );
      setCurrentDaoTokens(newDaoData);
      shouldFetchInit.current = false;
    };
    if (daoOverview?.tokenBalances && daochain && shouldFetchInit.current) {
      initDaoTokens(daochain);
    }
  }, [daoOverview, daochain]);

  //then fetch contract values for more exact amount.
  useEffect(() => {
    const getContractValues = async () => {
      const withContractValues = await addContractVals(
        currentDaoTokens,
        daochain
      );
      setCurrentDaoTokens(withContractValues);
      shouldFetchContract.current = false;
    };
    if (currentDaoTokens && shouldFetchContract.current) {
      getContractValues();
    }
  }, [currentDaoTokens, daochain]);

  return (
    <TokenContext.Provider
      value={{ currentDaoTokens, shouldFetchInit, shouldFetchContract }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const { currentDaoTokens, shouldFetchInit, shouldFetchContract } = useContext(
    TokenContext
  );
  return { currentDaoTokens, shouldFetchInit, shouldFetchContract };
};
