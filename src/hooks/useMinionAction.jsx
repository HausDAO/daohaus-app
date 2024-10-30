import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTX } from '../contexts/TXContext';

import { getExecuteAction, getMinionAction } from '../utils/minionUtils';

const useMinionAction = proposal => {
  const { minionAddress, minion, proposalId, proposalType, actions } =
    proposal || {};
  const { foreignChainId, minionType, safeMinionVersion } = minion || {};
  const { daochain } = useParams();

  // need a less hacky solution
  const { txClock } = useTX();

  const [minionAction, setAction] = useState(null);
  const [executeTX, setExecuteTX] = useState(null);

  useEffect(() => {
    if (!minionAddress || !daochain || !minionType) return;
    let shouldUpdate = true;
    const fetchMinionAction = async () => {
      const action = await getMinionAction({
        minionAddress,
        minionType,
        proposalId,
        proposalType,
        actions,
        chainID: daochain,
        foreignChainId,
        safeMinionVersion,
      });

      if (action && shouldUpdate) {
        setAction({
          ...action,
          status: 'success',
        });
        setExecuteTX(
          getExecuteAction({
            minionAction: action,
            minion: { ...minion, minionAddress },
            proposalType: proposal.proposalType,
          }),
        );
      }
      if (!action) {
        setAction({
          status: 'error',
          message: 'Error retrieving minion action ',
        });
      }
    };
    fetchMinionAction();
    return () => (shouldUpdate = false);
  }, [minionAddress, daochain, minionType, proposalType, proposalId, txClock]);
  return { minionAction, executeTX };
};

export default useMinionAction;
