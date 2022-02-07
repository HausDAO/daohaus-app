import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useDao } from '../contexts/DaoContext';
import { Bold, ParaMd } from '../components/typography';
import { AsyncCardTransfer, PropCardError } from './proposalBriefPrimitives';

import { readableTokenBalance } from '../utils/proposalCardUtils';
import { fetchSpecificTokenData } from '../utils/tokenValue';

//  THIS IS A CUSTOM COMPONENT THAT WORKS FOR PAYROLL PROPOSALS
const deriveMessage = async ({
  minionAction,
  setCustomUI,
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
  const { minionAddress } = proposal;
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
