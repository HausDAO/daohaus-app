import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useDao } from '../contexts/DaoContext';

import { readableTokenBalance } from '../utils/proposalCard';
import { fetchSpecificTokenData } from '../utils/tokenValue';

import { AsyncCardTransfer, PropCardError } from './propBriefPrimitives';

//  THIS IS A CUSTOM COMPONENT THAT WORKS FOR PAYROLL PROPOSALS
const deriveMessage = async ({
  minionAction,
  setItemText,
  setIsError,
  daochain,
  daoVaults,
  minionAddress,
  shouldUpdate,
}) => {
  const tokenAddress = minionAction.to;

  const balance =
    minionAction.decoded?.params[1]?.value ||
    minionAction.decoded?.actions[1]?.value;
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
    setItemText(
      `Requesting ${readableTokenBalance({
        balance,
        symbol: name,
        decimals,
      })} from ${vault?.name || 'Minion'}`,
    );
  } else {
    setItemText('Error Retrieving token data');
    setIsError(true);
  }
};

const MinionTransfer = ({ proposal = {}, minionAction }) => {
  const { minionAddress } = proposal;
  const { daochain } = useParams();
  const { daoVaults } = useDao();
  const [itemText, setItemText] = useState(null);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    let shouldUpdate = true;
    if (!daoVaults || !minionAction || !minionAddress) return;
    if (minionAction?.decoded?.error) {
      setItemText(minionAction?.decoded?.message);
      setIsError(true);
      return;
    }
    deriveMessage({
      minionAction,
      setItemText,
      setIsError,
      daochain,
      daoVaults,
      minionAddress,
      shouldUpdate,
    });
    return () => (shouldUpdate = false);
  }, [daoVaults && minionAction && !minionAddress]);
  if (minionAction?.status === 'error') {
    return <PropCardError message={minionAction.message} />;
  }
  return (
    <AsyncCardTransfer
      isLoaded={itemText}
      proposal={proposal}
      incoming={!isError && itemText}
      error={isError}
      itemText={itemText}
    />
  );
};

export default MinionTransfer;
