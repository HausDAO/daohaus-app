import React, { useState } from 'react';

import { useNetwork, useUser } from '../../contexts/PokemolContext';
import { Text, Box } from '@chakra-ui/react';
import { useEffect } from 'react/cjs/react.development';
import { useParams } from 'react-router-dom';
import HubGraphInit from '../../contexts/HubGraphInit';
import DaoMetaForm from '../../components/Forms/DaoMetaForm';

const RegisterDao = () => {
  const [network] = useNetwork();
  const [user] = useUser();
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

  const handleUpdate = (values) => {
    console.log(values);
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
          <DaoMetaForm handleThemeUpdate={handleUpdate} />
        </Box>
      )}
      {user ? (
        <HubGraphInit setHubDaos={setMemberDaos} hubDaos={memberDaos} />
      ) : null}
    </>
  );
};

export default RegisterDao;
