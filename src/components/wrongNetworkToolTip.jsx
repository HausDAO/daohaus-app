import React from 'react';
import { RiInformationLine } from 'react-icons/ri';
import {
  Box, Button, Flex, Icon, Tooltip,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { capitalize, daoConnectedAndSameChain } from '../utils/general';
import { EIP3085, MM_ADDCHAIN_DATA, supportedChains } from '../utils/chain';

const WrongNetworkToolTip = () => {
  const { address, injectedChain, injectedProvider } = useInjectedProvider();
  const { daochain } = useParams();

  const handleSwitchNetwork = async () => {
    if (daochain && window.ethereum) {
      try {
        await window.ethereum?.request({
          id: '1',
          jsonrpc: '2.0',
          method: 'wallet_addEthereumChain',
          params: [MM_ADDCHAIN_DATA[daochain]],
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const ToolTipLabel = () => (
    <Box fontFamily='heading'>
      {`Please update your network to
      ${capitalize(supportedChains[daochain]?.network)} to interact with
      this DAO.`}
    </Box>
  );

  const MetaMaskToolTipLabel = () => (
    <Box fontFamily='heading' value={daochain}>
      {`Click to update your MetaMask provider to
      ${capitalize(supportedChains[daochain]?.network)} to interact with
      this DAO.`}
    </Box>
  );

  const NetworkToolTip = ({ children }) => {
    if (
      !address
      || daoConnectedAndSameChain(address, injectedChain?.chainId, daochain)
    ) {
      return children;
    }
    if (
      EIP3085.NOT_SUPPORTED[daochain]
      || !injectedProvider?.currentProvider?.isMetaMask
    ) {
      return (
        <Tooltip
          hasArrow
          label={<ToolTipLabel />}
          bg='secondary.500'
          placement='left-start'
        >
          {children}
        </Tooltip>
      );
    }
    return (
      <Tooltip
        hasArrow
        label={<MetaMaskToolTipLabel />}
        bg='secondary.500'
        placement='left-start'
      >
        <Button
          variant='text'
          px={0}
          onClick={handleSwitchNetwork}
          value={daochain}
        >
          {children}
        </Button>
      </Tooltip>
    );
  };

  return (
    <NetworkToolTip>
      {!address ? (
        <Flex align='center' mr={5} p='5px 12px' borderRadius='20px'>
          <Box fontSize='md' fontWeight={200}>
            {injectedChain?.name}
          </Box>
        </Flex>
      ) : (
        <>
          {!daoConnectedAndSameChain(
            address,
            injectedChain?.chainId,
            daochain,
          ) ? (
            <Flex
              align='center'
              mr={5}
              background='secondary.500'
              p='5px 12px'
              borderRadius='20px'
            >
              <Icon as={RiInformationLine} mr={2} />
              <Box fontSize='md' as='i' fontWeight={600}>
                {injectedChain?.name}
              </Box>
            </Flex>
            ) : (
              <Flex align='center' mr={5} p='5px 12px' borderRadius='20px'>
                <Box fontSize='md' fontWeight={200}>
                  {injectedChain?.name}
                </Box>
              </Flex>
            )}
        </>
      )}
    </NetworkToolTip>
  );
};

export default WrongNetworkToolTip;
