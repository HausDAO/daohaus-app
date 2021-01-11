import React from "react";
import { useToken } from "../contexts/TokenContext";
import { tallyUSDs } from "../utils/tokenValue";

const BankTotal = () => {
  const { currentDaoTokens } = useToken();

  const bankTotal = currentDaoTokens ? tallyUSDs(currentDaoTokens) : "Loading";

  return <h3>{bankTotal}</h3>;
};

export default BankTotal;
