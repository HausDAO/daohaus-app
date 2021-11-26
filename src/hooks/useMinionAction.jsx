import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMinionAbi } from '../utils/abi';

import { getMinionAction, decodeAction } from '../utils/minionUtils';

const useMinionAction = ({ minionAddress, minionType, proposalId }) => {
  const [minionAction, setAction] = useState(null);
  const { daochain } = useParams();

  useEffect(() => {
    if (!minionAddress || !daochain || !minionType) return;
    let shouldUpdate = true;
    const fetchMinionAction = async () => {
      const action = await getMinionAction({
        minionAddress,
        abi: getMinionAbi(minionType),
        proposalId,
        chainID: daochain,
      });
      if (action?.data && shouldUpdate) {
        console.log(`action`, action);
        setAction({
          ...action,
          status: 'success',
          decoded: decodeAction(action.data),
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
  if (minionAction) {
    return minionAction;
  }
  return { status: 'loading' };
};

export default useMinionAction;
