import React, { useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';

import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { getTerm } from '../utils/metadata';
import { getActiveMembers } from '../utils/dao';

import { numberWithCommas } from '../utils/general';

const MembersChart = ({ overview, daoMetaData, daoMembers }) => {
  const [activeMembers, setActiveMembers] = useState(null);

  useEffect(() => {
    if (daoMembers?.length) {
      setActiveMembers(getActiveMembers(daoMembers));
    }
  }, [daoMembers]);

  return (
    <Box>
      {daoMembers?.length && overview ? (
        <ContentBox minH='100px'>
          <Flex justify='space-between'>
            <Box>
              <TextBox size='xs'>
                {`Active ${getTerm(daoMetaData?.customTermsConfig, 'members')}`}
              </TextBox>
              <TextBox variant='value' size='lg'>
                {activeMembers?.length ? activeMembers.length : 0}
              </TextBox>
            </Box>
            <Box>
              <TextBox size='xs'>Shares</TextBox>
              <TextBox variant='value' size='lg'>
                {overview?.totalShares
                  ? numberWithCommas(overview.totalShares)
                  : '--'}
              </TextBox>
            </Box>
            {(overview?.totalLoot > 0 || !overview.totalLoot) && (
              <Box>
                <TextBox size='xs'>Loot</TextBox>
                <TextBox variant='value' size='lg'>
                  {overview?.totalLoot
                    ? numberWithCommas(overview.totalLoot)
                    : '--'}
                </TextBox>
              </Box>
            )}
          </Flex>
        </ContentBox>
      ) : (
        <Flex
          as={ContentBox}
          w='100%'
          h='350px'
          align='center'
          justify='center'
        >
          <TextBox>--</TextBox>
        </Flex>
      )}
    </Box>
  );
};

export default MembersChart;
