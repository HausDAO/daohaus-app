import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Flex, Image, Skeleton, Button } from '@chakra-ui/core';
import { utils } from 'web3';

import { useUser, useMembers } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';

const DaoOverviewDetails = ({ dao }) => {
  const [theme] = useTheme();
  const [user] = useUser();
  const [members] = useMembers();
  const history = useHistory();
  const wethBalance = dao?.graphData?.tokenBalances?.filter((t) => {
    return t.symbol === 'WETH';
  })[0]?.tokenBalance;

  return (
    <>
      {user && (
        <Box
          ml={6}
          textTransform='uppercase'
          fontSize='sm'
          fontFamily='heading'
        >
          Details
        </Box>
      )}
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
          <Skeleton isLoaded={dao.name} ml={6}>
            <Box fontSize='2xl' fontWeight={700} fontFamily='heading'>
              {dao.name ? dao.name : '--'}
            </Box>
          </Skeleton>
        </Flex>
        <Flex direction='row' w='60%' justify='space-between' mt={6}>
          <Box>
            <Box
              textTransform='uppercase'
              fontFamily='heading'
              fontSize='sm'
              fontWeight={700}
            >
              {theme.daoMeta.members}
            </Box>
            <Skeleton isLoaded={members?.length > 0}>
              <Box fontSize='2xl' fontFamily='heading' fontWeight={700}>
                {members?.length ? members.length : '--'}
              </Box>
            </Skeleton>
          </Box>
          <Box>
            <Box
              textTransform='uppercase'
              fontFamily='heading'
              fontSize='sm'
              fontWeight={700}
            >
              Shares
            </Box>
            <Skeleton isLoaded={dao?.graphData?.totalShares}>
              <Box fontSize='2xl' fontFamily='heading' fontWeight={700}>
                {dao?.graphData?.totalShares ? dao.graphData.totalShares : '--'}
              </Box>
            </Skeleton>
          </Box>
          <Box>
            <Box
              textTransform='uppercase'
              fontFamily='heading'
              fontSize='sm'
              fontWeight={700}
            >
              Loot
            </Box>
            <Skeleton isLoaded={dao?.graphData?.totalLoot}>
              <Box fontSize='2xl' fontFamily='heading' fontWeight={700}>
                {dao?.graphData?.totalLoot ? dao?.graphData?.totalLoot : '--'}
              </Box>
            </Skeleton>
          </Box>
        </Flex>
        <Box mt={6}>
          <Box
            fontFamily='heading'
            textTransform='uppercase'
            fontSize='sm'
            fontWeight={700}
          >
            {theme.daoMeta.bank}
          </Box>
          <Skeleton isLoaded={wethBalance}>
            <Box fontSize='3xl' fontFamily='heading' fontWeight={700}>
              {wethBalance && parseFloat(utils.fromWei(wethBalance)).toFixed(3)}{' '}
              WETH
            </Box>
          </Skeleton>
          <Box>
            <Skeleton isLoaded={dao?.graphData?.tokenBalances?.length > 0}>
              <Box fontSize='sm' as='i' fontWeight={200}>
                {dao?.graphData?.tokenBalances?.length} Tokens
              </Box>
            </Skeleton>
          </Box>
        </Box>
        <Skeleton isLoaded={dao?.description}>
          <Box mt={6}>{dao?.description ? dao.description : '--'}</Box>
        </Skeleton>
        <Flex mt={6}>
          <Button
            mr={6}
            onClick={() => history.push(`/dao/${dao.address}/proposals`)}
          >
            View {theme.daoMeta.proposals}
          </Button>
          <Button
            variant='outline'
            onClick={() => history.push(`/dao/${dao.address}/bank`)}
          >
            View {theme.daoMeta.bank}
          </Button>
        </Flex>
      </Box>
    </>
  );
};

export default DaoOverviewDetails;
