import React, { useMemo } from 'react';
import { Box } from '@chakra-ui/react';

import { AsyncCardTransfer, PropCardTransfer } from './proposalBriefPrimitives';
import { ParaMd } from '../components/typography';
import { UBERHAUS_DATA } from '../utils/uberhaus';
import {
  readableNumber,
  readableTokenBalance,
} from '../utils/proposalCardUtils';

//  THIS IS A CUSTOM COMPONENT THAT ONLY WORKS FOR  UBERHAUS STAKE PROPOSALS

const StakeTransfer = ({ proposal = {}, minionAction }) => {
  const incorrectToken = useMemo(() => {
    if (!minionAction?.decoded?.params?.length) return;
    const token = minionAction.decoded.params.find(
      method => method?.name === 'tributeToken',
    )?.value;
    if (token !== UBERHAUS_DATA.STAKING_TOKEN.toLowerCase()) return true;
  }, [proposal, minionAction]);
  const stakeAmt = useMemo(() => {
    if (!minionAction?.decoded?.params?.length) return;
    const amt = minionAction.decoded.params.find(
      method => method?.name === 'tributeOffered',
    )?.value;
    if (amt != null)
      return readableTokenBalance({
        balance: amt,
        symbol: UBERHAUS_DATA.STAKING_TOKEN_SYMBOL,
        decimals: UBERHAUS_DATA.STAKING_TOKEN_DECIMALS,
      });
  }, [proposal, minionAction]);
  const sharesAmt = useMemo(() => {
    if (!minionAction?.decoded?.params?.length) return;
    const amt = minionAction.decoded.params.find(
      method => method?.name === 'sharesRequested',
    )?.value;
    return readableNumber({ amount: Number(amt) });
  }, [proposal, minionAction]);

  if (incorrectToken) {
    return (
      <PropCardTransfer customUI={<ParaMd>Incorrect Staking Token</ParaMd>} />
    );
  }

  return (
    <>
      <Box mb='2'>
        <AsyncCardTransfer
          isLoaded={minionAction?.decoded}
          proposal={proposal}
          outgoing
          action='Stake'
          itemText={stakeAmt}
          specialLocation='UberHAUS'
        />
      </Box>
      <AsyncCardTransfer
        isLoaded={minionAction?.decoded}
        proposal={proposal}
        incoming
        action='Requesting'
        itemText={`${sharesAmt} ${
          Number(sharesAmt) === 1 ? 'Share' : 'Shares'
        }`}
      />
    </>
  );
};
export default StakeTransfer;
