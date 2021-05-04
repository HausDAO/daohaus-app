import React, { useEffect, useState } from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';

import Layout from '../components/layout';
import MainViewLayout from '../components/mainViewLayout';
import DaosquareCcoOverall from '../components/daosquareCcoOverall';
import CcoCard from '../components/ccoCard';
import { useDaosquareCco } from '../contexts/DaosquareCcoContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import { daosquareCcoTheme } from '../themes/defaultTheme';

// TODO: helper functions to create totals

const DaosquareCco = () => {
  const { d2CcoDaos } = useDaosquareCco();
  const { updateTheme } = useCustomTheme();
  const [totals, setTotals] = useState({
    raised: 0,
    funded: 0,
    projects: 0,
  });

  // updateTheme(daosquareCcoTheme);
  useEffect(() => {
    console.log('updating theme');
    updateTheme(daosquareCcoTheme);
  }, []);

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
              <Box fontSize='xl'>CCOs</Box>
              {d2CcoDaos.map((dao) => {
                return <CcoCard daoMetaData={dao.meta} key={dao.id} isLink />;
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
