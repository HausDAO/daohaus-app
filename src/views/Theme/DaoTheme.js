import { Flex, Box, Button, Link, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import { useTheme } from '../../contexts/CustomThemeContext';
import DaoOverviewDetails from '../../components/Dao/DaoOverviewDetails';
import MemberInfoCard from '../../components/Shared/MemberInfoCard/MemberInfoCard';

import {
  useDao,
  useUser,
  useMemberWallet,
} from '../../contexts/PokemolContext';
import { getRandomTheme } from '../../themes/theme';
import {
  mcvTheme,
  raidGuildTheme,
  yearnTheme,
} from '../../themes/theme-defaults';

const DaoTheme = () => {
  const [dao] = useDao();
  const [user] = useUser();
  const [, setTheme] = useTheme();
  const [memberWallet] = useMemberWallet();
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (memberWallet) {
      setIsMember(memberWallet.shares > 0);
    }
  }, [memberWallet]);

  const handleRandom = async () => {
    const theme = await getRandomTheme(true);

    theme.bgOverlayOpacity = '0.50';

    console.log('theme', theme);
    setTheme(theme);
  };

  const handleShuffle = async (on) => {
    setInterval(async () => {
      const theme = await getRandomTheme(false);
      theme.bgOverlayOpacity = '0.50';

      setTheme(theme);
    }, 300);
  };

  const handleUpdate = (theme) => {
    setTheme(theme);
  };

  return (
    <>
      <>
        <Box p={6}>
          {user && isMember ? (
            <Flex wrap='wrap'>
              <Box
                pr={[0, null, null, null, 6]}
                w={['100%', null, null, null, '50%']}
              >
                <DaoOverviewDetails dao={dao} />
              </Box>

              <Box w={['100%', null, null, null, '50%']} pt={[6, 0]}>
                <MemberInfoCard user={user} />
                {dao.graphData && <Box mt={6}>{/* <DaoActivityFeed /> */}</Box>}
              </Box>
            </Flex>
          ) : (
            <Flex h='100%' justify='center' align='center'>
              <Box w='50%'>
                <DaoOverviewDetails dao={dao} />
              </Box>
            </Flex>
          )}

          <Box
            pr={[0, null, null, null, 6]}
            mt='100'
            w={['100%', null, null, null, '50%']}
          >
            <Button variant='outline' mr='10' onClick={handleRandom}>
              Random
            </Button>

            <Button
              variant='outline'
              mr='10'
              onClick={() => handleUpdate(raidGuildTheme)}
            >
              RaidGuild
            </Button>
            <Button
              variant='outline'
              mr='10'
              onClick={() => handleUpdate(mcvTheme)}
            >
              MCV
            </Button>
            <Button variant='outline' onClick={() => handleUpdate(yearnTheme)}>
              Yearn
            </Button>

            <Flex>
              <Text
                as={Link}
                variant='outline'
                fontSize='10px'
                mr='10'
                mt='10'
                onClick={() => handleShuffle(true)}
              >
                Go Nuts
              </Text>
            </Flex>
          </Box>
        </Box>
      </>
    </>
  );
};

export default DaoTheme;
