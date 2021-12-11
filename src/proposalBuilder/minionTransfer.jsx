import React, { useMemo } from 'react';

import useMinionAction from '../hooks/useMinionAction';
import { readableTokenBalance } from '../utils/proposalCard';
import { useDao } from '../contexts/DaoContext';
import { AsyncCardTransfer } from './proposalCard2';

const MinionTransfer = ({ proposal = {} }) => {
  const { minionAddress } = proposal;
  const minionAction = useMinionAction(proposal);
  const { daoVaults } = useDao();
  const itemText = useMemo(() => {
    console.log('OUT OF MEMO:');
    console.log(`minionAction`, minionAction);
    console.log(`daoVaults`, daoVaults);
    console.log(`minionAddress`, minionAddress);
    if (!daoVaults || !minionAction || !minionAddress) return;
    console.log('IN MEMO:');
    const tokenAddress = minionAction.to;
    const balance = minionAction.decoded.params[1].value;
    const vault = daoVaults?.find(minion => minion.address === minionAddress);
    const tokenData = vault?.erc20s.find(
      token =>
        token.tokenAddress?.toLowerCase() === tokenAddress?.toLowerCase(),
    );
    console.log(`minionAction`, minionAction);
    const { name, decimals } = tokenData || {};

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
