import React from 'react';
import {
  Box, Flex,
} from '@chakra-ui/react';

import MainViewLayout from '../components/mainViewLayout';
import { CCO_CONSTANTS } from '../utils/cco';
import CcoConfig from '../forms/ccoConfig';
import CcoWhitelist from '../forms/ccoWhitelist';

const CcoAdmin = React.memo(({
  daoMetaData,
  isCorrectNetwork,
}) => {
  const isCco = daoMetaData?.boosts?.daosquarecco?.active;
  const onCcoNetwork = isCorrectNetwork && daoMetaData?.network === CCO_CONSTANTS.NETWORK;

  return (
    <MainViewLayout header='DAOhaus CCO' isDao>
      <Box w='100%'>

        {onCcoNetwork && (
          <Flex wrap='wrap'>
            <Box
              w={['100%', null, null, null, '50%']}
              pr={[0, null, null, null, 6]}
              mb={6}
            >
              <CcoConfig daoMetaData={daoMetaData} />

            </Box>
            <Box w={['100%', null, null, null, '50%']}>
              {isCco && (
                <CcoWhitelist daoMetaData={daoMetaData} />
              )}

            </Box>
          </Flex>
        )}
      </Box>
    </MainViewLayout>
  );
});

export default CcoAdmin;
