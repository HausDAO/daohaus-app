import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Heading,
  Input,
  Link,
} from '@chakra-ui/react';
import TextBox from '../Shared/TextBox';
import { useForm } from 'react-hook-form';
import { MinionFactoryService } from '../../utils/minion-factory-service';
import { supportedChains } from '../../utils/chains';

import {
  useDao,
  useTxProcessor,
  useUser,
  useWeb3Connect,
  useModals,
  useNetwork,
} from '../../contexts/PokemolContext';
import MinionSafeConfigForm from './MinionSafeConfigForm';

const NewMinionSafe = () => {
  const [loading, setLoading] = useState(false);
  const [user] = useUser();
  const [dao] = useDao();
  const [web3Connect] = useWeb3Connect();
  const [network] = useNetwork();
  const { closeModals } = useModals();
  const [txProcessor, updateTxProcessor] = useTxProcessor();
  const [currentMode, setCurrentMode] = useState();

  const mode = {
    1: { name: 'easy', form: <MinionSafeConfigForm /> },
    2: { name: 'hard', form: '' },
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

  const onSubmit = (values) => {
    setLoading(true);

    console.log(values);
    const setupValues = {
      minionFactory: supportedChains[network.network_id].minion_factory_addr,
      actionVlaue: '0',
    };
    const minionFactoryService = new MinionFactoryService(
      web3Connect.web3,
      user.username,
      setupValues,
    );

    try {
      minionFactoryService.summonMinion(
        dao.address,
        values.details,
        txCallBack,
      );
    } catch (err) {
      setLoading(false);
      console.log('error: ', err);
    }
  };

  return (
    <Box w='90%'>
      <Heading as='h4' size='sm' fontWeight='100'>
        Minion Safe
      </Heading>
      <TextBox>
        This Minion allows you to interact with a specially created Gnosis Safe
        for your DAO. This means the DAO can interact with any Gnosis Safe App
        via proposal. Add a number of Human Co-Signers to execute transactions,
        once they pass the DAO proposal stage.
      </TextBox>
      {dao?.graphData && dao.graphData.minions.length > 0 ? (
        <>
          <MinionSafeConfigForm minions={dao.graphData.minions} />
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
    </Box>
  );
};

export default NewMinionSafe;
