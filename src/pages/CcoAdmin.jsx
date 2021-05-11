import React from 'react';
import { Box, Flex } from '@chakra-ui/react';

import MainViewLayout from '../components/mainViewLayout';
import CcoActivate from './CcoActivate';
import CcoWhitelist from '../forms/ccoWhitelist';
import CcoConfig from '../forms/ccoConfig';

const CcoAdmin = React.memo(({ daoMetaData, isCorrectNetwork }) => {
  const isDaosquareCco = daoMetaData?.daosquarecco > 0;
  const ccoType = isDaosquareCco ? 'daosquarecco' : 'cco';
  const isCco = daoMetaData?.boosts && daoMetaData.boosts[ccoType];

  return (
    <MainViewLayout header='CCO Admin' isDao>
      <Box w='100%'>
        {isCorrectNetwork && (
          <Flex wrap='wrap'>
            <Box
              w={['100%', null, null, null, '50%']}
              pr={[0, null, null, null, 6]}
              mb={6}
            >
              <CcoConfig daoMetaData={daoMetaData} ccoType={ccoType} />
            </Box>
            <Box w={['100%', null, null, null, '50%']}>
              {isCco && (
                <>
                  <CcoWhitelist daoMetaData={daoMetaData} ccoType={ccoType} />
                  <CcoActivate daoMetaData={daoMetaData} ccoType={ccoType} />
                </>
              )}
            </Box>
          </Flex>
        )}
      </Box>
    </MainViewLayout>
  );
});

export default CcoAdmin;
