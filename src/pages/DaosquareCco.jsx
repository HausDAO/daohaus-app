import React, { useContext } from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';

import Layout from '../components/layout';
import MainViewLayout from '../components/mainViewLayout';
import { DaosquareContext } from '../contexts/DaosquareCcoContext';

const DaosquareCco = () => {
  const { d2CcoDaos } = useContext(DaosquareContext);

  console.log('d2CcoDaos', d2CcoDaos);

  return (
    <Layout>
      <MainViewLayout header='DAOSquare Incubator' isDaosquare>
        {d2CcoDaos?.length > 0 ? (
          <Flex wrap='wrap'>

            <Box
              w={['100%', null, null, null, '60%']}
              pr={[0, null, null, null, 6]}
              pb={6}
            >
              <p>list</p>
            </Box>
            <Box w={['100%', null, null, null, '40%']}>
              <p>stat</p>

            </Box>
          </Flex>
        ) : (
          <Spinner />
        )}
      </MainViewLayout>
    </Layout>
  );
};

export default DaosquareCco;
