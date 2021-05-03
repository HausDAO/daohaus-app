import React, { useContext, useEffect, useState } from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';

import Layout from '../components/layout';
import MainViewLayout from '../components/mainViewLayout';
import DaosquareCcoOverall from '../components/daosquareCcoOverall';
import DaosquareCcoCard from '../components/daosquareCcoCard';
import { DaosquareContext } from '../contexts/DaosquareCcoContext';

// TODO: helper functions to create totals

const DaosquareCco = () => {
  const { d2CcoDaos } = useContext(DaosquareContext);
  const [totals, setTotals] = useState({
    raised: 0,
    funded: 0,
    projects: 0,
  });

  useEffect(() => {
    if (d2CcoDaos?.length) {
      setTotals({
        raised: 500000,
        funded: 730000,
        projects: 2,
      });
    }
  }, [d2CcoDaos]);

  console.log('d2CcoDaos', d2CcoDaos);

  return (
    <Layout daosquarecco>
      <MainViewLayout header='DAOSquare Incubator' isDaosquare>
        {d2CcoDaos?.length > 0 ? (
          <Flex wrap='wrap'>
            <Box
              w={['100%', null, null, null, '60%']}
              pr={[0, null, null, null, 6]}
              pb={6}
            >
              {d2CcoDaos.map((dao) => {
                return <DaosquareCcoCard dao={dao} key={dao.id} />;
              })}
            </Box>
            <Box w={['100%', null, null, null, '40%']}>
              <DaosquareCcoOverall totals={totals} />
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
