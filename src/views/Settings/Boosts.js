import React from 'react';
// import { Link } from 'react-router-dom';
import { Box, Flex, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

import ContentBox from '../../components/Shared/ContentBox';
import TextBox from '../../components/Shared/TextBox';
import GenericModal from '../../components/Modal/GenericModal';
import { useDao, useModals } from '../../contexts/PokemolContext';
import NewMinionForm from '../../components/Settings/NewMinionForm';
import CustomThemeLaunch from '../../components/Settings/CustomThemeLaunch';

const boostList = [
  {
    name: 'Custom Theme',
    key: 'customTheme',
    description: 'Customize the visual theme of your community',
    price: '0',
    modalName: 'newCustomTheme',
    modalBody: <CustomThemeLaunch />,
  },
  {
    name: 'Minion',
    key: 'vanillaMinions',
    description: 'Create and vote on execution of external contracts',
    comingSoon: false,
    price: '0',
    modalName: 'newBoost',
    modalBody: <NewMinionForm />,
  },
  {
    name: 'Notifications',
    key: 'notifications1',
    description:
      'Customize and send notifications of DAO activity to your social channels',
    comingSoon: true,
    price: '0',
  },
];

const Boosts = () => {
  const [dao] = useDao();
  const { modals, openModal } = useModals();

  const renderBoostCard = (boost, i) => {
    const boostData = dao.boosts[boost.key];
    const hasBoost = boostData && boostData.active;

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
        <Box textAlign='center' fontFamily='heading'>
          Cost
        </Box>

        <Box textAlign='center'>
          {boost.price === '0' ? (
            <Box fontFamily='heading' fontSize='xl' m={0}>
              Free
            </Box>
          ) : null}
        </Box>
        {boost.comingSoon ? (
          <Button textTransform='uppercase' disabled={true}>
            Coming Soon
          </Button>
        ) : (
          <>
            {hasBoost ? (
              <Button
                as={RouterLink}
                to={`/dao/${dao.address}/settings`}
                textTransform='uppercase'
              >
                Settings
              </Button>
            ) : (
              <Button
                textTransform='uppercase'
                onClick={() => openModal(boost.modalName)}
              >
                Add This App
              </Button>
            )}
          </>
        )}
        <GenericModal isOpen={modals[boost.modalName]}>
          {boost.modalBody}
        </GenericModal>
      </ContentBox>
    );
  };

  return (
    <Box p={6}>
      <TextBox size='sm' mb={3}>
        Available Apps
      </TextBox>
      <Flex wrap='wrap' justify='space-evenly'>
        {dao.boosts
          ? boostList.map((boost, i) => {
              return renderBoostCard(boost, i);
            })
          : null}
      </Flex>
    </Box>
  );
};

export default Boosts;
