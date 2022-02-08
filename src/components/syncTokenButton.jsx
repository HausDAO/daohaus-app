import React, { useEffect, useState } from 'react';
import { RiQuestionLine } from 'react-icons/ri';
import { Button, Flex, Spinner, Tooltip } from '@chakra-ui/react';

import { useDaoMember } from '../contexts/DaoMemberContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useTX } from '../contexts/TXContext';
import useCanInteract from '../hooks/useCanInteract';
import { TX } from '../data/txLegos/contractTX';
import { isDelegating } from '../utils/general';

const SyncTokenButton = ({ token }) => {
  const { canInteract } = useCanInteract({
    checklist: ['isConnected', 'isSameChain'],
  });
  const { errorToast } = useOverlay();
  const { submitTransaction } = useTX();
  const { daoMember, delegate } = useDaoMember();
  const [loading, setLoading] = useState(false);

  const canSync = !isDelegating(daoMember) || delegate;

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  const handleSync = async () => {
    setLoading(true);

    if (!token) {
      setLoading(false);
      errorToast({
        title: 'There was an error.',
      });
    }

    await submitTransaction({
      tx: TX.COLLECT_TOKENS,
      args: [token.tokenAddress],
    });

    setLoading(false);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Flex>
      {canInteract && canSync ? (
        <Tooltip
          hasArrow
          shouldWrapChildren
          placement='top'
          label='Looks like some funds were sent directly to the DAO. Sync to update
                    the balance.'
        >
          <Button onClick={handleSync} rightIcon={<RiQuestionLine />}>
            Sync Pending Deposit
          </Button>
        </Tooltip>
      ) : (
        <Tooltip
          hasArrow
          shouldWrapChildren
          placement='bottom'
          label='Unable to sync token. Check that you are connected to correct network. Note, members who have delegated their voting power cannot sync tokens'
          bg='secondary.500'
        >
          <Button disabled>Sync Pending Deposit</Button>
        </Tooltip>
      )}
    </Flex>
  );
};

export default SyncTokenButton;
