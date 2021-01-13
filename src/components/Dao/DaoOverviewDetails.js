import React from 'react';
import { useHistory } from 'react-router-dom';
import { Avatar, Box, Flex, Skeleton, Button } from '@chakra-ui/react';
import makeBlockie from 'ethereum-blockies-base64';

import { useMembers } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';
import { numberWithCommas, themeImagePath } from '../../utils/helpers';
import ContentBox from '../Shared/ContentBox';
import TextBox from '../Shared/TextBox';
import BankTotal from '../Bank/BankTotal';

const DaoOverviewDetails = ({ dao }) => {
  const [theme] = useTheme();
  const [members] = useMembers();
  const history = useHistory();

  return (
    <Box>
      <TextBox size='sm' color='whiteAlpha.900'>
        Details
      </TextBox>
      <ContentBox mt={2} w='100%'>
        <Flex direction='row' align='center'>
          {dao.avatarImg ? (
            <Avatar src={themeImagePath(dao.avatarImg)} h='50px' w='50px' />
          ) : (
            <Avatar h='50px' w='50px' src={makeBlockie(dao.address || 'oxo')} />
          )}
          <Skeleton isLoaded={dao.name} ml={6}>
            <Box fontSize='2xl' fontWeight={700} fontFamily='heading'>
              {dao.name ? dao.name : '--'}
            </Box>
          </Skeleton>
        </Flex>
        <Skeleton isLoaded={dao?.description}>
          <Box mt={6}>{dao?.description ? dao.description : '--'}</Box>
        </Skeleton>
        <Flex direction='row' w='100%' justify='space-between' mt={6}>
          <Box>
            <TextBox size='xs'>{theme.daoMeta.members}</TextBox>
            <Skeleton isLoaded={members}>
              <TextBox size='lg' variant='value'>
                {members?.length ? members.length : 0}
              </TextBox>
            </Skeleton>
          </Box>
          <Box>
            <TextBox size='xs'>Shares</TextBox>
            <Skeleton isLoaded={dao?.graphData?.totalShares}>
              <TextBox size='lg' variant='value'>
                {dao?.graphData?.totalShares
                  ? numberWithCommas(dao.graphData.totalShares)
                  : '--'}
              </TextBox>
            </Skeleton>
          </Box>
          <Box>
            <TextBox size='xs'>Loot</TextBox>
            <Skeleton isLoaded={dao?.graphData?.totalLoot}>
              <TextBox size='lg' variant='value'>
                {dao?.graphData?.totalLoot
                  ? numberWithCommas(dao?.graphData?.totalLoot)
                  : '--'}
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
