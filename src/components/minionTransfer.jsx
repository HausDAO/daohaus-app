import React, { useMemo } from 'react';
import { Button, Tooltip } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import GenericModal from '../modals/genericModal';
import { daoConnectedAndSameChain } from '../utils/general';
import { getMinionActionFormLego } from '../utils/vaults';

const MinionTransfer = ({ isMember, isNativeToken, minion, token, vault }) => {
  const { address, injectedChain } = useInjectedProvider();
  const { setGenericModal } = useOverlay();
  const { daochain } = useParams();

  const transferFormLego = useMemo(() => {
    const tokenType = isNativeToken ? 'network' : 'erc20';
    return getMinionActionFormLego(tokenType, vault.minionType);
  }, [isNativeToken]);

  const openSendModal = () => {
    const modalName = isNativeToken
      ? 'minionSendNativeToken'
      : `minionSendToken-${token.tokenAddress}`;
    setGenericModal({ [modalName]: true });
  };

  return (
    <>
      <GenericModal
        modalId={
          isNativeToken
            ? 'minionSendNativeToken'
            : `minionSendToken-${token.tokenAddress}`
        }
        formLego={{
          ...transferFormLego,
          localValues: {
            tokenAddress: isNativeToken ? '0x00' : token.tokenAddress,
            minionAddress: minion,
            balance: token.tokenBalance,
            tokenDecimals: isNativeToken ? '18' : token.decimals,
          },
        }}
        closeOnOverlayClick
      />

      {daoConnectedAndSameChain(address, daochain, injectedChain?.chainId) &&
      isMember ? (
        <Button size='md' variant='outline' ml={6} onClick={openSendModal}>
          Transfer
        </Button>
      ) : (
        <Tooltip
          hasArrow
          shouldWrapChildren
          placement='bottom'
          label='Wrong network or not a DAO member'
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
