import React from 'react';
import { Box, Flex, Button } from '@chakra-ui/react';
import { Link as RouterLink, useParams } from 'react-router-dom';

import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
// import GenericModal from '../modal/genericModal';
import { useMetaData } from '../contexts/MetaDataContext';
import { boostList } from '../content/boost-content';
// import BoostLaunchWrapper from '../components/boostLaunchWrapper';

const Boosts = () => {
  const { daoMetaData } = useMetaData();
  const { daochain, daoid } = useParams();
  // const { modals, openModal } = useModals();
  console.log(daoMetaData);

  const renderBoostCard = (boost, i) => {
    const boostData = daoMetaData?.boosts[boost.key];
    console.log(boostData);
    const hasBoost = boostData && boostData.active;
    console.log('boost: ', boost, 'hasBoost: ', hasBoost);

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
                to={`/dao/${daochain}/${daoid}/settings`}
                textTransform='uppercase'
              >
                Settings
              </Button>
            ) : (
              <Button
                textTransform='uppercase'
                // onClick={() => openModal(boost.modalName)}
              >
                Add This App
              </Button>
            )}
          </>
        )}
        {/* <GenericModal isOpen={modals[boost.modalName]}>
          <>
            {!boost.comingSoon ? (
              <>
                <BoostLaunchWrapper boost={boost} />
              </>
            ) : null}
          </>
        </GenericModal> */}
      </ContentBox>
    );
  };

  return (
    <Box p={6}>
      <TextBox size='sm' mb={3}>
        Available Apps
      </TextBox>
      <Flex wrap='wrap' justify='space-evenly'>
        {daoMetaData?.boosts
          ? boostList.map((boost, i) => {
              return renderBoostCard(boost, i);
            })
          : null}
      </Flex>
    </Box>
  );
};

export default Boosts;
