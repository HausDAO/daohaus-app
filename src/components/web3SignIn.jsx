import React from 'react';
import { Button } from '@chakra-ui/react';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import AddressAvatar from './addressAvatar';

export const Web3SignIn = ({ isDao }) => {
  const { requestWallet, address } = useInjectedProvider();
  const { setDaoAccountModal, setHubAccountModal } = useOverlay();

  const toggleAccountModal = () => {
    if (!isDao) {
      setHubAccountModal(prevState => !prevState);
    } else {
      setDaoAccountModal(prevState => !prevState);
    }
  };

  return (
    <>
      {address ? (
        <Button variant='outline' onClick={toggleAccountModal}>
          <AddressAvatar hideCopy addr={address} key={address} />
        </Button>
      ) : (
        <Button variant='outline' onClick={requestWallet}>
          Connect Wallet
        </Button>
      )}
    </>
  );
};

export default Web3SignIn;
