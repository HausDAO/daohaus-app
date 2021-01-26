import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Flex, Box, Skeleton, Button } from '@chakra-ui/react';
// import { useCustomTheme } from '../contexts/CustomThemeContext';
import { useMetaData } from '../contexts/MetaDataContext';
import { getCopy } from '../utils/metadata';
import BankTotal from './bankTotal';
import TextBox from './TextBox';
import ContentBox from './ContentBox';

const OverviewCard = ({ overview, isMember, membersAmt }) => {
  const { daochain, daoid } = useParams();
  const { daoMetaData } = useMetaData();
  const { tokenBalances, totalLoot, totalShares, title } = overview;
  const history = useHistory();

  return (
    <Box>
      <TextBox size='sm' color='whiteAlpha.900'>
        Details
      </TextBox>
      <ContentBox mt={2} w='100%'>
        <Flex direction='row' align='center'>
          {/* <p>{isMember ? "You are a member" : "You are not a member"}</p> */}
          <Skeleton isLoaded={title} ml={6}>
            <Box fontSize='2xl' fontWeight={700} fontFamily='heading'>
              {title || '--'}
            </Box>
          </Skeleton>
        </Flex>
        <Skeleton isLoaded={daoMetaData?.description}>
          <Box mt={6}>
            {daoMetaData?.description ? daoMetaData.description : '--'}
          </Box>
        </Skeleton>

        <Flex direction='row' w='100%' justify='space-between' mt={6}>
          <Box>
            <TextBox size='xs'>{getCopy(daoMetaData, 'members')}</TextBox>
            <Skeleton isLoaded={membersAmt}>
              <TextBox size='lg' variant='value'>
                {membersAmt || 0}
              </TextBox>
            </Skeleton>
          </Box>
          <Box>
            <TextBox size='xs'>Shares</TextBox>
            <Skeleton isLoaded={totalShares}>
              <TextBox size='lg' variant='value'>
                {totalShares || '--'}
              </TextBox>
            </Skeleton>
          </Box>
          <Box>
            <TextBox size='xs'>Loot</TextBox>
            <Skeleton isLoaded={totalLoot}>
              <TextBox size='lg' variant='value'>
                {totalLoot || '--'}
              </TextBox>
            </Skeleton>
          </Box>
        </Flex>
        <Box mt={6}>
          <TextBox size='md'>{getCopy(daoMetaData, 'bank')}</TextBox>
          <BankTotal tokenBalances={tokenBalances} />
        </Box>
        <Flex mt={6}>
          <Button
            variant='outline'
            mr={6}
            onClick={() => history.push(`/dao/${daochain}/${daoid}/bank`)}
            value='bank'
          >
            View {getCopy(daoMetaData, 'bank')}
          </Button>
          <Button
            onClick={() => history.push(`/dao/${daochain}/${daoid}/proposals`)}
            value='proposals'
          >
            View {getCopy(daoMetaData, 'proposals')}
          </Button>
        </Flex>
      </ContentBox>
    </Box>
  );
};

export default OverviewCard;
