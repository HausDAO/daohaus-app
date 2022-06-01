import React from 'react';

import MinionTransfer from './minionTransfer';
import WhitelistTokenTransfer from './whitelistTokenTransfer';
import GuildKickTransfer from './guildKickTransfer';
import MultiTxTransfer from './multiTxTransfer';
import DisperseTransfer from './disperseTransfer';
import RaribleTransferSell from './raribleTransferSell';
import MinionTributeTransfer from './MinionTributeTransfer';
import SuperfluidTransfer from './superfluidTransfer';
import TutorialTransfer from './tutorialTransfer';
import PosterTransfer from './posterTransfer';

const CustomTransfer = props => {
  const { customTransferUI } = props;
  if (customTransferUI === 'minionTransfer') {
    return <MinionTransfer {...props} />;
  }
  if (customTransferUI === 'whitelistToken') {
    return <WhitelistTokenTransfer {...props} />;
  }
  if (customTransferUI === 'guildKick') {
    return <GuildKickTransfer {...props} />;
  }
  if (customTransferUI === 'multiTx') {
    return <MultiTxTransfer {...props} />;
  }
  if (customTransferUI === 'disperse') {
    return <DisperseTransfer {...props} />;
  }
  if (customTransferUI === 'raribleTransfer') {
    return <RaribleTransferSell {...props} />;
  }
  if (customTransferUI === 'minionTributeTransfer') {
    return <MinionTributeTransfer {...props} />;
  }
  if (customTransferUI === 'superfluidStream') {
    return <SuperfluidTransfer {...props} />;
  }
  if (customTransferUI === 'tutorialTransfer') {
    return <TutorialTransfer {...props} />;
  }
  if (customTransferUI === 'ratifyContent') {
    return <PosterTransfer {...props} />;
  }
  return null;
};

export default CustomTransfer;
