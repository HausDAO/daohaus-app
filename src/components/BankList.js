import React from "react";
import { Image } from "@chakra-ui/react";

import { useToken } from "../contexts/TokenContext";
import { numberWithCommas } from "../utils/general";

const BankList = () => {
  const { currentDaoTokens } = useToken();

  return (
    <div>
      {currentDaoTokens &&
        Object.values(currentDaoTokens).map((token) => {
          return (
            <div key={token.id}>
              <p>{token.symbol}</p>
              {token.logoUri && (
                <Image src={token.logoUri} height="35px" mr="15px" />
              )}
              <p>
                Balance:{" "}
                {parseFloat(
                  +token.tokenBalance / 10 ** +token.decimals
                ).toFixed(4)}{" "}
                {token.symbol}
              </p>
              <p>Price: ${token.usd}</p>
              <p>Value: ${token.totalUSD}</p>
            </div>
          );
        })}
    </div>
  );
};

export default BankList;
