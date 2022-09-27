import React, { useMemo, useState } from 'react';
import { Button, Tooltip } from '@chakra-ui/react';

import { useAppModal } from '../hooks/useModals';
import useCanInteract from '../hooks/useCanInteract';
import { MINION_TYPES } from '../utils/proposalUtils';
import { fetchCrossChainZodiacModule } from '../utils/gnosis';
import { getMinionActionFormLego } from '../utils/vaults';

const LABELS = {
  NO_MEMBER: 'Wrong network or not a DAO member',
  MINION_NOT_READY: 'Must complete your minion setup',
};

const MinionTransfer = ({
  daochain,
  isMember,
  isNativeToken,
  minion,
  token,
  vault,
}) => {
  const { canInteract } = useCanInteract({
    checklist: ['isConnected', 'isSameChain'],
  });
  const { formModal } = useAppModal();
  const [loading, setLoading] = useState(false);

  const enableTransfer =
    isMember &&
    (!vault.safeAddress || (vault.safeAddress && vault.isMinionModule));

  const tooltip =
    ((!canInteract || !isMember) && LABELS.NO_MEMBER) ||
    (!enableTransfer && LABELS.MINION_NOT_READY);

  const transferFormLego = useMemo(() => {
    const tokenType = isNativeToken ? 'network' : 'erc20';
    return getMinionActionFormLego(
      tokenType,
      vault.crossChainMinion ? MINION_TYPES.CROSSCHAIN_SAFE : vault.minionType,
    );
  }, [isNativeToken]);

  const openSendModal = async () => {
    setLoading(true);
    formModal({
      ...transferFormLego,
      localValues: {
        tokenAddress: isNativeToken ? '0x00' : token.tokenAddress,
        minionAddress: minion,
        balance: token.tokenBalance,
        tokenDecimals: isNativeToken ? '18' : token.decimals,
        foreignChainId: vault.foreignChainId,
        bridgeModule: vault.bridgeModule,
        bridgeModuleAddress:
          vault.foreignSafeAddress &&
          (await fetchCrossChainZodiacModule({
            chainID: vault.foreignChainId,
            crossChainController: {
              address: vault.safeAddress,
              bridgeModule: vault.bridgeModule,
              chainId: daochain,
            },
            safeAddress: vault.foreignSafeAddress,
          })),
      },
    });
    setLoading(false);
  };

  return (
    <>
      {canInteract && enableTransfer ? (
        <Button
          size='md'
          variant='outline'
          ml={6}
          isLoading={loading}
          onClick={openSendModal}
        >
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
