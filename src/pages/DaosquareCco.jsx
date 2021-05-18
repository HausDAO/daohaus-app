import React, { useEffect, useState } from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';

import Layout from '../components/layout';
import MainViewLayout from '../components/mainViewLayout';
import DaosquareCcoOverall from '../components/daosquareCcoOverall';
import CcoCard from '../components/ccoCard';
import { useDaosquareCco } from '../contexts/DaosquareCcoContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import { daosquareCcoTheme } from '../themes/defaultTheme';

const DaosquareCco = () => {
  const { d2CcoDaos } = useDaosquareCco();
  const { updateTheme } = useCustomTheme();
  const [fundedDaoTotals, setFundedDaoTotals] = useState({});
  const [totals, setTotals] = useState({
    raised: 0,
    funded: 0,
    projects: 0,
  });

  useEffect(() => {
    updateTheme(daosquareCcoTheme);
  }, []);

  useEffect(() => {
    console.log('fundedDaoTotals', fundedDaoTotals);
    if (d2CcoDaos?.length) {
      setTotals({
        funded: Object.keys(fundedDaoTotals).reduce((sum, dao) => {
          sum += fundedDaoTotals[dao];
          return sum;
        }, 0),
        projects: d2CcoDaos.filter(dao => dao.ccoStatus.label === 'Funded')
          .length,
      });
    }
  }, [d2CcoDaos, fundedDaoTotals]);

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
              {d2CcoDaos
                .sort((a, b) => a.ccoStatus.sort - b.ccoStatus.sort)
                .map(dao => {
                  return (
                    <CcoCard
                      daoMetaData={dao.meta}
                      dao={dao}
                      key={dao.id}
                      setFundedDaoTotals={setFundedDaoTotals}
                      fundedDaoTotals={fundedDaoTotals}
                      ccoType='daosquarecco'
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
