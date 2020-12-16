import React from 'react';
// import { Link } from 'react-router-dom';
import { Box, Flex, Button } from '@chakra-ui/react';
import ContentBox from '../../components/Shared/ContentBox';
import TextBox from '../../components/Shared/TextBox';
// import { useDao } from '../../contexts/PokemolContext';

const boostList = [
  {
    name: 'Custom Theme',
    description: 'Customize the visual theme of your community',
    comingSoon: true,
  },
  {
    name: 'Notifications',
    description:
      'Customize and send notifications of DAO activity to your social channels',
    comingSoon: true,
  },
  {
    name: 'Minion',
    description: 'Create and vote on execution of arbitrary contract calls',
    comingSoon: true,
  },
];

const Boosts = () => {
  // const [dao] = useDao();

  return (
    <Box p={6}>
      <TextBox size='sm' mb={3}>
        Available Apps
      </TextBox>
      <Flex wrap='wrap' justify='space-evenly'>
        {boostList.map((boost, i) => {
          return (
            <ContentBox
              d='flex'
              key={i}
              w={['100%', '100%', '50%', '33%']}
              h='370px'
              mb={3}
              p={6}
              flexDirection='column'
              alignItems='center'
              justifyContent='space-around'
            >
              <Box fontFamily='heading' fontSize='2xl' fontWeight={700}>
                {boost.name}
              </Box>
              <Box textAlign='center'>{boost.description}</Box>
              {boost.comingSoon ? (
                <Button textTransform='uppercase' disabled={true}>
                  Coming Soon
                </Button>
              ) : (
                <Button textTransform='uppercase'>Add This App</Button>
              )}
            </ContentBox>
          );
        })}
      </Flex>
    </Box>
  );
};

export default Boosts;
