import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import { useParams } from 'react-router-dom';

import { useDao } from './DaoContext';
import { addContractVals, initTokenData } from '../utils/tokenValue';

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  // If we're seeing too many rerenders we can bring daoOverview in
  // as props and React.memo the data.
  const { daoOverview } = useDao();

  const { daochain } = useParams();
  const [tokenPrices, setTokenPrices] = useState(null);
  const [currentDaoTokens, setCurrentDaoTokens] = useState(null);

  const shouldFetchInit = useRef(true);
  const shouldFetchContract = useRef(true);

  // first fetch API USD values to get fast bank balance
  useEffect(() => {
    const initDaoTokens = async () => {
      const newDaoData = await initTokenData(
        daochain,
        daoOverview.tokenBalances,
        setTokenPrices,
      );

      setCurrentDaoTokens(newDaoData);
      shouldFetchInit.current = false;
    };
    if (daoOverview?.tokenBalances && daochain && shouldFetchInit.current) {
      initDaoTokens();
    }
  }, [daoOverview, daochain]);

  // then fetch contract values for more exact amount.
  useEffect(() => {
    const getContractValues = async () => {
      const withContractValues = await addContractVals(
        currentDaoTokens,
        daochain,
      );
      setCurrentDaoTokens(withContractValues);
    };
    if (currentDaoTokens && shouldFetchContract.current) {
      shouldFetchContract.current = false;
      getContractValues();
    }
  }, [currentDaoTokens, daochain]);

  const refetchTokens = async () => {
    const newDaoData = await initTokenData(daochain, daoOverview.tokenBalances);
    setCurrentDaoTokens(newDaoData);
    shouldFetchContract.current = true;
  };

  const getTokenPrice = tokenAddress => {
    if (tokenPrices && tokenAddress) {
      return tokenPrices[tokenAddress]?.price || null;
    }
  };

  return (
    <TokenContext.Provider
      value={{
        currentDaoTokens,
        shouldFetchInit,
        shouldFetchContract,
        tokenPrices,
        refetchTokens,
        getTokenPrice,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const {
    currentDaoTokens,
    shouldFetchInit,
    shouldFetchContract,
    getTokenPrice,
  } = useContext(TokenContext);
  return {
    currentDaoTokens,
    shouldFetchInit,
    shouldFetchContract,
    getTokenPrice,
  };
};
