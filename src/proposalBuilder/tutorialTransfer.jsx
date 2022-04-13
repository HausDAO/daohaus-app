import React, { useEffect, useState } from 'react';
import { Bold, ParaMd } from '../components/typography';
import { AsyncCardTransfer } from './proposalBriefPrimitives';

const getTokenData = ({ minionAction }) => {
  try {
    // const tokenAddress = minionAction?.decoded?.actions?.[0]?.to;

    console.log('minionAction', minionAction);
  } catch (error) {
    console.error(error);
  }
};

export const TutorialTransfer = props => {
  const { minionAction } = props;
  const [tokenData, setTokenData] = useState(null);
  const [setError] = useState(null);

  useEffect(() => {
    let shouldUpdate = true;
    if (minionAction?.decoded) {
      getTokenData({ minionAction, shouldUpdate, setTokenData, setError });
    }
    return () => (shouldUpdate = false);
  }, [minionAction]);

  const customUI = (
    <ParaMd>
      Staking <Bold>Blah Blah</Bold> into Swapr
    </ParaMd>
  );

  return <AsyncCardTransfer isLoaded={tokenData} customUI={customUI} />;
};

export default TutorialTransfer;
