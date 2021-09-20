import React, { useMemo } from 'react';
import { Button, Tooltip } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { daoConnectedAndSameChain } from '../utils/general';
import { getMinionActionFormLego } from '../utils/vaults';
import { useAppModal } from '../hooks/useModals';

const MinionTransfer = ({ isMember, isNativeToken, minion, token, vault }) => {
  const { address, injectedChain } = useInjectedProvider();
  const { formModal } = useAppModal();
  const { daochain } = useParams();

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
