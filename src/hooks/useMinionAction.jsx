import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { getMinionAction } from '../utils/minionUtils';

const useMinionAction = proposal => {
  const {
    minionAddress,
    minion: { minionType },
    proposalId,
  } = proposal || { minion: {} };
  const [minionAction, setAction] = useState(null);
  const { daochain } = useParams();

  useEffect(() => {
    if (!minionAddress || !daochain || !minionType) return;
    let shouldUpdate = true;
    const fetchMinionAction = async () => {
      const action = await getMinionAction({
        minionAddress,
        minionType,
        proposalId,
        chainID: daochain,
      });
      if (action?.data && shouldUpdate) {
        setAction({
          ...action,
          status: 'success',
        });
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
  }, [minionAddress, daochain, minionType]);
  return minionAction;
};

export default useMinionAction;
