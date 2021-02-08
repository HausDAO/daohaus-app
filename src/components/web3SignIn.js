import React from 'react';
import { Button } from '@chakra-ui/react';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import UserAvatar from './userAvatar';
// import Web3 from 'web3';

// import { w3connect } from '../../utils/auth';
// import { useNetwork, useWeb3Connect } from '../../contexts/PokemolContext';

export const Web3SignIn = ({ isDao }) => {
  const { requestWallet, address } = useInjectedProvider();
  const { setDaoAccountModal, setHubAccountModal } = useOverlay();

  const toggleAccountModal = () => {
    if (!isDao) {
      setHubAccountModal((prevState) => !prevState);
    } else {
      setDaoAccountModal((prevState) => !prevState);
    }
  };

  return (
    <>
      {address ? (
        <Button variant='outline' onClick={toggleAccountModal}>
          <UserAvatar copyEnabled={false} />
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
