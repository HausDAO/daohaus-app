import React from 'react';
import { useParams } from 'react-router';

import { useDaoMember } from '../contexts/DaoMemberContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import ListItemButton from './listItemButton';
import { daoConnectedAndSameChain } from '../utils/general';

const BoostItemButton = ({
  boost,
  openDetails,
  installBoost,
  goToSettings,
}) => {
  const { daochain } = useParams();
  const { address, injectedChain } = useInjectedProvider();
  const { daoMember } = useDaoMember();

  const canInteract =
    daoConnectedAndSameChain(address, injectedChain?.chainId, daochain) &&
    +daoMember?.shares > 0;
  const cost = boost?.cost?.toUpperCase();

  if (!boost.isAvailable)
    return (
      <ListItemButton
        onClick={openDetails}
        helperText={`Unavailable on network - ${cost}`}
        value={boost}
        mainText='Details'
        disabled={!canInteract}
      />
    );
  if (!boost.isInstalled)
    return (
      <ListItemButton
        onClick={installBoost}
        helperText={cost}
        value={boost}
        mainText='Install'
        disabled={!canInteract}
      />
    );
  if (boost.isInstalled && boost.settings === 'none')
    return (
      <ListItemButton
        onClick={openDetails}
        helperText='installed'
        value={boost}
        mainText='Details'
        disabled={!canInteract}
      />
    );
  if (boost.isInstalled)
    return (
      <ListItemButton
        onClick={goToSettings}
        helperText='installed'
        value={boost}
        mainText='Settings'
        disabled={!canInteract}
      />
    );
  return null;
};

export default BoostItemButton;
