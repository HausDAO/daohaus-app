import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';
import { TiWarningOutline } from 'react-icons/ti';
import Icon from '@chakra-ui/icon';
import { Box, Flex } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';
import { utils as Web3Utils } from 'web3';
import ModuleManager from '@gnosis.pm/safe-contracts/build/artifacts/contracts/base/ModuleManager.sol/ModuleManager.json';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { ToolTipWrapper } from '../staticElements/wrappers';
import { safeEncodeHexFunction } from '../utils/abi';
import { createGnosisSafeTxProposal } from '../utils/contract';

const SF_TOOLTIP = {
  ADD_MODULE: {
    title: 'ACTION REQUIRED',
    pars: [
      'To enable this minion, it must be added as a safe module first.',
      'Click to submit a enableModule Tx proposal to the Safe.',
    ],
  },
  NO_OWNER: {
    title: 'ACTION REQUIRED',
    body:
      'You MUST be a Gnosis Safe signer in order to submit a Tx proposal to add the minion as a module',
  },
};

const SafeMinionDetails = ({ vault, safeDetails, handleCopy }) => {
  const { daochain } = useParams();
  const [isLoading, setLoading] = useState(false);
  const [isSafeOwner, safeOwner] = useState(false);
  const { address, injectedProvider } = useInjectedProvider();
  const { successToast, errorToast } = useOverlay();

  const submitMinionModuleTxProposal = async () => {
    setLoading(true);
    const selectedFunction = ModuleManager.abi.find(
      entry => entry.name === 'enableModule',
    );
    const hexData = safeEncodeHexFunction(selectedFunction, [
      Web3Utils.toChecksumAddress(vault.address),
    ]);
    if (!hexData.encodingError) {
      const checksumSafeAddr = Web3Utils.toChecksumAddress(vault.safeAddress);
      try {
        await createGnosisSafeTxProposal({
          chainID: daochain,
          web3: injectedProvider,
          safeAddress: checksumSafeAddr,
          fromDelegate: Web3Utils.toChecksumAddress(address),
          to: checksumSafeAddr,
          value: '0',
          data: hexData,
          operation: 0,
        });
        successToast({
          title: 'EnableModule Tx Proposal submitted.',
          description: 'Check your Gnosis Safe Tx Queue for execution.',
        });
      } catch (error) {
        errorToast({
          title: 'Failed to submit Tx Proposal',
          description: error.message,
        });
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      address &&
      safeDetails.owners.includes(Web3Utils.toChecksumAddress(address))
    ) {
      safeOwner(true);
    }
  }, [injectedProvider, safeDetails]);

  return (
    <ContentBox mt={6}>
      <TextBox size='xs' mb={6}>
        Safe Minion
      </TextBox>
      <Box fontFamily='mono' mb={5}>
        Gnosis Safe
        <CopyToClipboard text={vault.safeAddress} onCopy={handleCopy}>
          <Box color='secondary.300'>
            {vault.safeAddress}
            <Icon
              as={FaCopy}
              color='secondary.300'
              ml={2}
              _hover={{ cursor: 'pointer' }}
            />
          </Box>
        </CopyToClipboard>
      </Box>
      <Box fontFamily='mono'>
        Minion Address (Do Not Send Funds)
        <CopyToClipboard text={vault.address} onCopy={handleCopy}>
          <Box color='secondary.300'>
            {vault.address}
            <Icon
              as={FaCopy}
              color='secondary.300'
              ml={2}
              _hover={{ cursor: 'pointer' }}
            />
          </Box>
        </CopyToClipboard>
      </Box>
      {injectedProvider && !vault.isMinionModule && (
        <Flex mt={6}>
          <ToolTipWrapper
            placement='right'
            tooltip
            tooltipText={
              isSafeOwner ? SF_TOOLTIP.ADD_MODULE : SF_TOOLTIP.NO_OWNER
            }
          >
            <Button
              isLoading={isLoading}
              isDisabled={!isSafeOwner}
              mr={6}
              onClick={submitMinionModuleTxProposal}
              rightIcon={<TiWarningOutline />}
              variant='outline'
            >
              Add Minion as Module
            </Button>
          </ToolTipWrapper>
        </Flex>
      )}
    </ContentBox>
  );
};

export default SafeMinionDetails;
