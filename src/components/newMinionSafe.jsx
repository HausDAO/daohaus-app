import React, { useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import TextBox from './TextBox';

import MinionSafeEasyMode from './minionSafeEasyMode';
import MinionSafeHardMode from './minionSafeHardMode';
import { chainByID } from '../utils/chain';

import { MinionSafeService } from '../services/minionSafeService';
import { boostPost } from '../utils/requests';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

const NewMinionSafe = ({ daoOverview }) => {
  const [loading, setLoading] = useState(false);
  const { daochain, daoid } = useParams();
  const { address, injectedProvider, injectedChain } = useInjectedProvider();
  const [currentMode, setCurrentMode] = useState(1);

  const MODE = {
    1: { name: 'easy' },
    2: { name: 'hard' },
  };

  const saveBoostMeta = async (delegate, minionAddress) => {
    const messageHash = injectedProvider.utils.sha3(daoid);
    const signature = await injectedProvider.eth.personal.sign(
      messageHash,
      address,
    );

    const newMinionSafe = {
      delegate,
      minionAddress,
      date: Date.now(),
      safeAddress: null,
    };

    const updateSafes = {
      contractAddress: daoid,
      boostKey: 'minionSafe',
      metadata: newMinionSafe,
      network: injectedChain.network,
      signature,
    };

    const updateRes = await boostPost('dao/boost', updateSafes);
    // if (updateRes === 'success') {
    //   updateDaoMetadata({
    //     ...daoMetadata,
    //     boosts: { ...daoMetadata, customTheme: _newMinionSafe },
    //   });
    // } else {
    //   alert('error: forbidden');
    // }
    console.log(updateRes);
  };

  const onSubmitExistingSafe = values => {
    console.log(values);
  };
  const onSubmitNewSafe = async values => {
    setLoading(true);

    console.log(values);
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

    // await saveBoostMeta(values.applicantHidden, values.minionAddress);

    const enableModuleData = minionSafeService('enableModule')({
      minionAddress: values.minionAddress,
    });
    const setupData = minionSafeService('setupModuleData')({
      delegate: values.applicant,
      minionAddress: values.minionAddress,
      enableModuleData,
    });

    try {
      // TODO setup Poll & onTxHash
      const args = [chainByID(daochain).safe_master_copy, setupData];
      const poll = '';
      const onTxHash = '';

      minionSafeService('createProxy')({
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
      {daoOverview?.minions.length ? (
        <>
          {MODE[currentMode] === MODE[1] ? (
            <MinionSafeEasyMode
              minions={daoOverview.minions}
              submitAction={onSubmitNewSafe}
              saveBoostMeta={saveBoostMeta}
              loading={loading}
            />
          ) : (
            <MinionSafeHardMode
              minions={daoOverview.minions}
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
        {`Switch to ${currentMode === 1 ? MODE[2].name : MODE[1].name}`}
      </Button>
    </Box>
  );
};

export default NewMinionSafe;
