import React from "react";
import { useToken } from "../contexts/TokenContext";
import { tallyUSDs } from "../utils/tokenValue";

const BankTotal = ({ customBank }) => {
  const { currentDaoTokens } = useToken();

  const bankTotal = currentDaoTokens ? tallyUSDs(currentDaoTokens) : "Loading";
  const bankLabel = customBank ? customBank : "Bank";
  return (
    <div>
      <h4>{bankLabel}:</h4>
      <h3>{bankTotal}</h3>
    </div>
  );
};

export default BankTotal;
