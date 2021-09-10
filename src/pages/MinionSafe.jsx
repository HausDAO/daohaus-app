import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Avatar,
  Button,
  Flex,
  Link,
  Skeleton,
  Stack,
  Box,
  Icon,
  HStack,
  Text,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  Tooltip,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { utils } from 'web3';
import { BiArrowBack } from 'react-icons/bi';
import { BsThreeDots } from 'react-icons/bs';
import {
  RiDownload2Fill,
  RiExternalLinkLine,
  RiLogoutBoxRLine,
} from 'react-icons/ri';
import { VscLinkExternal } from 'react-icons/vsc';

import BalanceList from '../components/balanceList';
import { useDaoMember } from '../contexts/DaoMemberContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useTX } from '../contexts/TXContext';
import { useUser } from '../contexts/UserContext';
import ContentBox from '../components/ContentBox';
import Loading from '../components/loading';
import TextBox from '../components/TextBox';
import MainViewLayout from '../components/mainViewLayout';
import GenericModal from '../modals/genericModal';
import { ToolTipWrapper } from '../staticElements/wrappers';
import { getApiGnosis } from '../utils/requests';
import { chainByID } from '../utils/chain';
import {
  daoConnectedAndSameChain,
  detailsToJSON,
  truncateAddr,
} from '../utils/general';
import { MinionSafeService } from '../services/minionSafeService';
import { MinionService } from '../services/minionService';
import { createPoll } from '../services/pollService';

// ================= SafeAction Menu =================

const SafeActionMenu = ({ minionSafe }) => {
  const { daochain } = useParams();
  const { isMember } = useDaoMember();
  const { address, injectedChain } = useInjectedProvider();
  const { setGenericModal } = useOverlay();
  const [modalData, setModalData] = useState(null);

  const handleActionClick = action => {
    setModalData({
      id: action.modalName,
      formLego: {
        ...action.formLego,
        localValues: {
          ...action.localValues,
          minionAddress: minionSafe.minionAddress,
          safeAddress: minionSafe.safeAddress,
        },
      },
    });
    setGenericModal({ [action.modalName]: true });
  };

  const actions = [
    {
      menuLabel: `${minionSafe.delegateAddress ? 'Swap' : 'Add'} DAO Delegate`,
      toolTipLabel: 'Add/Update DAO Delegate on the Safe',
      modalName: '',
      formLego: {},
      localValues: {},
    },
    {
      menuLabel: 'Add a New Module',
      toolTipLabel: 'Enable a new module on the Safe',
      modalName: '',
      formLego: {},
      localValues: {},
    },
    {
      menuLabel: 'Update Signature Threshold',
      toolTipLabel: 'Update the min. amount of signatures for procesing txs.',
      modalName: '',
      formLego: {},
      localValues: {},
    },
  ];

  return (
    <>
      {modalData && (
        <GenericModal
          modalId={modalData.id}
          formLego={modalData.formLego}
          closeOnOverlayClick
        />
      )}
      <Menu isDisabled>
        <MenuButton
          as={Button}
          size='sm'
          color='secondary.400'
          _hover={{ cursor: 'pointer' }}
        >
          <Icon
            as={BsThreeDots}
            color='white'
            h='20px'
            w='20px'
            _hover={{ cursor: 'pointer' }}
          />
        </MenuButton>
        <MenuList>
          {actions.map(action => {
            return (
              <MenuItem
                key={action.menuLabel}
                onClick={() => handleActionClick(action)}
                isDisabled={
                  !(
                    isMember &&
                    daoConnectedAndSameChain(
                      address,
                      daochain,
                      injectedChain?.chainId,
                    )
                  )
                }
              >
                <Tooltip
                  hasArrow
                  shouldWrapChildren
                  placement='bottom'
                  label={action.toolTipLabel}
                >
                  {action.menuLabel}
                </Tooltip>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </>
  );
};

// ===================================================

const MinionSafe = ({ daoMetaData }) => {
  const { daochain, daoid } = useParams();
  const { address, injectedProvider, injectedChain } = useInjectedProvider();
  const [currentSafeDetails, setCurrentSafesDetails] = useState();

  const {
    errorToast,
    successToast,
    setProposalModal,
    setTxInfoModal,
    setGenericModal,
  } = useOverlay();
  const { refreshDao } = useTX();
  const { cachePoll, resolvePoll } = useUser();

  const now = (new Date().getTime() / 1000).toFixed();
  const { network } = chainByID(daochain);

  const submitMinion = async (args, minionAddress, serviceName = null) => {
    try {
      const poll = createPoll({ action: 'minionProposeAction', cachePoll })({
        minionAddress,
        createdAt: now,
        chainID: daochain,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: 'There was an error.',
            });
            resolvePoll(txHash);
            console.error(`Could not find a matching proposal: ${error}`);
          },
          onSuccess: txHash => {
            successToast({
              title: 'Minion proposal submitted.',
            });
            refreshDao();
            resolvePoll(txHash);
          },
        },
      });
      const onTxHash = () => {
        setGenericModal(false);
        setProposalModal(false);
        setTxInfoModal(true);
      };
      await MinionService({
        web3: injectedProvider,
        minion: minionAddress,
        chainID: daochain,
      })(serviceName || 'proposeAction')({
        args,
        address,
        poll,
        onTxHash,
      });
    } catch (err) {
      console.log('error: ', err);
    }
  };

  const submitProposal = async (minion, safe, safeTx) => {
    const minionSafeService = MinionSafeService({
      web3: injectedProvider,
      chainID: injectedChain.chain_id,
    });

    // Execute using Minion Module
    // const executeData = await minionSafeService('execTransactionFromModule')({
    //   to: safeTx.to,
    //   value: safeTx.value,
    //   data: safeTx.data,
    //   operation: safeTx.operation,
    // });
    // Approve Tx using Minion as a signer
    const executeData = await minionSafeService('approveHash')({
      safeAddress: safe,
      args: [safeTx.safeTxHash],
    });

    console.log('executeData', executeData);

    const details = detailsToJSON({
      title: `SafeTx ApproveHash for Delegate Proposal`,
      description: `Safe Tx`,
      type: 'approveHash',
    });

    await submitMinion([safe, '0', executeData, details], minion);
  };

  const swapCosigner = async () => {
    const safeAddress = daoMetaData?.boosts?.minionSafe?.metadata?.safeAddress;
    if (!safeAddress) {
      return;
    }
    const moduleAddress =
      daoMetaData?.boosts?.minionSafe?.metadata?.minionAddress;
    // TODO: get params from modal / validate oldOwner is current cosigner
    const oldOwner = utils.toChecksumAddress(
      daoMetaData?.boosts?.minionSafe?.metadata?.delegateAddress,
    );
    const newOwner = '0x1F069c5B3D2dD6716020959d2c7dEfb01EEaD296';
    console.log('swapCosigner', oldOwner, newOwner);

    const minionSafeService = MinionSafeService({
      web3: injectedProvider,
      chainID: injectedChain.chain_id,
    });

    const owners = await minionSafeService('call')({
      safeAddress,
      method: 'getOwners',
      args: [],
    });

    const ownerIndex = owners.findIndex(owner => owner === oldOwner);
    if (ownerIndex < 0) {
      // TODO: errorToast
      console.error('Failed to fetch safe owners');
    }
    const prevOwner = owners[ownerIndex - 1];

    const swapOwnerData = await minionSafeService('swapOwner')({
      safeAddress,
      args: [prevOwner, oldOwner, newOwner],
    });
    console.log('swapOwner encoded', swapOwnerData);

    const executeData = await minionSafeService('execTransactionFromModule')({
      to: safeAddress,
      value: '0',
      data: swapOwnerData,
      operation: 0,
    });
    console.log('executeData', executeData);

    const details = detailsToJSON({
      title: `SafeTx Swap Owner`,
      description: `Swap from ${oldOwner} to ${newOwner}`,
      type: 'safeExecuteFromModule', // TODO:
    });

    await submitMinion([safeAddress, '0', executeData, details], moduleAddress);
  };

  // Get Safe Info
  // TODO: If 404 error, show a msg that Safe is being indexed
  //  > sometimes this happens when the Safe isn't opened at least once from Gnosis UI by one of the owners
  const fetchCurrentSafe = async () => {
    const safeAddress = daoMetaData?.boosts?.minionSafe?.metadata?.safeAddress;
    if (!daochain || !safeAddress) {
      console.log('NO SAFE ADDRESS', daochain, safeAddress);
      return;
    }
    const details = {};

    details.status = await getApiGnosis(network, `safes/${safeAddress}/`);
    console.log('Status', details.status);

    const txs = await getApiGnosis(
      network,
      `safes/${safeAddress}/all-transactions/`,
    );
    details.allTransactions = txs.results;
    console.log('txs', txs.results);

    const collectibles = await getApiGnosis(
      network,
      `safes/${safeAddress}/collectibles/`,
    );
    details.collectibles = collectibles;
    console.log('collectibles', collectibles);

    const balances = await getApiGnosis(
      network,
      // `safes/${safeAddress}/balances/`,
      `safes/${safeAddress}/balances/usd/?trusted=false&exclude_spam=false`,
    );
    // mapping balances to match the data format of BalanceList component
    details.balances = balances.map(b => {
      return {
        decimals: b.token?.decimals || 18,
        id: b.tokenAddress || ethers.constants.AddressZero,
        logoUri: b.token?.logoUri,
        symbol: b.token?.symbol || 'ETH',
        tokenBalance: b.balance,
        totalUSD: Number.parseFloat(b.fiatBalance),
        usd: Number.parseFloat(b.fiatConversion),
        ...b,
      };
    });
    console.log('balances', balances);

    const delegates = await getApiGnosis(
      network,
      `safes/${safeAddress}/delegates/`,
    );
    details.delegates = delegates.results;
    console.log('details', details);

    return details;
  };

  useEffect(async () => {
    const safeAddress = daoMetaData?.boosts?.minionSafe?.metadata?.safeAddress;
    if (!daochain || !safeAddress || currentSafeDetails) {
      return;
    }
    console.log('SafeBoost', daoMetaData?.boosts?.minionSafe);

    if (safeAddress) {
      setCurrentSafesDetails(await fetchCurrentSafe());
    }
  }, [daoMetaData]);

  const gnosisSafeURI = `https://${
    network !== 'mainnet' ? `${network}.` : ''
  }gnosis-safe.io/app/#/safes/${
    daoMetaData?.boosts?.minionSafe?.metadata?.safeAddress
  }`;

  return (
    <MainViewLayout header='Minion Safe' isDao>
      <Flex justify='space-between' align='center' mb={6}>
        <Flex
          as={RouterLink}
          to={`/dao/${daochain}/${daoid}/settings`}
          align='center'
          mb={3}
        >
          <Icon as={BiArrowBack} color='secondary.500' mr={2} />
          Back
        </Flex>
      </Flex>
      {!currentSafeDetails && <Loading message='Fetching Gnosis Safe...' />}
      {currentSafeDetails && (
        <Flex wrap='wrap'>
          <Box
            w={['100%', null, null, null, '60%']}
            pr={[0, null, null, null, 6]}
            pb={6}
          >
            <Flex
              direction='row'
              align='center'
              justify='space-between'
              w='100%'
              mb={5}
            >
              <TextBox size='xs'>Minion Safe Settings</TextBox>
              <Box size='xs' color='secondary.500' ml='auto' mr={5}>
                Actions
              </Box>
              <SafeActionMenu
                minionSafe={daoMetaData?.boosts?.minionSafe?.metadata}
              />
            </Flex>
            <ContentBox mt={2}>
              <Stack spacing={4}>
                <Flex
                  direction='row'
                  w='100%'
                  justify='space-between'
                  mt={6}
                  mb={6}
                >
                  <Box>
                    <TextBox size='xs'>Asset Balance</TextBox>
                    <TextBox size='lg' variant='value'>
                      {`$${currentSafeDetails.balances
                        ?.reduce((a, b) => a.totalUSD + b.totalUSD, 0)
                        ?.toFixed(2) || 0}`}
                    </TextBox>
                  </Box>
                  <Box>
                    <TextBox size='xs'>Owners</TextBox>
                    <TextBox size='lg' variant='value'>
                      {currentSafeDetails.status?.owners?.length}
                    </TextBox>
                  </Box>
                  <Box>
                    <TextBox size='xs'>Sig. Threshold</TextBox>
                    <TextBox size='lg' variant='value'>
                      {`${currentSafeDetails.status?.threshold}/${currentSafeDetails.status?.owners?.length}`}
                    </TextBox>
                  </Box>
                </Flex>
                <Flex justify='space-between'>
                  <TextBox size='xs'>Safe Contract</TextBox>
                  <Skeleton isLoaded={daoid}>
                    <Box
                      fontFamily='mono'
                      variant='value'
                      fontSize='sm'
                      as={Link}
                      href={gnosisSafeURI}
                      target='_blank'
                      rel='noreferrer noopener'
                    >
                      <Flex color='secondary.400' align='center'>
                        <Box>
                          {
                            daoMetaData?.boosts?.minionSafe?.metadata
                              ?.safeAddress
                          }
                        </Box>
                        <Icon
                          as={RiExternalLinkLine}
                          color='secondary.400'
                          mx={2}
                        />
                      </Flex>
                    </Box>
                  </Skeleton>
                </Flex>
                <Flex justify='space-between'>
                  <TextBox size='xs'>Minion</TextBox>
                  <Skeleton isLoaded={daoid}>
                    <Box
                      fontFamily='mono'
                      variant='value'
                      fontSize='sm'
                      as={Link}
                      href={`../vaults/minion/${daoMetaData?.boosts?.minionSafe?.metadata?.minionAddress?.toLowerCase()}`}
                      rel='noreferrer noopener'
                    >
                      <Flex color='secondary.400' align='center'>
                        <Box>
                          {
                            daoMetaData?.boosts?.minionSafe?.metadata
                              ?.minionAddress
                          }
                        </Box>
                      </Flex>
                    </Box>
                  </Skeleton>
                </Flex>
                <Flex justify='space-between'>
                  <TextBox size='xs'>DAO Delegate</TextBox>
                  <Skeleton isLoaded={daoid}>
                    <Box
                      fontFamily='mono'
                      variant='value'
                      fontSize='sm'
                      as={Link}
                      href=''
                      target='_blank'
                      rel='noreferrer noopener'
                    >
                      <Flex color='secondary.400' align='center'>
                        <Box>
                          {daoMetaData?.boosts?.minionSafe?.metadata
                            ?.delegateAddress || '--'}
                        </Box>
                      </Flex>
                    </Box>
                  </Skeleton>
                </Flex>
                <Flex mt={6}>
                  <ToolTipWrapper
                    placement='right'
                    tooltip
                    tooltipText={{
                      body:
                        'A DAO Delegate can propose a Tx through the Safe UI',
                    }}
                    href={gnosisSafeURI}
                  >
                    <Button
                      leftIcon={<Icon as={VscLinkExternal} />}
                      variant='outline'
                      isDisabled={
                        address !==
                        daoMetaData?.boosts?.minionSafe?.metadata
                          ?.delegateAddress
                      }
                    >
                      Propose New Tx
                    </Button>
                  </ToolTipWrapper>
                  <Button variant='outline' onClick={() => swapCosigner()}>
                    Swap cosigner
                  </Button>
                </Flex>
              </Stack>
            </ContentBox>
            <ContentBox mt={2}>
              <TextBox size='xs'>TRANSACTIONS</TextBox>
              <Stack spacing={4} pl={4}>
                {currentSafeDetails.allTransactions &&
                  currentSafeDetails.allTransactions
                    .reverse()
                    .map((tx, idx) => (
                      <Flex key={tx.txHash || tx.safeTxHash || idx}>
                        {tx.transfers.length ? (
                          <Box minW='40%'>
                            <HStack as={Flex} spacing={4} align='center'>
                              <Icon as={RiDownload2Fill} />

                              {tx.transfers[0].value && (
                                <TextBox variant='value' size='lg'>
                                  {utils.fromWei(tx.transfers[0].value)}
                                </TextBox>
                              )}
                            </HStack>

                            <TextBox size='xs' mt={2}>
                              {tx.transfers[0].type}
                            </TextBox>
                          </Box>
                        ) : (
                          <Flex align='center'>
                            <Box mr={4}>
                              <HStack as={Flex} spacing={3} align='center'>
                                <Icon as={RiLogoutBoxRLine} />
                                <TextBox variant='value' size='lg'>
                                  {`${utils.fromWei(
                                    tx.value,
                                  )} to ${truncateAddr(tx.to)}`}
                                </TextBox>
                              </HStack>

                              <TextBox size='xs' mt={2}>
                                {tx.txType}
                              </TextBox>
                            </Box>
                            {!tx.isExecuted && (
                              <Button
                                variant='outline'
                                onClick={() =>
                                  submitProposal(
                                    daoMetaData?.boosts?.minionSafe?.metadata
                                      ?.minionAddress,
                                    daoMetaData?.boosts?.minionSafe?.metadata
                                      ?.safeAddress,
                                    tx,
                                  )
                                }
                              >
                                Submit Proposal
                              </Button>
                            )}
                          </Flex>
                        )}
                      </Flex>
                    ))}
              </Stack>
            </ContentBox>
          </Box>
          <Box
            w={['100%', null, null, null, '40%']}
            pr={[0, null, null, null, 6]}
            pb={6}
          >
            <Flex
              direction='row'
              align='center'
              justify='space-between'
              w='100%'
            >
              <TextBox size='xs'>Gnosis Safe</TextBox>
              <Box size='xs' color='secondary.500' ml='auto' mr={5}>
                View
              </Box>
            </Flex>
            <ContentBox mt={2}>
              <Accordion allowToggle border='none' borderWidth='0'>
                <AccordionItem border='none'>
                  <AccordionButton>
                    <Flex direction='row' width='100%' justify='space-between'>
                      <TextBox size='xs' mb={6}>
                        Modules
                      </TextBox>
                      <AccordionIcon />
                    </Flex>
                  </AccordionButton>
                  <AccordionPanel>
                    <Flex>
                      <Box w='30%' d={['none', null, null, 'inline-block']}>
                        <TextBox size='xs'>Name</TextBox>
                      </Box>
                      <Box w='70%' d={['none', null, null, 'inline-block']}>
                        <TextBox size='xs'>Address</TextBox>
                      </Box>
                      {/* <Box w={['35%', null, null, '35%']} /> */}
                    </Flex>
                    {currentSafeDetails.status?.modules ? (
                      currentSafeDetails.status?.modules.map((module, idx) => (
                        <Flex key={idx}>
                          <Box w='30%' d={['none', null, null, 'inline-block']}>
                            <TextBox variant='value' size='xs'>
                              {idx}
                            </TextBox>
                          </Box>
                          <Box w='70%' d={['none', null, null, 'inline-block']}>
                            <TextBox variant='value' size='xs'>
                              {module}
                            </TextBox>
                          </Box>
                        </Flex>
                      ))
                    ) : (
                      <Text fontFamily='mono' mt='5'>
                        No modules enabled
                      </Text>
                    )}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </ContentBox>
            <BalanceList
              vault={daoMetaData?.boosts?.minionSafe?.metadata?.minionAddress?.toLowerCase()}
              balances={[currentSafeDetails.balances[0]]}
              isNativeToken
            />
            <BalanceList
              vault={daoMetaData?.boosts?.minionSafe?.metadata?.minionAddress?.toLowerCase()}
              balances={currentSafeDetails.balances.filter(b => b.tokenAddress)}
            />
            <ContentBox mt={6}>
              <TextBox size='xs'>COLLECTIBLES</TextBox>
              <Flex direction='row' justify='space-between'>
                {/* <TextBox w='100%'>ACTIONS</TextBox> */}
              </Flex>
              <Stack spacing={2} pl={4}>
                {currentSafeDetails?.collectibles?.length ? (
                  currentSafeDetails.collectibles.map((token, idx) => {
                    return (
                      <Box key={idx}>
                        <Avatar src={token.imageUri} />
                        {`${token.name} ${token.description}`}
                      </Box>
                    );
                  })
                ) : (
                  <TextBox variant='value' size='xs'>
                    None found
                  </TextBox>
                )}
              </Stack>
            </ContentBox>
          </Box>
        </Flex>
      )}
    </MainViewLayout>
  );
};

export default MinionSafe;
