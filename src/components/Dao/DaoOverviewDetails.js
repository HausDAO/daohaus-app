import React from 'react';
import { useHistory } from 'react-router-dom';
import { Text, Box, Flex, Image } from '@chakra-ui/core';

import { useTheme } from '../../contexts/PokemolContext';
import { PrimaryButton, SecondaryButton } from '../../themes/theme';

const DaoOverviewDetails = ({ dao }) => {
  const [theme] = useTheme();
  const history = useHistory();

  return (
    <>
      <Text ml={6} textTransform='uppercase' fontSize='0.9em'>
        Details
      </Text>
      <Box
        rounded='lg'
        bg='blackAlpha.600'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
        p={6}
        m={6}
        mt={2}
        w='100%'
      >
        <Flex direction='row' align='center'>
          <Image
            src={require('../../assets/Daohaus__Castle--Dark.svg')}
            alt='DAO Logo'
            h={50}
            w={50}
          />
          <Text ml={6} fontSize='2xl' fontWeight={700}>
            {dao.apiMeta.name}
          </Text>
        </Flex>
        <Flex direction='row' w='60%' justify='space-between' mt={6}>
          <Box>
            <Text textTransform='uppercase'>Members</Text>
            <Text>{5}</Text>
          </Box>
          <Box>
            <Text textTransform='uppercase'>Shares</Text>
            <Text>{dao.graphData.totalShares || 0}</Text>
          </Box>
          <Box>
            <Text textTransform='uppercase'>Loot</Text>
            <Text>{dao.graphData.totalLoot || 0}</Text>
          </Box>
        </Flex>
        <Box mt={6}>
          <Text>Bank</Text>
          <Text>$25,432</Text>
          <Text>{dao.graphData.tokenBalances.length} Tokens</Text>
        </Box>
        <Box mt={6}>{dao.apiMeta.description}</Box>
        <Flex mt={6}>
          <PrimaryButton
            mr={6}
            onClick={() => history.push(`/dao/${dao.address}/proposals`)}
          >
            View Quests
          </PrimaryButton>
          <SecondaryButton
            onClick={() => history.push(`/dao/${dao.address}/bank`)}
          >
            View Inventory
          </SecondaryButton>
        </Flex>
      </Box>
    </>
  );
};

export default DaoOverviewDetails;
