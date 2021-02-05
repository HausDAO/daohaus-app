import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Flex, Box, Skeleton, Button, Avatar } from '@chakra-ui/react';
import makeBlockie from 'ethereum-blockies-base64';
import { useMetaData } from '../contexts/MetaDataContext';
import { getCopy, themeImagePath } from '../utils/metadata';
import BankTotal from './bankTotal';
import TextBox from './TextBox';
import ContentBox from './ContentBox';

const OverviewCard = ({ overview, membersAmt }) => {
  const { daochain, daoid } = useParams();
  const { daoMetaData, customTerms } = useMetaData();
  const { tokenBalances, totalLoot, totalShares } = overview;
  const history = useHistory();

  return (
    <Box>
      <TextBox size='sm' color='whiteAlpha.900'>
        Details
      </TextBox>
      <ContentBox mt={2} w='100%'>
        <Flex direction='row' align='center'>
          <Skeleton isLoaded={daoMetaData?.name} ml={6}>
            <Flex align='center'>
              <Avatar
                src={
                  daoMetaData?.avatarImg
                    ? themeImagePath(daoMetaData.avatarImg)
                    : makeBlockie(daoid || '0x0')
                }
                mr={6}
              />
              <Box fontSize='2xl' fontWeight={700} fontFamily='heading'>
                {daoMetaData?.name || '--'}
              </Box>
            </Flex>
          </Skeleton>
        </Flex>
        <Skeleton isLoaded={daoMetaData?.description}>
          <Box mt={6}>
            {daoMetaData?.description ? daoMetaData.description : '--'}
          </Box>
        </Skeleton>

        <Flex direction='row' w='100%' justify='space-between' mt={6}>
          <Box>
            <TextBox size='xs'>{getCopy(customTerms, 'members')}</TextBox>
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
          <TextBox size='sm'>{getCopy(customTerms, 'bank')}</TextBox>
          <BankTotal tokenBalances={tokenBalances} />
        </Box>
        <Flex mt={6}>
          <Button
            variant='outline'
            mr={6}
            onClick={() => history.push(`/dao/${daochain}/${daoid}/bank`)}
            value='bank'
          >
            View {getCopy(customTerms, 'bank')}
          </Button>
          <Button
            onClick={() => history.push(`/dao/${daochain}/${daoid}/proposals`)}
            value='proposals'
          >
            View {getCopy(customTerms, 'proposals')}
          </Button>
        </Flex>
      </ContentBox>
    </Box>
  );
};

export default OverviewCard;
