import React from 'react';
import { Box, Flex, Icon, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

import { useDao, useMemberWallet } from '../../contexts/PokemolContext';
import BoostStatus from '../../components/Settings/BoostStatus';
import Superpowers from '../../components/Settings/Superpowers';
import DaoContractSettings from '../../components/Settings/DaoContractSettings';
import DaoMetaOverview from '../../components/Settings/DaoMetaOverview';
import TextBox from '../../components/Shared/TextBox';
import MinionsOverview from '../../components/Settings/MinionsOverview';
import ContentBox from '../../components/Shared/ContentBox';
import { VscGear } from 'react-icons/vsc';

const Settings = () => {
  const [dao] = useDao();
  const [memberWallet] = useMemberWallet();

  return (
    <Flex p={6} wrap='wrap'>
      <Box
        w={['100%', null, null, null, '50%']}
        pr={[0, null, null, null, 6]}
        pb={6}
      >
        <TextBox size='xs'>Dao Contract Settings</TextBox>
        <DaoContractSettings />
        <Flex justify='space-between' mt={6}>
          <TextBox size='xs'>DAO Metadata</TextBox>
          {memberWallet?.activeMember ? (
            <Link
              as={RouterLink}
              color='secondary.500'
              fontFamily='heading'
              fontSize='xs'
              textTransform='uppercase'
              letterSpacing='0.15em'
              to={`/dao/${dao.address}/settings/meta`}
            >
              Edit
            </Link>
          ) : null}
        </Flex>
        <DaoMetaOverview />
      </Box>
      <Box w={['100%', null, null, null, '50%']}>
        <TextBox size='xs'>Boost Status</TextBox>
        <BoostStatus />
        <TextBox size='xs'>Superpowers</TextBox>
        <Superpowers />
        {/* TODO: move minion stuff into superpowers */}
        {dao?.graphData && dao.graphData.minions.length > 0 && (
          <>
            <TextBox size='xs'>Minions</TextBox>
            <MinionsOverview />
          </>
        )}
        {/* start minion safe */}
        <>
          <TextBox size='xs'>Minion Safe</TextBox>
          <ContentBox
            d='flex'
            flexDirection='column'
            position='relative'
            mt={2}
          >
            <Flex p={4} justify='space-between' align='center'>
              <TextBox size='md' colorScheme='whiteAlpha.900'>
                Minion Safe
              </TextBox>
            </Flex>
            <Flex align='center'>
              <RouterLink to={`/dao/${dao.address}/settings/minion-safe`}>
                <Icon
                  as={VscGear}
                  color='secondary.500'
                  w='25px'
                  h='25px'
                  mr={3}
                />
              </RouterLink>
            </Flex>
          </ContentBox>
        </>
        {/* end minion safe */}
      </Box>
    </Flex>
  );
};

export default Settings;
