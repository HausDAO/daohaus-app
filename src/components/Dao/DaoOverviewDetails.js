import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Flex, Image, Skeleton, Button } from '@chakra-ui/react';

import { useUser, useMembers } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';

import ContentBox from '../Shared/ContentBox';
import TextBox from '../Shared/TextBox';
import BankTotal from '../Bank/BankTotal';

const DaoOverviewDetails = ({ dao }) => {
  const [theme] = useTheme();
  const [user] = useUser();
  const [members] = useMembers();
  const history = useHistory();

  return (
    <Box>
      {user && (
        <TextBox size='sm' color='whiteAlpha.900'>
          Details
        </TextBox>
      )}
      <ContentBox mt={2} w='100%'>
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
        <Skeleton isLoaded={dao?.description}>
          <Box mt={6}>{dao?.description ? dao.description : '--'}</Box>
        </Skeleton>
        <Flex
          direction='row'
          w={['100%', null, null, null, '60%']}
          justify='space-between'
          mt={6}
        >
          <Box>
            <TextBox size='xs'>{theme.daoMeta.members}</TextBox>
            <Skeleton isLoaded={members?.length > 0}>
              <TextBox size='lg' variant='value'>
                {members?.length ? members.length : '--'}
              </TextBox>
            </Skeleton>
          </Box>
          <Box>
            <TextBox size='xs'>Shares</TextBox>
            <Skeleton isLoaded={dao?.graphData?.totalShares}>
              <TextBox size='lg' variant='value'>
                {dao?.graphData?.totalShares ? dao.graphData.totalShares : '--'}
              </TextBox>
            </Skeleton>
          </Box>
          <Box>
            <TextBox size='xs'>Loot</TextBox>
            <Skeleton isLoaded={dao?.graphData?.totalLoot}>
              <TextBox size='lg' variant='value'>
                {dao?.graphData?.totalLoot ? dao?.graphData?.totalLoot : '--'}
              </TextBox>
            </Skeleton>
          </Box>
        </Flex>
        <Box mt={6}>
          <TextBox size='md'>{theme.daoMeta.bank}</TextBox>
          <BankTotal tokenBalances={dao?.graphData?.tokenBalances} dao={dao} />
        </Box>
        <Flex mt={6}>
          <Button
            variant='outline'
            mr={6}
            onClick={() => history.push(`/dao/${dao.address}/bank`)}
          >
            View {theme.daoMeta.bank}
          </Button>
          <Button onClick={() => history.push(`/dao/${dao.address}/proposals`)}>
            View {theme.daoMeta.proposals}
          </Button>
        </Flex>
      </ContentBox>
    </Box>
  );
};

export default DaoOverviewDetails;
