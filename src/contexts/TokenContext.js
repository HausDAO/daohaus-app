import React, { useContext, createContext, useState } from "react";
import { addUSD } from "../utils/tokenValue";

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [currentDaoTokens, setCurrentDaoTokens] = useState(null);

  const initNewDao = async (chainID, graphTokenData) => {
    const newDaoData = await addUSD(chainID, graphTokenData);
    setCurrentDaoTokens(newDaoData);
  };

  return (
    <TokenContext.Provider value={{ initNewDao, currentDaoTokens }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const { initNewDao, currentDaoTokens } = useContext(TokenContext);
  return { initNewDao, currentDaoTokens };
};
