import React, { useEffect } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { chainByID, EIP3085, switchNetwork } from '../utils/chain';

const SwitchNetwork = ({ localForm, defaultTargetChainId, warningMessage }) => {
  const { injectedChain } = useInjectedProvider();
  const { watch } = localForm;

  const currentChainId = injectedChain.chain_id;
  const foreignChainId = watch('foreignChainId');
  const targetChainId = foreignChainId || defaultTargetChainId;
  const targetNetwork = chainByID(targetChainId);
  const networkLabel = targetNetwork?.name;
  const supportedEIP3085 = EIP3085.SUPPORTED[targetChainId];

  useEffect(() => {
    console.log('injectedChain', currentChainId);
  }, [injectedChain]);
  return targetChainId ? (
    <Flex align='center' direction='column' mb={4}>
      <Box
        borderRadius='lg'
        w='100%'
        p={4}
        mb={4}
        bg='#3F2B23'
        color='#ED873A'
        textAlign='center'
      >
        <Box>
          {currentChainId !== targetChainId
            ? `You need to connect to ${networkLabel} to submit this form. ${
                !supportedEIP3085
                  ? 'Please update your network to proceed.'
                  : ''
              }`
            : `Connected to ${networkLabel}.`}
        </Box>
        {warningMessage && <Box>{warningMessage}</Box>}
      </Box>
      {targetChainId &&
        currentChainId !== targetChainId &&
        supportedEIP3085 && (
          <Button onClick={() => switchNetwork(targetChainId)}>
            {`Switch to ${networkLabel}`}
          </Button>
        )}
    </Flex>
  ) : null;
};

export default SwitchNetwork;
