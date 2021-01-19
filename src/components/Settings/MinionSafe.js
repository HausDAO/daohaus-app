import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Flex,
  List,
  ListIcon,
  ListItem,
  OrderedList,
} from '@chakra-ui/react';
import { utils } from 'web3';

import {
  useDao,
  useDaoMetadata,
  useNetwork,
  useTxProcessor,
  useUser,
  useWeb3Connect,
} from '../../contexts/PokemolContext';
import ContentBox from '../Shared/ContentBox';
import TextBox from '../Shared/TextBox';
import { boostPost, getApiGnosis } from '../../utils/requests';
import { supportedChains } from '../../utils/chains';
import { MdCheckCircle } from 'react-icons/md';
import { truncateAddr } from '../../utils/helpers';
import { MinionSafeService } from '../../utils/minion-safe-service';
import { MinionService } from '../../utils/minion-service';

const MinionSafe = () => {
  const [network] = useNetwork();
  const [dao] = useDao();
  const [user] = useUser();
  const [txProcessor, updateTxProcessor] = useTxProcessor();
  const [daoMetadata, updateDaoMetadata] = useDaoMetadata();

  const [web3Connect] = useWeb3Connect();
  const [safes, setSafes] = useState();
  const [safesDetails, setSafesDetails] = useState([]);
  const [currentSafeDetails, setCurrentSafesDetails] = useState();
  const [loading, setLoading] = useState(true);

  const pendingMinionSafe = window.localStorage.getItem('pendingMinionSafe');

  const txCallBack = (txHash, details) => {
    console.log('txCallBack', txProcessor);
    if (txProcessor && txHash) {
      txProcessor.setTx(txHash, user.username, details, true, false, false);
      txProcessor.forceCheckTx = true;

      updateTxProcessor(txProcessor);
      // close model here
    }
    if (!txHash) {
      console.log('error: ', details);
      setLoading(false);
    }
  };

  const saveBoostMeta = async (delegate, safeAddress) => {
    const messageHash = web3Connect.web3.utils.sha3(dao.address);
    const signature = await web3Connect.web3.eth.personal.sign(
      messageHash,
      user.username,
    );

    const _newMinionSafe = {
      delegate,
      safeAddress,
      date: Date.now(),
    };

    const updateMinionSafeObject = {
      contractAddress: dao.address,
      boostKey: 'minionSafe',
      metadata: _newMinionSafe,
      network: network.network,
      signature,
    };

    const result = await boostPost('dao/boost', updateMinionSafeObject);

    if (result === 'success') {
      updateDaoMetadata({
        ...daoMetadata,
        boosts: { ...daoMetadata, minionSafe: _newMinionSafe },
      });
    } else {
      alert('error: forbidden');
    }
  };

  const submitProposal = async (minion, safe, safeTx) => {
    console.log(minion, safe, safeTx);

    const setupValues = {
      minionFactory: supportedChains[network.network_id].minion_factory_addr,
      safeProxyFactory: supportedChains[network.network_id].safe_proxy_factory,
      createAndAddModules:
        supportedChains[network.network_id].safe_create_and_add_modules,
      safe: safe,
      network: network,
    };
    console.log('setupValues', setupValues);
    const minionSafeService = new MinionSafeService(
      web3Connect.web3,
      user.username,
      setupValues,
    );

    const executeData = await minionSafeService.execTransactionFromModule(
      safeTx.to,
      safeTx.value,
      safeTx.data,
      safeTx.operation,
    );

    console.log(executeData);

    const minionSetupValues = {
      minion,
      actionVlaue: '0',
    };
    const minionService = new MinionService(
      web3Connect.web3,
      user.username,
      minionSetupValues,
    );
    const description = 'Minion Safe Test';

    try {
      // async propose(actionTo, actionVlaue, actionData, description, callback)
      minionService.propose(safe, 0, executeData, description, txCallBack);
    } catch (err) {
      setLoading(false);
      console.log('error: ', err);
    }
  };

  useEffect(() => {
    const safeAddress = daoMetadata?.boosts?.minionSafe?.metadata?.safeAddress;
    const getCurrentSafe = async () => {
      const details = {};
      const networkName = supportedChains[network.network_id].short_name;

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
      const networkName = supportedChains[network.network_id].short_name;
      const endpoint = `owners/${
        JSON.parse(pendingMinionSafe).delegateAddress
      }/`;
      const res = promises.push(getApiGnosis(networkName, endpoint));
      console.log('delegate safes', res);
      // this is going to have problems with more than one minion
      const minionEndpoint = `owners/${utils.toChecksumAddress(
        dao.graphData.minions[0].minionAddress,
      )}/`;
      promises.push(getApiGnosis(networkName, minionEndpoint));
      const responses = await Promise.all(promises);
      const intersection = responses[0].safes.filter((element) =>
        responses[1].safes.includes(element),
      );
      setSafes(intersection);
    };

    if (!network || !pendingMinionSafe || !dao?.graphData?.minions) {
      return;
    }
    if (safeAddress) {
      getCurrentSafe();
      return;
    }
    getDelegateSafes();
  }, [pendingMinionSafe, network, dao?.graphData?.minions, daoMetadata]);

  useEffect(() => {
    if (!network || !safes) {
      return;
    }
    const getSafesDetails = async () => {
      setLoading(true);
      const networkName = supportedChains[network.network_id].short_name;
      const promises = [];
      safes.forEach((safe) => {
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
  }, [safes, network]);

  return (
    <ContentBox d='flex' flexDirection='column' position='relative' mt={2}>
      <Flex>
        <TextBox>Gnosis Safes</TextBox>
      </Flex>

      {safes && safes.length ? (
        <List>
          {' '}
          {safesDetails.map((safe) => (
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
                {safe.owners.map((owner) => (
                  <ListItem key={owner}>
                    <ListIcon as={MdCheckCircle} color='green.500' /> {owner}
                  </ListItem>
                ))}
              </List>
            </ListItem>
          ))}
        </List>
      ) : (
        <>
          {daoMetadata?.boosts?.minionSafe?.metadata?.safeAddress ? (
            <>
              {currentSafeDetails ? (
                <>
                  <TextBox>Transactions</TextBox>
                  <OrderedList>
                    {currentSafeDetails.allTransactions &&
                      currentSafeDetails.allTransactions.reverse().map((tx) => (
                        <ListItem key={tx.txHash || tx.safeTxHash}>
                          {tx.transfers.length ? (
                            <>
                              {tx.transfers[0].type}{' '}
                              {tx.transfers[0].value &&
                                utils.fromWei(tx.transfers[0].value)}{' '}
                              in
                            </>
                          ) : (
                            <>
                              {tx.txType} {utils.fromWei(tx.value)} to{' '}
                              {truncateAddr(tx.to)}{' '}
                              <Button
                                onClick={() =>
                                  submitProposal(
                                    dao.graphData.minions[0].minionAddress,
                                    daoMetadata.boosts.minionSafe.metadata
                                      .safeAddress,
                                    tx,
                                  )
                                }
                              >
                                Submit Proposal
                              </Button>
                            </>
                          )}
                        </ListItem>
                      ))}
                  </OrderedList>
                  <TextBox>Balances</TextBox>
                  <List>
                    {currentSafeDetails.balances &&
                      currentSafeDetails.balances.map((token, idx) => (
                        <ListItem key={idx}>
                          {token.token ||
                            supportedChains[network.network_id].short_name}{' '}
                          {utils.fromWei(token.balance)}
                        </ListItem>
                      ))}
                  </List>
                  <TextBox>Collectables</TextBox>
                  <List>
                    {currentSafeDetails.collectibles &&
                      currentSafeDetails.collectibles.map((token, idx) => (
                        <ListItem key={idx}>
                          <Avatar src={token.imageUri} />
                          {token.name} {token.description}
                        </ListItem>
                      ))}
                  </List>
                </>
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
  );
};

export default MinionSafe;
