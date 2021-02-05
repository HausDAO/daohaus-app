import React, { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Heading,
  Input,
  Link,
} from '@chakra-ui/react';
import TextBox from '../components/TextBox';
import { useForm } from 'react-hook-form';
import { MinionFactoryService } from '../services/minionFactoryService';
import { supportedChains } from '../utils/chain';

import {
  useDao,
  // useTxProcessor,
  // useUser,
  // useWeb3Connect,
  // useModals,
  // useNetwork,
} from '../contexts/DaoContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

const NewMinionForm = () => {
  const [loading, setLoading] = useState(false);
  const { daochain, daoid } = useParams();
  const { address, injectedProvider } = useInjectedProvider();
  const { daoOverview } = useDao();
  // const [web3Connect] = useWeb3Connect();
  // const [network] = useNetwork();
  // const { closeModals } = useModals();
  // const [txProcessor, updateTxProcessor] = useTxProcessor();
  const { handleSubmit, register } = useForm();

  const onSubmit = (values) => {
    setLoading(true);

    // console.log(values);
    // const setupValues = {
    //   minionFactory: supportedChains[network.network_id].minion_factory_addr,
    //   actionVlaue: '0',
    // };
    // const minionFactoryService = new MinionFactoryService(
    //   web3Connect.web3,
    //   user.username,
    //   setupValues,
    // );

    // try {
    //   minionFactoryService.summonMinion(
    //     dao.address,
    //     values.details,
    //     txCallBack,
    //   );
    // } catch (err) {
    //   setLoading(false);
    //   console.log('error: ', err);
    // }
  };

  console.log('daoOverview', daoOverview);

  return (
    <Box w='90%'>
      <Heading as='h4' size='md' fontWeight='100' mb={10}>
        Deploy Your Minion
      </Heading>
      {daoOverview?.minions.length > 0 && (
        <>
          <Box mb={5} fontSize='md'>
            You have {daoOverview.minions.length} minion
            {daoOverview.minions.length > 1 ? 's' : ''} already. Are you looking
            for the{' '}
            <Link
              as={RouterLink}
              to={`/dao/${daochain}/${daoid}/settings`}
              color='secondary.500'
            >
              Settings?
            </Link>
          </Box>
        </>
      )}
      <Box mb={3} fontSize='sm'>
        Deploying a Minion will allow the DAO to make arbitrary transaction
        calls from successful proposals.
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={3} fontSize='sm'>
          <FormControl mb={5}>
            <Input name='details' placeholder='Frank' w='60%' ref={register} />
            <FormHelperText fontSize='sm' id='name-helper-text' mb={1}>
              Give your Minion a name.
            </FormHelperText>
          </FormControl>
        </Box>
        <Button type='submit' isLoading={loading}>
          Deploy
        </Button>
      </form>
    </Box>
  );
};

export default NewMinionForm;
