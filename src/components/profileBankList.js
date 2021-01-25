import React, { useEffect, useState } from "react";
import { initTokenData } from "../utils/tokenValue";
import BankList from "./BankList";

const ProfileBankList = ({ tokenData }) => {
  const [memberTokens, setMemberTokens] = useState(null);

  useEffect(() => {
    const handleGetTokens = async () => {
      try {
        const tokens = await initTokenData(tokenData);
        if (tokens) {
          setMemberTokens(tokens);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (tokenData && !memberTokens) {
      handleGetTokens();
    }
  }, [memberTokens, tokenData]);

  return (
    <>
      <BankList tokens={memberTokens} />
    </>
  );
};

export default ProfileBankList;
