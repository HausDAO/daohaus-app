import React from 'react';

import MinionTransfer from './minionTransfer';
import DelegateTransfer from './delegateTransfer';
import StakeTransfer from './UHstakingTransfer';
import WhitelistTokenTransfer from './whitelistTokenTransfer';
import GuildKickTransfer from './guildKickTransfer';
import UberRQTransfer from './uberRQTransfer';
import MultiTxTransfer from './multiTxTransfer';
import DisperseTransfer from './disperseTransfer';

const CustomTransfer = props => {
  const { customTransferUI } = props;
  if (customTransferUI === 'minionTransfer') {
    return <MinionTransfer {...props} />;
  }
  if (customTransferUI === 'uberDelegate') {
    return <DelegateTransfer {...props} />;
  }
  if (customTransferUI === 'uberStake') {
    return <StakeTransfer {...props} />;
  }
  if (customTransferUI === 'whitelistToken') {
    return <WhitelistTokenTransfer {...props} />;
  }
  if (customTransferUI === 'guildKick') {
    return <GuildKickTransfer {...props} />;
  }
  if (customTransferUI === 'uberRQ') {
    return <UberRQTransfer {...props} />;
  }
  if (customTransferUI === 'multiTx') {
    return <MultiTxTransfer {...props} />;
  }
  if (customTransferUI === 'disperse') {
    return <DisperseTransfer {...props} />;
  }
  return null;
};

export default CustomTransfer;
