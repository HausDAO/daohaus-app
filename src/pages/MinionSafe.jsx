import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Avatar,
  Button,
  Flex,
  List,
  ListIcon,
  ListItem,
  Stack,
  Box,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { utils } from 'web3';
import { MdCheckCircle } from 'react-icons/md';
import { RiDownload2Fill, RiLogoutBoxRLine } from 'react-icons/ri';

import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
import MainViewLayout from '../components/mainViewLayout';
import { boostPost, getApiGnosis } from '../utils/requests';
import { chainByID } from '../utils/chain';
import { truncateAddr } from '../utils/general';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { MinionSafeService } from '../services/minionSafeService';
import { MinionService } from '../services/minionService';

const MinionSafe = ({ daoOverview, daoMetaData }) => {
  const { daochain, daoid } = useParams();
  const { address, injectedProvider, injectedChain } = useInjectedProvider();
  const [safes, setSafes] = useState();
  const [safesDetails, setSafesDetails] = useState([]);
  const [currentSafeDetails, setCurrentSafesDetails] = useState();
  const [loading, setLoading] = useState(true);

  const pendingMinionSafe = window.localStorage.getItem('pendingMinionSafe');

  const saveBoostMeta = async (delegate, safeAddress) => {
    const messageHash = injectedProvider.utils.sha3(daoid);
    const signature = await injectedProvider.eth.personal.sign(
      messageHash,
      address,
    );

    const newMinionSafe = {
      delegate,
      safeAddress,
      date: Date.now(),
    };

    const updateSafe = {
      contractAddress: daoid,
      boostKey: 'minionSafe',
      metadata: newMinionSafe,
      network: injectedChain.network,
      signature,
    };

    const updateRes = await boostPost('dao/boost', updateSafe);
    console.log(updateRes);
    // if (updateRes === 'success') {
    //   updateDaoMetadata({
    //     ...daoMetadata,
    //     boosts: { ...daoMetadata, minionSafe: _newMinionSafe },
    //   });
    // } else {
    //   alert('error: forbidden');
    // }
  };

  const submitProposal = async (minion, safe, safeTx) => {
    console.log(minion, safe, safeTx);

    const setupValues = {
      minionFactory: chainByID(daochain).minion_factory_addr,
      safeProxyFactory: chainByID(daochain).safe_proxy_factory,
      createAndAddModules: chainByID(daochain).safe_create_and_add_modules,
      safeMasterCopy: chainByID(daochain).safe_master_copy,
      moduleEnabler: chainByID(daochain).module_enabler,
    };
    console.log('setupValues', setupValues);
    const minionSafeService = new MinionSafeService({
      web3: injectedProvider,
      setupValues,
    });

    const executeData = await minionSafeService.execTransactionFromModule(
      safeTx.to,
      safeTx.value,
      safeTx.data,
      safeTx.operation,
    );

    console.log(executeData);

    const details = { description: 'Minion Safe Test' };
    const args = [safe, 0, executeData, details];

    try {
      // TODO set up poll and onTxHash
      const poll = '';
      const onTxHash = '';

      await MinionService({
        web3: injectedProvider,
        minion,
        chainID: daochain,
      })('proposeAction')({
        args,
        address,
        poll,
        onTxHash,
      });
    } catch (err) {
      setLoading(false);
      console.log('error: ', err);
    }
  };

  useEffect(() => {
    const safeAddress = daoMetaData?.boosts?.minionSafe?.metadata?.safeAddress;
    const getCurrentSafe = async () => {
      const details = {};
      const networkName = chainByID(daochain).short_name;

      const res = await getApiGnosis(
        networkName,
        `safes/${safeAddress}/all-transactions/`,
      );
      console.log('res', res);
      details.allTransactions = res.results;

      const res1 = await getApiGnosis(
        networkName,
        `safes/${safeAddress}/collectibles/`,
      );
      console.log('res1', res1);
      details.collectibles = res1;

      const res2 = await getApiGnosis(
        networkName,
        `safes/${safeAddress}/balances/`,
      );
      console.log('res2', res2);

      details.balances = res2;
      console.log('details', details);

      setCurrentSafesDetails(details);
    };
    const getDelegateSafes = async () => {
      console.log(
        'pendingMinionSafe.delegateAddress',
        JSON.parse(pendingMinionSafe),
      );
      setLoading(true);
      const promises = [];
      const networkName = chainByID(daochain).short_name;
      const endpoint = `owners/${
        JSON.parse(pendingMinionSafe).delegateAddress
      }/`;
      const res = promises.push(getApiGnosis(networkName, endpoint));
      console.log('delegate safes', res);
      // this is going to have problems with more than one minion
      const minionEndpoint = `owners/${utils.toChecksumAddress(
        daoOverview.minions[0].minionAddress,
      )}/`;
      promises.push(getApiGnosis(networkName, minionEndpoint));
      const responses = await Promise.all(promises);
      const intersection = responses[0].safes.filter(element =>
        responses[1].safes.includes(element),
      );
      setSafes(intersection);
    };
    console.log(daochain, pendingMinionSafe, daoOverview?.minions);
    if (!daochain || !daoOverview?.minions) {
      console.log('bla');
      return;
    }
    if (safeAddress) {
      getCurrentSafe();
      return;
    }
    getDelegateSafes();
  }, [pendingMinionSafe, daochain, daoOverview?.minions, daoMetaData]);

  useEffect(() => {
    if (!daochain || !safes) {
      return;
    }
    const getSafesDetails = async () => {
      setLoading(true);
      const networkName = chainByID(daochain).short_name;
      const promises = [];
      safes.forEach(safe => {
        const endpoint = `safes/${safe}/`;
        const res = getApiGnosis(networkName, endpoint);
        promises.push(res);
      });
      const allSafes = await Promise.all(promises);
      console.log(allSafes);

      setSafesDetails(allSafes);
      setLoading(false);
    };
    getSafesDetails();
  }, [safes, daochain]);
  console.log(safesDetails);

  return (
    <MainViewLayout header='Minion Safe'>
      <ContentBox d='flex' flexDirection='column' position='relative' mt={2}>
        {safes && safes.length ? (
          <List>
            {' '}
            {safesDetails.map(safe => (
              <ListItem key={safe.address}>
                <TextBox>
                  {safe.address}
                  <Button
                    onClick={() =>
                      saveBoostMeta(
                        JSON.parse(pendingMinionSafe).delegateAddress,
                        safe.address,
                      )
                    }
                  >
                    Finish Setup
                  </Button>
                </TextBox>
                <List>
                  {safe.owners.map(owner => (
                    <ListItem key={owner}>
                      <ListIcon as={MdCheckCircle} color='green.500' />
                      {owner}
                    </ListItem>
                  ))}
                </List>
              </ListItem>
            ))}
          </List>
        ) : (
          <>
            {daoMetaData?.boosts?.minionSafe?.metadata?.safeAddress ? (
              <>
                {currentSafeDetails ? (
                  <Stack spacing={5}>
                    <Stack spacing={3}>
                      <TextBox>Transactions</TextBox>
                      <Stack spacing={4} pl={4}>
                        {currentSafeDetails.allTransactions &&
                          currentSafeDetails.allTransactions
                            .reverse()
                            .map((tx, idx) => (
                              <Flex key={tx.txHash || tx.safeTxHash || idx}>
                                {tx.transfers.length ? (
                                  <Box minW='40%'>
                                    <HStack
                                      as={Flex}
                                      spacing={4}
                                      align='center'
                                    >
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
                                      <HStack
                                        as={Flex}
                                        spacing={3}
                                        align='center'
                                      >
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

                                    <Button
                                      variant='outline'
                                      onClick={() =>
                                        submitProposal(
                                          daoOverview.minions[0].minionAddress,
                                          daoMetaData.boosts.minionSafe.metadata
                                            .safeAddress,
                                          tx,
                                        )
                                      }
                                    >
                                      Submit Proposal
                                    </Button>
                                  </Flex>
                                )}
                              </Flex>
                            ))}
                      </Stack>
                    </Stack>

                    <Stack spacing={3}>
                      <TextBox>Balances</TextBox>
                      <Stack spacing={2} pl={4}>
                        {currentSafeDetails.balances &&
                          currentSafeDetails.balances.map((token, idx) => (
                            <Box key={idx}>
                              <TextBox variant='value' size='lg'>
                                {`${token.token ||
                                  chainByID(daochain).short_name} 
                                ${utils.fromWei(token.balance)}`}
                              </TextBox>
                            </Box>
                          ))}
                      </Stack>
                    </Stack>
                    <Stack spacing={3}>
                      <TextBox>Collectibles</TextBox>
                      <Stack spacing={2} pl={4}>
                        {currentSafeDetails?.collectibles?.length ? (
                          currentSafeDetails.collectibles.map((token, idx) => {
                            console.log(token);
                            return (
                              <Box key={idx}>
                                <Avatar src={token.imageUri} />
                                {`${token.name} ${token.description}`}
                              </Box>
                            );
                          })
                        ) : (
                          <TextBox variant='value' size='lg'>
                            None found
                          </TextBox>
                        )}
                      </Stack>
                    </Stack>
                  </Stack>
                ) : (
                  <TextBox>Loading</TextBox>
                )}
              </>
            ) : (
              <TextBox>{loading ? 'Loading... ' : 'No Safes'}</TextBox>
            )}
          </>
        )}
      </ContentBox>
    </MainViewLayout>
  );
};

export default MinionSafe;
