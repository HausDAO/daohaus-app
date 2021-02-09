import React from 'react';
import { RiInformationLine } from 'react-icons/ri';
import { Box, Flex, Icon, Tooltip } from '@chakra-ui/react';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { capitalize, daoConnectedAndSameChain } from '../utils/general';
import { useParams } from 'react-router-dom';
import { supportedChains } from '../utils/chain';

const WrongNetworkToolTip = () => {
  const { address, injectedChain } = useInjectedProvider();
  const { daochain } = useParams();

  const NetworkToolTip = ({ children }) => {
    return !address ? (
      children
    ) : daoConnectedAndSameChain(address, injectedChain?.chainId, daochain) ? (
      children
    ) : (
      <Tooltip
        hasArrow
        label={
          <Box fontFamily='heading'>
            Please update your network to{' '}
            {capitalize(supportedChains[daochain]?.network)} to interact with
            this DAO.
          </Box>
        }
        bg='secondary.500'
        placement='left-start'
      >
        {children}
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
      ) : !daoConnectedAndSameChain(
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
    </NetworkToolTip>
  );
};
export default WrongNetworkToolTip;
