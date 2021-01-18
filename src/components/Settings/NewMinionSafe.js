import React, { useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import TextBox from '../Shared/TextBox';

import {
  useDao,
  useTxProcessor,
  useUser,
  useModals,
  useNetwork,
  useWeb3Connect,
  useDaoMetadata,
} from '../../contexts/PokemolContext';
import MinionSafeEasyMode from './MinionSafeEasyMode';
import MinionSafeHardMode from './MinionSafeHardMode';
import { supportedChains } from '../../utils/chains';
import { MinionSafeService } from '../../utils/minion-safe-service';
import { boostPost } from '../../utils/requests';

const NewMinionSafe = () => {
  const [loading, setLoading] = useState(false);
  const [user] = useUser();
  const [dao] = useDao();
  const [daoMetadata, updateDaoMetadata] = useDaoMetadata();
  const [web3Connect] = useWeb3Connect();
  const [network] = useNetwork();
  const { closeModals } = useModals();
  const [txProcessor, updateTxProcessor] = useTxProcessor();

  const [currentMode, setCurrentMode] = useState(1);

  const MODE = {
    1: { name: 'easy' },
    2: { name: 'hard' },
  };

  const txCallBack = (txHash, details) => {
    console.log('txCallBack', txProcessor);
    if (txProcessor && txHash) {
      txProcessor.setTx(txHash, user.username, details, true, false, false);
      txProcessor.forceCheckTx = true;

      updateTxProcessor(txProcessor);
      // close model here
      closeModals();
    }
    if (!txHash) {
      console.log('error: ', details);
      setLoading(false);
    }
  };

  const saveBoostMeta = async (delegate, minionAddress) => {
    const messageHash = web3Connect.web3.utils.sha3(dao.address);
    const signature = await web3Connect.web3.eth.personal.sign(
      messageHash,
      user.username,
    );

    const _newMinionSafe = {
      delegate,
      minionAddress,
      date: Date.now(),
      safeAddress: null,
    };

    const updateMinionSafeObject = {
      contractAddress: dao.address,
      boostKey: 'minionSafe',
      metadata: _newMinionSafe,
      network: network.network,
      signature,
    };

    console.log('updateMinionSafeObject', updateMinionSafeObject);

    const result = await boostPost('dao/boost', updateMinionSafeObject);

    if (result === 'success') {
      updateDaoMetadata({
        ...daoMetadata,
        boosts: { ...daoMetadata, customTheme: _newMinionSafe },
      });
    } else {
      alert('error: forbidden');
    }
  };

  const onSubmitExistingSafe = (values) => {
    console.log(values);
  };
  const onSubmitNewSafe = async (values) => {
    setLoading(true);

    console.log(values);
    const setupValues = {
      minionFactory: supportedChains[network.network_id].minion_factory_addr,
      safeProxyFactory: supportedChains[network.network_id].safe_proxy_factory,
      createAndAddModules:
        supportedChains[network.network_id].safe_create_and_add_modules,
      safeMasterCopy: supportedChains[network.network_id].safe_master_copy,
      moduleEnabler: supportedChains[network.network_id].module_enabler,
      network: network,
    };
    console.log('setupValues', setupValues);
    const minionSafeService = new MinionSafeService(
      web3Connect.web3,
      user.username,
      setupValues,
    );

    // await saveBoostMeta(values.applicantHidden, values.minionAddress);

    try {
      minionSafeService.setup(
        values.applicant,
        values.minionAddress,
        txCallBack,
      );
    } catch (err) {
      setLoading(false);
      console.log('error: ', err);
    }
  };

  const toggleMode = () => {
    if (currentMode === 2) {
      setCurrentMode(1);
    } else {
      setCurrentMode(2);
    }
  };

  return (
    <Box w='90%'>
      <TextBox>Minion Safe</TextBox>
      {dao?.graphData && dao.graphData.minions.length > 0 ? (
        <>
          {MODE[currentMode] === MODE[1] ? (
            <MinionSafeEasyMode
              minions={dao.graphData.minions}
              submitAction={onSubmitNewSafe}
              saveBoostMeta={saveBoostMeta}
              loading={loading}
            />
          ) : (
            <MinionSafeHardMode
              minions={dao.graphData.minions}
              submitAction={onSubmitExistingSafe}
              loading={loading}
            />
          )}
        </>
      ) : (
        <TextBox>You need to add a minion first</TextBox>
      )}

      {/* <form >
        <Box>
          <FormControl mb={5}>
            <Input name='details' placeholder='Frank' w='60%' ref={register} />
            <FormHelperText fontSize='xs' id='name-helper-text' mb={1}>
              Give your Minion a name.
            </FormHelperText>
          </FormControl>
        </Box>
        <Button type='submit' isLoading={loading}>
          Deploy
        </Button>
      </form> */}
      <Button onClick={toggleMode}>
        switch to {currentMode === 1 ? MODE[2].name : MODE[1].name}
      </Button>
    </Box>
  );
};

export default NewMinionSafe;
