import React from "react";
import { useToken } from "../contexts/TokenContext";
import { HeaderMd } from "../styles/typography";
import { tallyUSDs } from "../utils/tokenValue";

const BankTotal = () => {
  const { currentDaoTokens } = useToken();

  const bankTotal = currentDaoTokens ? tallyUSDs(currentDaoTokens) : "Loading";

  return <HeaderMd>{bankTotal}</HeaderMd>;
};

export default BankTotal;
