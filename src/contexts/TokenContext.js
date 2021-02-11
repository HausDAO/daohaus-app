import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import { useParams } from 'react-router-dom';
import { addContractVals, initTokens } from '../utils/tokenValue';
import { useDao } from './DaoContext';

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  // If we're seeing too many rerenders we can bring daoOverview in
  // as props and React.memo the data.
  const { daoOverview } = useDao();

  const { daochain } = useParams();
  const [currentDaoTokens, setCurrentDaoTokens] = useState(null);

  const shouldFetchInit = useRef(true);
  const shouldFetchContract = useRef(true);

  // first fetch API USD values to get fast bank balance
  useEffect(() => {
    const initDaoTokens = async () => {
      const newDaoData = await initTokens(daoOverview.tokenBalances);
      setCurrentDaoTokens(newDaoData);
      shouldFetchInit.current = false;
    };
    console.log('daoOverview in TokenContext', daoOverview);
    if (daoOverview?.tokenBalances && daochain && shouldFetchInit.current) {
      console.log('fetching');
      initDaoTokens(daochain);
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
      shouldFetchContract.current = false;
    };
    if (currentDaoTokens && shouldFetchContract.current) {
      getContractValues();
    }
  }, [currentDaoTokens, daochain]);

  const refetchTokens = async () => {
    const newDaoData = await initTokens(daoOverview.tokenBalances);
    setCurrentDaoTokens(newDaoData);
    shouldFetchContract.current = true;
  };

  return (
    <TokenContext.Provider
      value={{
        currentDaoTokens,
        shouldFetchInit,
        shouldFetchContract,
        refetchTokens,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const { currentDaoTokens, shouldFetchInit, shouldFetchContract } = useContext(
    TokenContext,
  );
  return {
    currentDaoTokens,
    shouldFetchInit,
    shouldFetchContract,
  };
};
