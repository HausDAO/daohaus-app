import React, { useState, useEffect } from 'react';
import { Box, Flex, Button, HStack } from '@chakra-ui/react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { RiArrowRightLine } from 'react-icons/ri';

import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
import { boostList } from '../content/boost-content';
import GenericModal from '../modals/genericModal';
import { useOverlay } from '../contexts/OverlayContext';
import BoostLaunchWrapper from '../components/boostLaunchWrapper';
import MainViewLayout from '../components/mainViewLayout';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { daoConnectedAndSameChain } from '../utils/general';
import { getTerm } from '../utils/metadata';
import { getWrapNZap } from '../utils/requests';

const Boosts = ({ customTerms, daoMember, daoOverview, daoMetaData }) => {
  const { daochain, daoid } = useParams();
  const { setGenericModal } = useOverlay();
  const { address, injectedChain } = useInjectedProvider();
  const [wrapNZap, setWrapNZap] = useState(null);

  const canInteract =
    daoConnectedAndSameChain(address, injectedChain?.chainId, daochain) &&
    +daoMember?.shares > 0;

  const hasDependentBoost = boostKey => {
    if (boostKey === 'vanillaMinions') {
      const minions = daoOverview.minions.length;
      return minions;
    }
    const boostData = daoMetaData.boosts[boostKey];
    console.log(daoMetaData.boosts, daoOverview);
    return boostData && boostData.active;
  };

  // move to contexts??
  useEffect(() => {
    const getWNZ = async () => {
      setWrapNZap(await getWrapNZap(daochain, daoid));
    };
    getWNZ();
  }, [daoid]);

  const renderBoostCard = (boost, i) => {
    const boostData = daoMetaData.boosts && daoMetaData.boosts[boost.key];
    const hasBoost =
      (boostData && boostData.active) || (boost.key === 'wrapNZap' && wrapNZap);

    return (
      <ContentBox
        d='flex'
        key={i}
        w={['100%', '100%', '40%', '30%']}
        h='370px'
        m={3}
        mb={6}
        p={6}
        flexDirection='column'
        alignItems='center'
        justifyContent='space-around'
      >
        <Box fontFamily='heading' fontSize='2xl' fontWeight={700}>
          {boost.name}
        </Box>
        <Box textAlign='center'>{boost.description}</Box>
        {boost.price === '0' ? (
          <Box textAlign='center' fontFamily='heading'>
            Cost
          </Box>
        ) : null}

        <Box textAlign='center'>
          {boost.price === '0' ? (
            <Box fontFamily='heading' fontSize='xl' m={0}>
              Free
            </Box>
          ) : null}
        </Box>
        {boost.comingSoon ? (
          <Button textTransform='uppercase' disabled>
            Coming Soon
          </Button>
        ) : (
          <>
            {hasBoost ? (
              <HStack spacing={4}>
                {boost.settings && (
                  <Button
                    as={canInteract && RouterLink}
                    variant={boost.link ? 'outline' : null}
                    to={`/dao/${daochain}/${daoid}/settings/${boost.successRoute}`}
                    textTransform='uppercase'
                    disabled={!canInteract}
                  >
                    Settings
                  </Button>
                )}
                {boost.link && (
                  <Button
                    as={RouterLink}
                    to={`/dao/${daochain}/${daoid}/boost/${boost.link}`}
                    textTransform='uppercase'
                    rightIcon={<RiArrowRightLine />}
                  >
                    Go
                  </Button>
                )}
              </HStack>
            ) : (
              <>
                {boost.dependency && !hasDependentBoost(boost?.dependency) ? (
                  <Button textTransform='uppercase' disabled>
                    {`Needs ${boost.dependency}`}
                  </Button>
                ) : (
                  <Button
                    textTransform='uppercase'
                    onClick={() => setGenericModal({ [boost.key]: true })}
                    disabled={!canInteract}
                  >
                    Add This App
                  </Button>
                )}
              </>
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
    <MainViewLayout header='Boosts' customTerms={customTerms} isDao>
      <GenericModal closeOnOverlayClick modalId='boostErrorModal'>
        Error occurred!
      </GenericModal>
      <Box>
        <TextBox size='sm' mb={3}>
          {`Available ${getTerm(customTerms, 'boosts')}`}
        </TextBox>
        <Flex wrap='wrap' justify='space-evenly'>
          {daoMetaData
            ? boostList
                .filter(
                  boost => boost?.networks?.all || boost?.networks?.[daochain],
                )
                .map((boost, i) => {
                  return renderBoostCard(boost, i);
                })
            : null}
        </Flex>
      </Box>
    </MainViewLayout>
  );
};

export default Boosts;
