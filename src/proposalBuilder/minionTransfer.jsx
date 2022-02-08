import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useDao } from '../contexts/DaoContext';
import { Bold, ParaMd } from '../components/typography';
import { AsyncCardTransfer, PropCardError } from './proposalBriefPrimitives';

import { readableTokenBalance } from '../utils/proposalCardUtils';
import { fetchSpecificTokenData } from '../utils/tokenValue';
import { MINION_TYPES } from '../utils/proposalUtils';

//  THIS IS A CUSTOM COMPONENT THAT WORKS FOR PAYROLL PROPOSALS
const getActionDataByMinion = (minionAction, minionType) => {
  if (minionType === MINION_TYPES.SAFE) {
    const {
      decoded: { actions },
    } = minionAction;
    const transferAction = actions[0];
    const balance = transferAction.data?.params?.[1]?.value;
    const tokenAddress = transferAction?.to;
    return { balance, tokenAddress };
  }
  return {
    tokenAddress: minionAction.to,
    balance:
      minionAction.decoded?.params[1]?.value ||
      minionAction.decoded?.actions[1]?.value,
  };
};

const deriveMessage = async ({
  minionAction,
  setCustomUI,
  setIsError,
  daochain,
  daoVaults,
  minionAddress,
  shouldUpdate,
  minionType,
}) => {
  const { tokenAddress, balance } = getActionDataByMinion(
    minionAction,
    minionType,
  );
  const vault = daoVaults?.find(minion => minion.address === minionAddress);
  const tokenData = await fetchSpecificTokenData(
    tokenAddress,
    {
      name: true,
      decimals: true,
    },
    daochain,
  );
  const { name, decimals } = tokenData || {};
  if (balance && name && decimals && vault && shouldUpdate) {
    setCustomUI(
      <ParaMd>
        Requesting
        <Bold>
          {' '}
          {readableTokenBalance({ balance, symbol: name, decimals })}
        </Bold>{' '}
        from <Bold>{vault?.name || 'Minion'}</Bold>
      </ParaMd>,
    );
  } else {
    setCustomUI('Error Retrieving token data');
    setIsError(true);
  }
};

const MinionTransfer = ({ proposal = {}, minionAction }) => {
  const {
    minionAddress,
    minion: { minionType },
  } = proposal;
  const { daochain } = useParams();
  const { daoVaults } = useDao();
  const [customUI, setCustomUI] = useState(null);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    let shouldUpdate = true;
    if (!daoVaults || !minionAction || !minionAddress) return;
    if (minionAction?.decoded?.error) {
      setCustomUI(minionAction?.decoded?.message);
      setIsError(true);
      return;
    }
    deriveMessage({
      minionAction,
      setCustomUI,
      setIsError,
      daochain,
      daoVaults,
      minionAddress,
      shouldUpdate,
      minionType,
    });
    return () => (shouldUpdate = false);
  }, [daoVaults && minionAction && !minionAddress]);
  if (minionAction?.status === 'error') {
    return <PropCardError message={minionAction.message} />;
  }
  return (
    <AsyncCardTransfer
      isLoaded={customUI}
      proposal={proposal}
      outgoing={!isError && customUI}
      error={isError}
      customUI={customUI}
    />
  );
};

export default MinionTransfer;
