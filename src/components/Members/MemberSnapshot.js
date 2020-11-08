import React from 'react';
import { Box, Flex, Skeleton } from '@chakra-ui/core';

import { useMembers, useDao } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';
import MemberSnapshotChart from './MemberSnapshotChart';

const MemberSnapshot = () => {
  const [theme] = useTheme();
  const [dao] = useDao();
  const [members] = useMembers();

  return (
    <Box>
      <Flex justify='space-between' fontSize='xs' mt={2}>
        <Box textTransform='uppercase' fontFamily='heading' fontWeight={700}>
          Snapshot
        </Box>
        <Box textTransform='uppercase' fontFamily='heading' fontWeight={700}>
          View my profile
        </Box>
      </Flex>
      <Box
        rounded='lg'
        bg='blackAlpha.600'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
        p={3}
        mt={4}
        w='100%'
      >
        <Flex maxW='70%' justify='space-between' mt={4}>
          <Box m='0 5px'>
            <Box
              textTransform='uppercase'
              fontSize='xs'
              fontFamily='heading'
              fontWeight={700}
            >
              {theme.daoMeta.members}
            </Box>
            <Skeleton isLoaded={members.length > 0}>
              <Box fontSize='md' fontFamily='space' fontWeight={700}>
                {members?.length}
              </Box>
            </Skeleton>
          </Box>
          <Box m='0 5px'>
            <Box
              textTransform='uppercase'
              fontSize='xs'
              fontFamily='heading'
              fontWeight={700}
            >
              Shares
            </Box>
            <Skeleton isLoaded={dao?.graphData?.totalShares}>
              <Box fontSize='md' fontFamily='space' fontWeight={700}>
                {dao?.graphData?.totalShares
                  ? dao?.graphData?.totalShares
                  : '--'}
              </Box>
            </Skeleton>
          </Box>
          {(dao?.graphData?.totalLoot > 0 || !dao?.graphData?.totalLoot) && (
            <Box m='0 5px'>
              <Box
                textTransform='uppercase'
                fontSize='xs'
                fontFamily='heading'
                fontWeight={700}
              >
                >Loot
              </Box>
              <Skeleton isLoaded={dao?.graphData?.totalLoot}>
                <Box fontSize='md' fontFamily='space' fontWeight={700}>
                  >
                  {dao?.graphData?.totalLoot ? dao?.graphData?.totalLoot : '--'}
                </Box>
              </Skeleton>
            </Box>
          )}
        </Flex>
        <Flex justify='center' mt={4}>
          <MemberSnapshotChart />
        </Flex>
      </Box>
    </Box>
  );
};

export default MemberSnapshot;
