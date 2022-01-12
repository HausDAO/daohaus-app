import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useDao } from '../contexts/DaoContext';

import { readableTokenBalance } from '../utils/proposalCard';
import { fetchSpecificTokenData } from '../utils/tokenValue';

import { AsyncCardTransfer } from './propBriefPrimitives';

//  THIS IS A CUSTOM COMPONENT THAT ONLY WORKS FOR PAYROLL PROPOSALS

const MinionTransfer = ({ proposal = {}, minionAction }) => {
  const { minionAddress } = proposal;
  const { daochain } = useParams();
  const { daoVaults } = useDao();

  const [itemText, setItemText] = useState(null);

  useEffect(() => {
    let shouldUpdate = true;

    const deriveMessage = async () => {
      const tokenAddress = minionAction.to;
      const balance =
        minionAction.decoded?.params[1]?.value ||
        minionAction.decoded.actions[1]?.value;
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
      }
    };
    if (shouldUpdate) setItemText();
    if (!daoVaults || !minionAction || !minionAddress) return;
    deriveMessage();
    return () => (shouldUpdate = false);
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
