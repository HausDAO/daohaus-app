import React, { useMemo } from 'react';

import { AsyncCardTransfer } from './proposalBriefPrimitives';
import { Bold, ParaMd } from '../components/typography';
import { generateRQText } from '../utils/proposalCardUtils';

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

    return (
      <ParaMd>
        Rage Quit <Bold>{generateRQText({ sharesToBurn, lootToBurn })}</Bold>{' '}
        from UberHAUS
      </ParaMd>
    );
  }, [minionAction]);
  return (
    <AsyncCardTransfer
      isLoaded={RQText}
      proposal={proposal}
      outgoing
      customUI={RQText}
    />
  );
};
export default UberRQTransfer;
