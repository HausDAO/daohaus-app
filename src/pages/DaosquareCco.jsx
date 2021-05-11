import React, { useEffect, useState } from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';

import Layout from '../components/layout';
import MainViewLayout from '../components/mainViewLayout';
import DaosquareCcoOverall from '../components/daosquareCcoOverall';
import CcoCard from '../components/ccoCard';
import { useDaosquareCco } from '../contexts/DaosquareCcoContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import { daosquareCcoTheme } from '../themes/defaultTheme';
import { totalFundedDaosquare } from '../utils/cco';

const DaosquareCco = () => {
  const { d2CcoDaos } = useDaosquareCco();
  const { updateTheme } = useCustomTheme();
  const [totals, setTotals] = useState({
    raised: 0,
    funded: 0,
    projects: 0,
  });

  useEffect(() => {
    updateTheme(daosquareCcoTheme);
  }, []);

  useEffect(() => {
    if (d2CcoDaos?.length) {
      setTotals({
        funded: totalFundedDaosquare(d2CcoDaos),
        projects: d2CcoDaos.filter(dao => dao.ccoStatus.label === 'Funded')
          .length,
      });
    }
  }, [d2CcoDaos]);

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
              {d2CcoDaos.map(dao => {
                return (
                  <CcoCard
                    daoMetaData={dao.meta}
                    dao={dao}
                    key={dao.id}
                    isLink
                  />
                );
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
