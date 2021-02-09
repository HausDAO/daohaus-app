import React from 'react';
import { Box, Flex, Button } from '@chakra-ui/react';
import { Link as RouterLink, useParams } from 'react-router-dom';

import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
import { useMetaData } from '../contexts/MetaDataContext';
import { boostList } from '../content/boost-content';
import GenericModal from '../modals/genericModal';
import { useOverlay } from '../contexts/OverlayContext';
import BoostLaunchWrapper from '../components/boostLaunchWrapper';
import MainViewLayout from '../components/mainViewLayout';

const Boosts = ({ customTerms }) => {
  const { daoMetaData } = useMetaData();
  const { daochain, daoid } = useParams();
  const { setGenericModal } = useOverlay();

  const renderBoostCard = (boost, i) => {
    const boostData = daoMetaData.boosts && daoMetaData.boosts[boost.key];
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
                to={`/dao/${daochain}/${daoid}/settings/${boost.successRoute}`}
                textTransform='uppercase'
              >
                Settings
              </Button>
            ) : (
              <Button
                textTransform='uppercase'
                onClick={() => setGenericModal({ [boost.key]: true })}
              >
                Add This App
              </Button>
            )}
          </>
        )}
        <GenericModal closeOnOverlayClick={false} modalId={boost.key}>
          <>
            {!boost.comingSoon ? (
              <>
                <BoostLaunchWrapper boost={boost} />
              </>
            ) : null}
          </>
        </GenericModal>
      </ContentBox>
    );
  };

  return (
    <MainViewLayout header='Boosts' customTerms={customTerms}>
      <Box p={6}>
        <TextBox size='sm' mb={3}>
          Available Apps
        </TextBox>
        <Flex wrap='wrap' justify='space-evenly'>
          {daoMetaData
            ? boostList.map((boost, i) => {
                return renderBoostCard(boost, i);
              })
            : null}
        </Flex>
      </Box>
    </MainViewLayout>
  );
};

export default Boosts;
