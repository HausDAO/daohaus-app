import React, { useContext, createContext } from "react";

export const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  return (
    <ContractContext.Provider value={{}}>{children}</ContractContext.Provider>
  );
};

export const useContract = () => {
  const {} = useContext(ContractContext);
  return {};
};
