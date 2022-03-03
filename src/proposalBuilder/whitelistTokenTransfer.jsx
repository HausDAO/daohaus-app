import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { AsyncCardTransfer } from './proposalBriefPrimitives';
import { Bold, ParaMd } from '../components/typography';

import { createContract } from '../utils/contract';
import { LOCAL_ABI } from '../utils/abi';

//  THIS IS A CUSTOM COMPONENT THAT ONLY WORKS FOR WHITELIST TOKEN PROPOSALS

const WhitelistTokenTransfer = ({ proposal = {} }) => {
  const { daochain } = useParams();
  const { tributeToken } = proposal;

  const [tokenData, setTokenData] = useState(null);

  useEffect(() => {
    const fetchTokenData = async () => {
      const tokenContract = createContract({
        address: tributeToken,
        abi: LOCAL_ABI.ERC_20,
        chainID: daochain,
      });

      try {
        const symbol = await tokenContract.methods.symbol().call();
        const name = await tokenContract.methods.name().call();
        const data = { symbol, name };
        setTokenData(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (tributeToken) {
      fetchTokenData();
    }
  }, [tributeToken, daochain]);

  const tokenUI = (
    <ParaMd>
      Whitelist <Bold>{tokenData?.name || tokenData?.symbol}</Bold> Token
    </ParaMd>
  );

  return (
    <AsyncCardTransfer
      isLoaded={tokenData}
      proposal={proposal}
      customUI={tokenUI}
    />
  );
};
export default WhitelistTokenTransfer;
