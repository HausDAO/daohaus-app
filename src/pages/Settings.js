import React from 'react';
import { Box, Flex, Link, Stack } from '@chakra-ui/react';
import { Link as RouterLink, useParams } from 'react-router-dom';

import { useDao } from '../contexts/DaoContext';
import { useDaoMember } from '../contexts/DaoMemberContext';
import BoostStatus from '../components/boostStatus';
import Superpowers from '../components/daoSuperpowers';
import DaoContractSettings from '../components/daoContractSettings';
import DaoMetaOverview from '../components/daoMetaOverview';
import TextBox from '../components/TextBox';
import Minions from '../components/minionList';

const Settings = () => {
  const { daochain, daoid } = useParams();
  const { daoMember } = useDaoMember();
  const { daoOverview } = useDao();
  console.log(daoOverview);

  return (
    <Flex wrap='wrap'>
      <Box
        w={['100%', null, null, null, '50%']}
        pr={[0, null, null, null, 6]}
        pb={6}
      >
        <TextBox size='xs'>Dao Contract Settings</TextBox>
        <DaoContractSettings />
        <Flex justify='space-between' mt={6}>
          <TextBox size='xs'>DAO Metadata</TextBox>
          {+daoMember?.shares > 0 ? (
            <Link
              as={RouterLink}
              color='secondary.500'
              fontFamily='heading'
              fontSize='xs'
              textTransform='uppercase'
              letterSpacing='0.15em'
              to={`/dao/${daochain}/${daoid}/settings/meta`}
            >
              Edit
            </Link>
          ) : null}
        </Flex>
        <DaoMetaOverview />
      </Box>
      <Stack w={['100%', null, null, null, '50%']} spacing={4}>
        <TextBox size='xs'>Superpowers</TextBox>
        <Superpowers />
        {daoOverview?.minions.length > 0 && (
          <>
            <TextBox size='xs'>Minions</TextBox>
            <Minions />
          </>
        )}
        <TextBox size='xs'>Boost Status</TextBox>
        <BoostStatus />
      </Stack>
    </Flex>
  );
};

export default Settings;
