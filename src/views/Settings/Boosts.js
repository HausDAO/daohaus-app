import React from 'react';
// import { Link } from 'react-router-dom';
import { Box, Flex, Button } from '@chakra-ui/react';

import ContentBox from '../../components/Shared/ContentBox';
import TextBox from '../../components/Shared/TextBox';
import GenericModal from '../../components/Modal/GenericModal';
import { useModals } from '../../contexts/PokemolContext';
import NewMinionForm from '../../components/Settings/NewMinionForm';

const boostList = [
  {
    name: 'Custom Theme',
    key: 'customTheme',
    description: 'Customize the visual theme of your community',
    comingSoon: true,
  },
  {
    name: 'Notifications',
    key: 'notifications',
    description:
      'Customize and send notifications of DAO activity to your social channels',
    comingSoon: true,
  },
  {
    name: 'Minion',
    key: 'vanillaMinions',
    description: 'Create and vote on execution of arbitrary contract calls',
    comingSoon: false,
    modalName: 'newBoost',
    modalBody: <NewMinionForm />,
  },
];

const Boosts = () => {
  const { modals, openModal } = useModals();

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
                <Button
                  textTransform='uppercase'
                  onClick={() => openModal(boost.modalName)}
                >
                  Add This App
                </Button>
              )}
              <GenericModal isOpen={modals[boost.modalName]}>
                {boost.modalBody}
              </GenericModal>
            </ContentBox>
          );
        })}
      </Flex>
    </Box>
  );
};

export default Boosts;
