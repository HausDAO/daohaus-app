import React, { useMemo } from 'react';
import { Button, Tooltip } from '@chakra-ui/react';

import { useAppModal } from '../hooks/useModals';
import useCanInteract from '../hooks/useCanInteract';
import { getMinionActionFormLego } from '../utils/vaults';

const LABELS = {
  NO_MEMBER: 'Wrong network or not a DAO member',
  MINION_NOT_READY: 'Must complete your minion setup',
};

const MinionTransfer = ({ isMember, isNativeToken, minion, token, vault }) => {
  const { canInteract } = useCanInteract({
    checklist: ['isConnected', 'isSameChain'],
  });
  const { formModal } = useAppModal();

  const enableTransfer =
    isMember &&
    (!vault.safeAddress || (vault.safeAddress && vault.isMinionModule));

  const tooltip =
    ((!canInteract || !isMember) && LABELS.NO_MEMBER) ||
    (!enableTransfer && LABELS.MINION_NOT_READY);

  const transferFormLego = useMemo(() => {
    const tokenType = isNativeToken ? 'network' : 'erc20';
    return getMinionActionFormLego(tokenType, vault.minionType);
  }, [isNativeToken]);

  const openSendModal = () => {
    formModal({
      ...transferFormLego,
      localValues: {
        tokenAddress: isNativeToken ? '0x00' : token.tokenAddress,
        minionAddress: minion,
        balance: token.tokenBalance,
        tokenDecimals: isNativeToken ? '18' : token.decimals,
      },
    });
  };

  return (
    <>
      {canInteract && enableTransfer ? (
        <Button size='md' variant='outline' ml={6} onClick={openSendModal}>
          Transfer
        </Button>
      ) : (
        <Tooltip
          hasArrow
          shouldWrapChildren
          placement='bottom'
          label={tooltip}
          bg='secondary.500'
        >
          <Button size='md' variant='outline' disabled>
            Transfer
          </Button>
        </Tooltip>
      )}
    </>
  );
};

export default MinionTransfer;
