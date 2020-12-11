import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Flex,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
} from '@chakra-ui/react';

import { useMembers, useDao, useUser } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';
import MemberSnapshotChart from './MemberSnapshotChart';
import TextBox from '../Shared/TextBox';
import ContentBox from '../Shared/ContentBox';

const MemberSnapshot = ({ selectedMember }) => {
  const [theme] = useTheme();
  const [dao] = useDao();
  const [members] = useMembers();
  const [user] = useUser();
  const [chartDimension, setChartDimension] = useState('currentShares');

  return (
    <Box>
      <Flex justify='space-between'>
        <TextBox size='xs'>Snapshot</TextBox>
        <TextBox
          as={Link}
          to={`/dao/${dao?.address}/profile/${
            selectedMember ? selectedMember.memberAddress : user?.username
          }`}
          size='xs'
        >
          View my profile
        </TextBox>
      </Flex>
      <ContentBox mt={3}>
        <Flex justify='space-between'>
          <Box>
            <TextBox size='xs'>{theme.daoMeta.members}</TextBox>
            <Skeleton isLoaded={members.length > 0}>
              <TextBox variant='value' size='lg'>
                {members?.length}
              </TextBox>
            </Skeleton>
          </Box>
          <Box>
            <TextBox size='xs'>Shares</TextBox>
            <Skeleton isLoaded={dao?.graphData?.totalShares}>
              <TextBox variant='value' size='lg'>
                {dao?.graphData?.totalShares
                  ? dao?.graphData?.totalShares
                  : '--'}
              </TextBox>
            </Skeleton>
          </Box>
          {(dao?.graphData?.totalLoot > 0 || !dao?.graphData?.totalLoot) && (
            <Box>
              <TextBox size='xs'>Loot</TextBox>
              <Skeleton isLoaded={dao?.graphData?.totalLoot}>
                <TextBox variant='value' size='lg'>
                  {dao?.graphData?.totalLoot ? dao?.graphData?.totalLoot : '--'}
                </TextBox>
              </Skeleton>
            </Box>
          )}
        </Flex>
        <RadioGroup defaultValue={chartDimension} onChange={setChartDimension}>
          <Stack spacing={4} direction='row'>
            <Radio value='currentShares'>Shares</Radio>
            <Radio value='currentLoot'>Loot</Radio>
          </Stack>
        </RadioGroup>
        <Flex justify='center' mt={4}>
          <MemberSnapshotChart chartDimension={chartDimension} dao={dao} />
        </Flex>
      </ContentBox>
    </Box>
  );
};

export default MemberSnapshot;
