import React, { useState, useEffect } from 'react';
import { Box, Flex, Icon } from '@chakra-ui/react';
import { Link as RouterLink, useParams, useHistory } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';

import { useUser } from '../../contexts/PokemolContext';
import HubGraphInit from '../../contexts/HubGraphInit';
import DaoMetaForm from '../../components/Forms/DaoMetaForm';
import { supportedChains } from '../../utils/chains';

const RegisterDao = () => {
  const [user] = useUser();
  const { dao, networkId } = useParams();
  const history = useHistory();
  const [memberDaos, setMemberDaos] = useState();
  const [currentDao, setCurrentDao] = useState();
  const [needsNetworkChange, setNeedsNetworkChange] = useState();

  useEffect(() => {
    if (user && dao) {
      const localMoloch = window.localStorage.getItem('pendingMolochy');
      const parsedMoloch = JSON.parse(localMoloch);
      setCurrentDao({
        address: dao,
        name: parsedMoloch?.name || '',
        description: parsedMoloch?.description || '',
        purpose: parsedMoloch?.purpose || '',
        summonerAddress: user.username,
        version: '2.1',
      });

      setNeedsNetworkChange(+networkId !== user.providerNetwork.network_id);
    }
  }, [user, dao, networkId]);

  const handleUpdate = async (values) => {
    console.log(values);
    history.push(`/dao/${dao}`);
  };

  if (needsNetworkChange) {
    return (
      <Box
        fontSize={['lg', null, null, '3xl']}
        fontFamily='heading'
        fontWeight={700}
        ml={10}
      >
        You need to switch to {supportedChains[+networkId].network} to register
        this dao.
      </Box>
    );
  }

  return (
    <>
      {!currentDao ? (
        <Box
          fontSize={['lg', null, null, '3xl']}
          fontFamily='heading'
          fontWeight={700}
          ml={10}
        >
          loading...
        </Box>
      ) : (
        <>
          <Flex ml={6} justify='space-between' align='center' w='100%'>
            <Flex as={RouterLink} to={`/`} align='center'>
              <Icon as={BiArrowBack} color='secondary.500' mr={2} />
              Back
            </Flex>
          </Flex>

          <Box
            fontSize={['lg', null, null, '3xl']}
            fontFamily='heading'
            fontWeight={700}
            ml={10}
          >
            Finish your DAO Setup
          </Box>
          <Box w='40%'>
            <DaoMetaForm handleUpdate={handleUpdate} metadata={currentDao} />
          </Box>
        </>
      )}
      {user ? (
        <HubGraphInit setHubDaos={setMemberDaos} hubDaos={memberDaos} />
      ) : null}
    </>
  );
};

export default RegisterDao;
