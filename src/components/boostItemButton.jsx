import React from 'react';
import ListItemButton from './listItemButton';

const BoostItemButton = ({
  boost,
  openDetails,
  installBoost,
  goToSettings,
}) => {
  const cost = boost?.cost?.toUpperCase();

  if (!boost.isAvailable)
    return (
      <ListItemButton
        onClick={openDetails}
        helperText={`Unavailable on network - ${cost}`}
        value={boost}
        mainText='Details'
      />
    );
  if (boost.isDeprecated)
    return (
      <ListItemButton
        onClick={openDetails}
        helperText='deprecated'
        value={boost}
        mainText='Details'
      />
    );
  if (!boost.isInstalled)
    return (
      <ListItemButton
        onClick={installBoost}
        helperText={cost}
        value={boost}
        mainText='Install'
      />
    );
  if (boost.isInstalled && boost.settings === 'none')
    return (
      <ListItemButton
        onClick={openDetails}
        helperText='installed'
        value={boost}
        mainText='Details'
      />
    );
  if (boost.isInstalled)
    return (
      <ListItemButton
        onClick={goToSettings}
        helperText='installed'
        value={boost}
        mainText='Settings'
      />
    );
  return null;
};

export default BoostItemButton;
