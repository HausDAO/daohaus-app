import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';

import MainViewLayout from '../components/mainViewLayout';
import CcoWhitelist from '../forms/ccoWhitelist';
import CcoActivate from '../forms/ccoActivate';
import CcoConfig from '../forms/ccoConfig';
import CcoTransmutation from '../components/ccoTransmutation';
import { fetchTransmutation } from '../utils/theGraph';

const CcoAdmin = React.memo(({ daoMetaData, isCorrectNetwork }) => {
  const { daoid, daochain } = useParams();
  const [transmutation, setTransmutation] = useState(null);
  const isDaosquareCco = daoMetaData?.daosquarecco > 0;
  const ccoType = isDaosquareCco ? 'daosquarecco' : 'cco';
  const isCco = daoMetaData?.boosts && daoMetaData.boosts[ccoType];

  useEffect(() => {
    const setUp = async () => {
      try {
        const transmuationData = await fetchTransmutation({
          chainID: daochain,
          molochAddress: daoid,
        });

        setTransmutation(transmuationData.transmutations[0]);
      } catch (err) {
        console.log('err', err);
      }
    };

    setUp();
  }, [daoid, daochain]);

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
                  <CcoTransmutation
                    ccoType={ccoType}
                    transmutation={transmutation}
                  />
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
