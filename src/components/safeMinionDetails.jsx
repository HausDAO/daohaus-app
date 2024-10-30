import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RiErrorWarningLine, RiExternalLinkLine } from 'react-icons/ri';
import { TiWarningOutline } from 'react-icons/ti';
import Icon from '@chakra-ui/icon';
import { Box, Flex, Link, Text } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';
import { utils as Web3Utils } from 'web3';
import ModuleManager from '@gnosis.pm/safe-contracts/build/artifacts/contracts/base/ModuleManager.sol/ModuleManager.json';

import GnosisSafeCard from './gnosisSafeCard';
import { useDao } from '../contexts/DaoContext';
import { useDaoMember } from '../contexts/DaoMemberContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useTX } from '../contexts/TXContext';
import { TX } from '../data/txLegos/contractTX';
import { ACTIONS } from '../data/onTxHashActions';
import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { ToolTipWrapper } from '../staticElements/wrappers';
import { safeEncodeHexFunction } from '../utils/abi';
import { chainByID } from '../utils/chain';
import {
  BRIDGE_MODULES,
  createGnosisSafeTxProposal,
  deployZodiacBridgeModule,
  deployZodiacNomadModule,
  encodeBridgeTxProposal,
  encodeSwapSafeOwnersBy,
} from '../utils/gnosis';

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
  ADD_BRIDGE_MODULE: {
    title: 'ACTION REQUIRED',
    pars: [
      'To control a Gnosis Safe on a foreign network, it needs to have a brigde module enabled',
      'Please check for pending Txs on your Gnosis Safe or click to deploy a new module and submit a Tx proposal.',
    ],
  },
  REMOVE_SIGNERS: {
    title: 'OPTIONAL',
    pars: [
      'Submit a Minion proposal to remove current signers on the foreign Gnosis Safe',
    ],
  },
  MEMBER_ONLY: {
    title: 'MEMBERS ONLY',
    body:
      'You MUST be connected to the Right Network and be a DAO Member in order to submit a Tx proposal',
  },
  WRONG_CHAIN_N_OWNER: {
    title: 'ACTION REQUIRED',
    body:
      'You MUST be connected to the Target Network and be a Gnosis Safe signer in order to submit a Tx proposal',
  },
};

const SafeMinionDetails = ({
  vault,
  safeDetails,
  foreignSafeDetails,
  handleCopy,
}) => {
  const { daochain } = useParams();
  const [isLoading, setLoading] = useState(null);
  const [isSafeOwner, safeOwner] = useState(false);
  const [isForeignSafeOwner, foreignSafeOwner] = useState(false);
  const [safeMinionVersion, setSafeMinionVersion] = useState(null);
  const { daoOverview } = useDao();
  const { daoMember } = useDaoMember();
  const { address, injectedChain, injectedProvider } = useInjectedProvider();
  const { successToast, errorToast } = useOverlay();
  const { submitTransaction } = useTX();

  const chainConfig = chainByID(daochain);

  useEffect(() => {
    if (daoOverview) {
      const minionMatch = daoOverview.minions.find(
        m => m.minionAddress.toLowerCase() === vault.address.toLowerCase(),
      );

      if (minionMatch) {
        setSafeMinionVersion(minionMatch.safeMinionVersion);
      }
    }
  }, [vault, daoOverview]);

  const submitEnableModuleTxProposal = async (
    chainID,
    safeAddress,
    newModuleAddress,
  ) => {
    const selectedFunction = ModuleManager.abi.find(
      entry => entry.name === 'enableModule',
    );
    const hexData = safeEncodeHexFunction(selectedFunction, [
      Web3Utils.toChecksumAddress(newModuleAddress),
    ]);
    if (!hexData.encodingError) {
      const checksumSafeAddr = Web3Utils.toChecksumAddress(safeAddress);
      try {
        await createGnosisSafeTxProposal({
          chainID,
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
    }
  };

  const submitMinionModuleTxProposal = async () => {
    setLoading('enableMinionModule');
    await submitEnableModuleTxProposal(
      daochain,
      vault.safeAddress,
      vault.address,
    );
    setLoading(null);
  };

  const submitBridgeModuleTxProposal = async () => {
    setLoading('enableBridgeModule');
    try {
      const deployModuleTx = async () => {
        if (vault.bridgeModule === BRIDGE_MODULES.AMB_MODULE) {
          const ambConfig = chainByID(daochain).zodiac_amb_module;
          const ambAddress = ambConfig.amb_bridge_address[vault.foreignChainId];
          return deployZodiacBridgeModule(
            vault.safeAddress, // owner
            vault.foreignSafeAddress, // avatar
            vault.foreignSafeAddress, // target
            ambAddress, // amb
            vault.safeAddress, // controller
            daochain, // chainId
            injectedProvider,
          );
        }
        if (vault.bridgeModule === BRIDGE_MODULES.NOMAD_MODULE) {
          const zodiacConfig = chainByID(daochain).zodiac_nomad_module;
          const { domainId } = zodiacConfig;
          const xAppConnectionManager =
            zodiacConfig.xAppConnectionManager[vault.foreignChainId];
          return deployZodiacNomadModule(
            vault.foreignSafeAddress, // owner
            vault.foreignSafeAddress, // avatar
            vault.foreignSafeAddress, // target
            xAppConnectionManager, // xAppConnectionManager on Foreign Chain
            vault.safeAddress, // Controller on Home Chain
            domainId, // Domain ID on Home Chain
            daochain, // chainId
            vault.foreignChainId,
            injectedProvider,
          );
        }
      };

      const moduleAddress = await deployModuleTx();
      if (!moduleAddress) {
        errorToast({
          title: 'Module Deployment',
          description: 'Failed to deploy the Bridge Module.',
        });
      } else {
        // Send Tx Proposla to foreign safe
        await submitEnableModuleTxProposal(
          vault.foreignChainId,
          vault.foreignSafeAddress,
          moduleAddress,
        );
      }
    } catch (error) {
      errorToast({
        title: 'Failed to submit Tx Proposal',
        description: error.message,
      });
    }
    setLoading(null);
  };

  const removeSignersTxProposal = async () => {
    setLoading('removeSigners');
    try {
      const encodedTx = await encodeSwapSafeOwnersBy(
        vault.foreignChainId,
        vault.foreignSafeAddress,
        foreignSafeDetails.crossChainModuleAddress,
      );
      const { bridgeModule, foreignChainId } = vault;
      const txProposal = await encodeBridgeTxProposal({
        bridgeModule,
        bridgeModuleAddress: foreignSafeDetails.crossChainModuleAddress,
        daochain,
        encodedTx,
        foreignChainId,
      });
      await submitTransaction({
        tx: {
          ...TX.GENERIC_SAFE_MULTICALL,
          onTxHash: ACTIONS.BASIC,
        },
        values: {
          title: 'Remove Gnosis Signers',
          description: 'Remove current signers from a Foreign Gnosis Safe',
          paymentToken: daoOverview.depositToken.tokenAddress,
          selectedMinion: vault.address,
          TX: [txProposal],
        },
      });
    } catch (error) {
      errorToast({
        title: 'Failed to submit Tx Proposal',
        description: error.message,
      });
    }
    setLoading(null);
  };

  useEffect(() => {
    if (
      address &&
      safeDetails?.owners?.includes(Web3Utils.toChecksumAddress(address))
    ) {
      safeOwner(true);
    }
  }, [address, safeDetails]);

  useEffect(() => {
    if (
      address &&
      foreignSafeDetails?.owners?.includes(Web3Utils.toChecksumAddress(address))
    ) {
      foreignSafeOwner(true);
    }
  }, [address, foreignSafeDetails]);

  return (
    <ContentBox mt={6}>
      <TextBox size='xs' mb={6}>
        {`${foreignSafeDetails ? 'Cross-chain ' : ''}Safe Minion`}
      </TextBox>
      <Box fontFamily='mono' mb={5}>
        <Flex
          flexWrap='wrap'
          justifyContent='space-around'
          justifyItems='flex-start'
        >
          {safeDetails ? (
            <GnosisSafeCard
              actionDetails={
                injectedProvider &&
                !vault.isMinionModule && (
                  <>
                    <Text mt={4}>
                      Actions Required
                      <Icon
                        as={TiWarningOutline}
                        color='secondary.300'
                        ml={2}
                      />
                    </Text>
                    <Flex mt={4}>
                      <ToolTipWrapper
                        placement='right'
                        tooltip
                        tooltipText={
                          isSafeOwner
                            ? SF_TOOLTIP.ADD_MODULE
                            : SF_TOOLTIP.NO_OWNER
                        }
                      >
                        <Button
                          isLoading={isLoading === 'enableMinionModule'}
                          isDisabled={!isSafeOwner}
                          mr={6}
                          onClick={submitMinionModuleTxProposal}
                          variant='outline'
                          size='sm'
                        >
                          Add Minion as Module
                        </Button>
                      </ToolTipWrapper>
                    </Flex>
                  </>
                )
              }
              handleCopy={handleCopy}
              minionDetails={
                Number(vault.minQuorum) > 0 && (
                  <Box>
                    <Text>Proposal Minimum Quorum</Text>
                    <Text fontWeight='bold'>{vault.minQuorum}%</Text>
                  </Box>
                )
              }
              safeDetails={safeDetails}
              vaultAddress={vault.address}
            />
          ) : (
            <Flex color='secondary.300' fontSize='m' alignItems='flex-start'>
              <Icon
                as={RiErrorWarningLine}
                color='secondary.300'
                mr={1}
                transform='translateY(4px)'
              />
              SafesSDK Error. Try again later
            </Flex>
          )}
          {foreignSafeDetails && (
            <GnosisSafeCard
              actionDetails={
                (!foreignSafeDetails.crossChainModuleAddress ||
                  !foreignSafeDetails.owners.includes(
                    foreignSafeDetails.crossChainModuleAddress,
                  ) > 0) && (
                  <>
                    <Text mt={4}>Actions</Text>
                    {!foreignSafeDetails.crossChainModuleAddress && (
                      <Flex mt={4}>
                        <ToolTipWrapper
                          placement='right'
                          tooltip
                          tooltipText={
                            isForeignSafeOwner &&
                            vault.foreignChainId === injectedChain.chainId
                              ? SF_TOOLTIP.ADD_BRIDGE_MODULE
                              : SF_TOOLTIP.WRONG_CHAIN_N_OWNER
                          }
                        >
                          <Button
                            isLoading={isLoading === 'enableBridgeModule'}
                            isDisabled={
                              !isForeignSafeOwner ||
                              vault.foreignChainId !== injectedChain.chainId
                            }
                            mr={6}
                            onClick={submitBridgeModuleTxProposal}
                            variant='outline'
                            rightIcon={<TiWarningOutline />}
                            size='sm'
                          >
                            Add Bridge Module
                          </Button>
                        </ToolTipWrapper>
                      </Flex>
                    )}
                    {foreignSafeDetails.crossChainModuleAddress &&
                      !foreignSafeDetails.owners.includes(
                        foreignSafeDetails.crossChainModuleAddress,
                      ) && (
                        <Flex mt={4}>
                          <ToolTipWrapper
                            placement='right'
                            tooltip
                            tooltipText={
                              daoMember && daochain === injectedChain.chainId
                                ? SF_TOOLTIP.REMOVE_SIGNERS
                                : SF_TOOLTIP.MEMBER_ONLY
                            }
                          >
                            <Button
                              isLoading={isLoading === 'removeSigners'}
                              isDisabled={
                                !daoMember || daochain !== injectedChain.chainId
                              }
                              mr={6}
                              onClick={removeSignersTxProposal}
                              variant='outline'
                              size='sm'
                            >
                              Remove Signers
                            </Button>
                          </ToolTipWrapper>
                        </Flex>
                      )}
                  </>
                )
              }
              handleCopy={handleCopy}
              safeDetails={foreignSafeDetails}
              targetChain={vault.foreignChainId}
              zodiacModules={[
                {
                  name: vault.bridgeModule,
                  address: foreignSafeDetails.crossChainModuleAddress,
                },
              ]}
              title='Foreign Gnosis Safe'
            />
          )}
        </Flex>
        {safeDetails?.gnosisSafeVersion?.split('.')[1] < 3 && (
          <Text fontSize='xs' mt={4}>
            ** Your Gnosis Safe version is {safeDetails.gnosisSafeVersion}.
            Please consider upgrading it to a newer version.
            <Link
              href={`https://gnosis-safe.io/app/${chainConfig.shortNamePrefix ||
                chainConfig.short_name}:${
                safeDetails.address
              }/settings/details`}
              isExternal
            >
              <Icon
                as={RiExternalLinkLine}
                name='explorer link'
                color='secondary.300'
                _hover={{ cursor: 'pointer' }}
              />
            </Link>
          </Text>
        )}
        {safeMinionVersion && safeMinionVersion === '1' && (
          <Text fontSize='xs' mt={4}>
            ** This is a early version of the Safe Minion. It might not work in
            the Gnosis Safe UI. Summon a new Safe Minion if you need to use that
            UI.
          </Text>
        )}
      </Box>
    </ContentBox>
  );
};

export default SafeMinionDetails;
