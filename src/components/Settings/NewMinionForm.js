import React, { useState } from 'react';
import { Box, Button, Input, List, ListItem } from '@chakra-ui/react';
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
} from '../../contexts/PokemolContext';

const NewMinionForm = () => {
  const [loading, setLoading] = useState(false);
  const [user] = useUser();
  const [dao] = useDao();
  const [web3Connect] = useWeb3Connect();
  const { closeModals } = useModals();
  const [txProcessor, updateTxProcessor] = useTxProcessor();
  const { handleSubmit, register } = useForm();

  const txCallBack = (txHash, details) => {
    console.log('txCallBack', txProcessor);
    if (txProcessor && txHash) {
      txProcessor.setTx(txHash, user.username, details, true, false);
      txProcessor.forceUpdate = true;

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
      minionFactory:
        supportedChains[+process.env.REACT_APP_NETWORK_ID].minionFactoryAddr,
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
      <TextBox>Your doorway to the unknown</TextBox>
      <TextBox>Current Minions</TextBox>
      <List>
        {dao?.graphData &&
          dao.graphData.minions.map((minion) => {
            return (
              <ListItem key={minion.minionAddress}>
                {minion.minionAddress}
              </ListItem>
            );
          })}
      </List>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Input name='details' placeholder='Name' w='60%' ref={register} />
        </Box>
        <Button type='submit' isLoading={loading}>
          Summon
        </Button>
      </form>
    </Box>
  );
};

export default NewMinionForm;
