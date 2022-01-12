import React, { useEffect, useMemo, useState } from 'react';

import { useParams } from 'react-router-dom';
import { AsyncCardTransfer } from './propBriefPrimitives';
import { createContract } from '../utils/contract';
import { LOCAL_ABI } from '../utils/abi';
import { Bold, ParaMd } from '../components/typography';
import { generateRQText } from '../utils/proposalCard';

//  THIS IS A CUSTOM COMPONENT THAT ONLY WORKS FOR WHITELIST TOKEN PROPOSALS

const UberRQTransfer = ({ proposal = {}, minionAction }) => {
  const RQText = useMemo(() => {
    if (!minionAction?.decoded?.params?.length) return;
    const decodedActions = minionAction.decoded.params;
    const lootToBurn = decodedActions.find(
      action => action.name === 'lootToBurn',
    ).value;
    const sharesToBurn = decodedActions.find(
      action => action.name === 'sharesToBurn',
    )?.value;
    console.log(`lootToBurn`, lootToBurn);
    console.log(`sharesToBurn`, sharesToBurn);
    const transferAmts = generateRQText({ sharesToBurn, lootToBurn });
    console.log(`transferAmts`, transferAmts);
  }, [minionAction]);

  // const tokenUI = (
  //   <ParaMd>
  //     Whitelist <Bold>{tokenData?.name || tokenData?.symbol}</Bold> Token
  //   </ParaMd>
  // );

  return (
    <AsyncCardTransfer
      isLoaded={RQText}
      proposal={proposal}
      incoming
      // customUI={tokenUI}
    />
  );
};
export default UberRQTransfer;
