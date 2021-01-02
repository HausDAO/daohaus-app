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
    if (memberDaos) {
      if (!dao) {
        return;
      }
      setCurrentDao(
        memberDaos.find((item) => {
          return item.moloch.id === dao;
        }),
      );
      // console.log(localFreshDaos);
    }
  }, [memberDaos, dao]);

  const handleUpdate = async (values) => {
    console.log(values);
    // will need to pass this metadata down as defaults
    console.log(currentDao.moloch.apiMetaData);
    const messageHash = web3Connect.web3.utils.sha3(currentDao.moloch.id);
    const signature = await web3Connect.web3.eth.personal.sign(
      messageHash,
      user.username,
    );
    console.log(signature);
    const summonService = new SummonService(
      web3Connect.web3,
      network.network_id,
    );
    const newMoloch = {
      summonerAddress: user.username,
      name: values.name,
      contractAddress: currentDao.moloch.id,
      register: true,
      network: network.network_id,
      signature: signature,
    };
    console.log('moloch update', newMoloch);
    // summonService.updateMolochCache(newMoloch);

    // redirect to dao page
  };
  return (
    <>
      {!network || !currentDao ? (
        <Text>loading...</Text>
      ) : (
        <Box>
          <Text>
            Register + {network.network_id} + {currentDao?.moloch.id}
          </Text>
          <DaoMetaForm onSubmit={handleUpdate} />
        </Box>
      )}
      {user ? (
        <HubGraphInit setHubDaos={setMemberDaos} hubDaos={memberDaos} />
      ) : null}
    </>
  );
};

export default RegisterDao;
