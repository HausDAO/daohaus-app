import React from 'react';
import { Box, Button, Flex, Link } from '@chakra-ui/react';

import { chainByID } from '../utils/chain';

const CrossChainMinionExecute = ({ chainID, proposal }) => {
  const monitoringAppUrl =
    proposal.minion.crossChainMinion &&
    chainByID(chainID).zodiac_amb_module?.monitoring_app[
      proposal.minion.foreignChainId
    ];

  return (
    <Flex alignItems='center' flexDir='column'>
      <Box mb={2}>Executed</Box>
      {monitoringAppUrl && proposal.minionExecuteActionTx?.id && (
        <Link
          href={`${monitoringAppUrl}/${proposal.minionExecuteActionTx.id}`}
          isExternal
        >
          <Button>Watch Cross-Chain Tx</Button>
        </Link>
      )}
    </Flex>
  );
};

export default CrossChainMinionExecute;
