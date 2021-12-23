import React, { useMemo } from 'react';

import { useDao } from '../contexts/DaoContext';
import useMinionAction from '../hooks/useMinionAction';
import { readableTokenBalance } from '../utils/proposalCard';
import { AsyncCardTransfer } from './propBriefPrimitives';

//  THIS IS A CUSTOM COMPONENT THAT ONLY WORKS FOR PAYROLL PROPOSALS

const MinionTransfer = ({ proposal = {}, minionAction }) => {
  const { minionAddress } = proposal;
  console.log(`minionAction`, minionAction);
  const { daoVaults } = useDao();

  const itemText = useMemo(() => {
    if (!daoVaults || !minionAction || !minionAddress) return;
    if (minionAction.status === 'error') return 'Error Retrieving token data';
    const tokenAddress = minionAction.to;
    const balance =
      minionAction.decoded?.params[1]?.value ||
      minionAction.decoded.actions[1]?.value;
    const vault = daoVaults?.find(minion => minion.address === minionAddress);
    const tokenData = vault?.erc20s.find(
      token =>
        token.tokenAddress?.toLowerCase() === tokenAddress?.toLowerCase(),
    );
    console.log(`daoVaults`, daoVaults);
    const { name, decimals } = tokenData || {};
    console.log(`balance`, balance);
    console.log(`name`, name);
    console.log(`decimals`, decimals);
    console.log(`vault`, vault);
    if (balance && name && decimals && vault) {
      return `Requesting ${readableTokenBalance({
        balance,
        symbol: name,
        decimals,
      })} from ${vault?.name || 'Minion'}`;
    }
    return 'Error Retrieving token data';
  }, [daoVaults && minionAction && !minionAddress]);

  return (
    <AsyncCardTransfer
      isLoaded={itemText}
      proposal={proposal}
      incoming
      itemText={itemText}
    />
  );
};

export default MinionTransfer;
