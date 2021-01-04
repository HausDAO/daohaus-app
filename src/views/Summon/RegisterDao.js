import React, { useState, useEffect } from 'react';
import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { Link as RouterLink, useParams, useHistory } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';

import { useUser } from '../../contexts/PokemolContext';
import HubGraphInit from '../../contexts/HubGraphInit';
import DaoMetaForm from '../../components/Forms/DaoMetaForm';
import SummonService from '../../utils/summon-service';

const RegisterDao = () => {
  const [user] = useUser();
  const { dao } = useParams();
  const history = useHistory();
  const [memberDaos, setMemberDaos] = useState();
  const [currentDao, setCurrentDao] = useState();

  useEffect(() => {
    if (user && dao) {
      setCurrentDao({
        address: dao,
        title: '', // get this from somewhere
        description: '',
        purpose: '',
        summonerAddress: user.username,
      });
    }

    // console.log(localFreshDaos);
  }, [user, dao]);

  const handleUpdate = async (values) => {
    console.log(values);
    history.push(`/dao/${dao}`);
  };
  return (
    <>
      {!currentDao ? (
        <Text>loading...</Text>
      ) : (
        <Box>
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
          <DaoMetaForm handleUpdate={handleUpdate} metadata={currentDao} />
        </Box>
      )}
      {user ? (
        <HubGraphInit setHubDaos={setMemberDaos} hubDaos={memberDaos} />
      ) : null}
    </>
  );
};

export default RegisterDao;
