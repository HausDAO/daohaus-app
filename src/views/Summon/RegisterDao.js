import React, { useState } from 'react';

import {
  useNetwork,
  useUser,
  useWeb3Connect,
} from '../../contexts/PokemolContext';
import { Text, Box } from '@chakra-ui/react';
import { useEffect } from 'react/cjs/react.development';
import { useParams } from 'react-router-dom';
import HubGraphInit from '../../contexts/HubGraphInit';
import DaoMetaForm from '../../components/Forms/DaoMetaForm';
import SummonService from '../../utils/summon-service';

const RegisterDao = () => {
  const [network] = useNetwork();
  const [user] = useUser();
  const [web3Connect] = useWeb3Connect();
  const { dao } = useParams();
  const [memberDaos, setMemberDaos] = useState();
  const [currentDao, setCurrentDao] = useState();

  useEffect(() => {
    setCurrentDao({
      contractAddress: dao,
      title: '', // get this from somewhere
      description: '',
      purpose: '',
      summonerAddress: user.username,
      network: network.network_id,
    });

    // console.log(localFreshDaos);
  }, [user, dao]);

  const handleUpdate = async (values) => {
    console.log(values);
    // redirect to dao page
  };
  return (
    <>
      {!network || !currentDao ? (
        <Text>loading...</Text>
      ) : (
        <Box>
          <Text>
            Register + {network.network_id} + {currentDao?.contractAddress}
          </Text>
          <DaoMetaForm onSubmit={handleUpdate} metadata={currentDao} />
        </Box>
      )}
      {user ? (
        <HubGraphInit setHubDaos={setMemberDaos} hubDaos={memberDaos} />
      ) : null}
    </>
  );
};

export default RegisterDao;
