import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useDao } from '../contexts/DaoContext';
import { Bold, ParaMd } from '../components/typography';
import { AsyncCardTransfer, PropCardError } from './proposalBriefPrimitives';

import { readableTokenBalance } from '../utils/proposalCardUtils';
import { fetchSpecificTokenData } from '../utils/tokenValue';
import { MINION_TYPES } from '../utils/proposalUtils';
import { chainByID } from '../utils/chain';

//  THIS IS A CUSTOM COMPONENT THAT WORKS FOR PAYROLL PROPOSALS
const getActionDataByMinion = (minionAction, minionType, crossChainMinion) => {
  if (minionType === MINION_TYPES.SAFE) {
    const {
      decoded: { actions },
    } = minionAction;
    if (actions[0].data.error) return { tokenAddress: '0x' };
    const transferAction = crossChainMinion
      ? actions[0].actions[0]
      : actions[0];
    if (transferAction.data.name === 'ETH Transfer') {
      return {
        balance: transferAction.data?.params?.[0]?.value,
        tokenAddress: '0x',
      };
    }
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
  const vault = daoVaults?.find(minion => minion.address === minionAddress);
  const { tokenAddress, balance } = getActionDataByMinion(
    minionAction,
    minionType,
    vault.crossChainMinion,
  );
  const tokenData =
    tokenAddress !== '0x'
      ? await fetchSpecificTokenData(
          tokenAddress,
          {
            name: true,
            decimals: true,
          },
          vault.crossChainMinion ? vault.foreignChainId : daochain,
        )
      : {
          name: chainByID(daochain).nativeCurrency,
          decimals: 18,
        };
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
      daochain: proposal.minion.foreignChainId || daochain,
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
