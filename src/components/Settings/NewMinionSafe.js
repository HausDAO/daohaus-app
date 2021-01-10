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
} from '../../contexts/PokemolContext';
import MinionSafeEasyMode from './MinionSafeEasyMode';
import MinionSafeHardMode from './MinionSafeHardMode';
import { supportedChains } from '../../utils/chains';
import { MinionSafeService } from '../../utils/minion-safe-service';

const NewMinionSafe = () => {
  const [loading, setLoading] = useState(false);
  const [user] = useUser();
  const [dao] = useDao();
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
  const onSubmitExistingSafe = (values) => {
    console.log(values);
  };
  const onSubmitNewSafe = (values) => {
    setLoading(true);

    console.log(values);
    const setupValues = {
      minionFactory: supportedChains[network.network_id].minion_factory_addr,
      safeProxyFactory: supportedChains[network.network_id].safe_proxy_factory,
      createAndAddModules:
        supportedChains[network.network_id].safe_create_and_add_modules,
      safeMasterCopy: supportedChains[network.network_id].safe_master_copy,
    };
    const minionSafeService = new MinionSafeService(
      web3Connect.web3,
      user.username,
      setupValues,
    );

    try {
      minionSafeService.setup(
        values.delegateAddress,
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
