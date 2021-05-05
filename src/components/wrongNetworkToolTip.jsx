import React from 'react';
import { RiInformationLine } from 'react-icons/ri';
import { Box, Button, Flex, Icon, Tooltip } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { capitalize, daoConnectedAndSameChain } from '../utils/general';
import { chainByID, EIP3085, MM_ADDCHAIN_DATA } from '../utils/chain';

const WrongNetworkToolTip = () => {
  const { address, injectedChain, injectedProvider } = useInjectedProvider();
  const { daochain } = useParams();
  const daoChainName = chainByID(daochain)?.name;

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

  if (!address) {
    return null;
  }

  if (
    daoConnectedAndSameChain(address, injectedChain?.chainId, daochain) ||
    !injectedProvider?.currentProvider?.isMetaMask
  ) {
    return <NetworkTextBox name={daoChainName} />;
  }

  return (
    <>
      {EIP3085.SUPPORTED[daochain] ? (
        <Tooltip
          hasArrow
          label={<MetaMaskToolTipLabel daoChainName={daoChainName} />}
          bg='secondary.500'
          placement='left-start'
        >
          <Button
            variant='text'
            px={0}
            onClick={handleSwitchNetwork}
            value={daochain}
          >
            <Flex
              align='center'
              mr={5}
              background='secondary.500'
              p='5px 12px'
              borderRadius='20px'
            >
              <Icon as={RiInformationLine} mr={2} />
              <Box fontSize='md' as='i' fontWeight={600}>
                {daoChainName}
              </Box>
            </Flex>
          </Button>
        </Tooltip>
      ) : (
        <Tooltip
          hasArrow
          label={<ToolTipLabel daoChainName={daoChainName} />}
          bg='secondary.500'
          placement='left-start'
        >
          <Flex
            align='center'
            mr={5}
            background='secondary.500'
            p='5px 12px'
            borderRadius='20px'
          >
            <Icon as={RiInformationLine} mr={2} />
            <Box fontSize='md' as='i' fontWeight={600}>
              {daoChainName}
            </Box>
          </Flex>
        </Tooltip>
      )}
    </>
  );
};
export default WrongNetworkToolTip;

const NetworkTextBox = ({ name }) => (
  <Flex align='center' mr={5} p='5px 12px' borderRadius='20px'>
    <Box fontSize='md' fontWeight={200} color='white'>
      {name}
    </Box>
  </Flex>
);

const ToolTipLabel = ({ daoChainName }) => (
  <Box fontFamily='heading' color='white'>
    {`Please update your network to
      ${capitalize(daoChainName)} to interact with
      this DAO.`}
  </Box>
);

const MetaMaskToolTipLabel = ({ daoChainName }) => (
  <Box fontFamily='heading'>
    {`Click to update your MetaMask provider to
      ${capitalize(daoChainName)} to interact with
      this DAO.`}
  </Box>
);
