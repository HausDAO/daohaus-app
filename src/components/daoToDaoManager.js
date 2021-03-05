import React, { useEffect, useState } from 'react';
import {
  Image,
  Flex,
  Box,
  Button,
  OrderedList,
  ListItem,
} from '@chakra-ui/react';
// import { useModals } from '../../contexts/PokemolContext';
import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
import DAOHaus from '../assets/img/Daohaus__Castle--Dark.svg';
import { useOverlay } from '../contexts/OverlayContext';
import { useDao } from '../contexts/DaoContext';
import { useMetaData } from '../contexts/MetaDataContext';
import { useParams } from 'react-router-dom';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { fetchUberHausData } from '../utils/theGraph';
import { format } from 'date-fns';
import { UBERHAUS_ADDRESS } from '../utils/uberhaus';

// TODO don't show for rinkeby/kovan. how does this work across network? will uberhaus be on mainnet or xdai? matic?

// can join
//  // needs to be a member
//  // needs to be on xdai
//  // step 1: then can launch an uberMinion
//  // step 2: make a stake proposal for shares - need help content here
const UBERHAUS_NETWORK = '0x2a';

const DaoToDaoManager = ({ daoOverview, daoMetaData, setProposalType }) => {
  const {
    setD2dProposalTypeModal,
    setD2dProposalModal,
    setGenericModal,
  } = useOverlay();
  const { daochain, daoid } = useParams();
  const [uberHausMinion, setUberHausMinion] = useState(null);

  const [uberHausData, setUberHausData] = useSessionStorage(
    `uberhaus-${daoid}`,
    null,
  );

  useEffect(() => {
    console.log('daoOverview', daoOverview, daoMetaData);
    const fetchUberHaus = async (uberHausAddress, minionAddress) => {
      const data = await fetchUberHausData({
        chainID: daochain,
        molochAddress: uberHausAddress,
        memberAddress: minionAddress,
      });
      console.log('data', data);
      setUberHausData(data.moloch);
    };

    if (daoOverview) {
      // TODO: adjust when there are multiple uberhaus
      const uberHausMinion = daoOverview.minions.find(
        (minion) =>
          minion.minionType === 'UberHaus minion' &&
          minion.uberHausAddress === UBERHAUS_ADDRESS,
      );
      console.log('uberHausMinion', uberHausMinion);
      if (uberHausMinion) {
        setUberHausMinion(uberHausMinion);
        fetchUberHaus(
          uberHausMinion.uberHausAddress,
          uberHausMinion.minionAddress,
        );
      }
    }
  }, [daoOverview]);

  const openModal = () => setD2dProposalTypeModal((prevState) => !prevState);

  const handleStakeClick = () => {
    setD2dProposalModal((prevState) => !prevState);
    setProposalType('d2dStake');
  };

  const noMinion = !uberHausMinion;
  const notMember = uberHausMinion && !uberHausData?.members[0];
  const isMember = uberHausMinion && uberHausData?.members[0];

  if (daochain !== UBERHAUS_NETWORK) {
    return (
      <Box fontSize='md' my={2}>
        <OrderedList>
          <ListItem>Summon burner dao ion xdai</ListItem>
          <ListItem>
            join button in your xdai burner dao to launch uberhaus minion
          </ListItem>
          <ListItem>stake haus for shares</ListItem>
        </OrderedList>
      </Box>
    );
  }

  return (
    <>
      <TextBox size='xs' mb={2}>
        DAO On DAO Memberships
      </TextBox>
      <ContentBox w='40%'>
        <Flex align='center'>
          <Image src={DAOHaus} w='50px' h='50px' mr={4} />
          <Box fontFamily='heading' fontSize='xl' fontWeight={900}>
            UberHAUS
          </Box>
        </Flex>
        {noMinion ? (
          <Box>
            <TextBox my={2} size='sm'>
              {daoMetaData?.name} is not a member of UberHAUS
            </TextBox>
            <Box fontSize='md' my={2}>
              DAOs on xDAI can join UberHAUS by staking $HAUS for governance
              shares.
            </Box>
            <Box fontSize='md' my={2}>
              Lorem Ipsum directions here.
            </Box>
            <Box fontSize='sm' my={2}>
              <OrderedList>
                <ListItem>join button to launch uberhaus minion</ListItem>
                <ListItem>stake haus for shares</ListItem>
              </OrderedList>
            </Box>
            <Button
              w='25%'
              onClick={() => setGenericModal({ uberMinionLaunch: true })}
            >
              Join
            </Button>
          </Box>
        ) : null}
        {notMember ? (
          <Flex justify='space-between' py={4}>
            <Box>
              <TextBox size='sm'>Almost In</TextBox>
              <Box fontSize='md' my={2}>
                DAO NEEDS $HAUS whitelisted
              </Box>
              <Box fontSize='md' my={2}>
                {daoMetaData?.name} is ready to stake HAUS and join uberHAUS
              </Box>
              <Button w='25%' onClick={handleStakeClick}>
                Stake
              </Button>
            </Box>
          </Flex>
        ) : null}
        {isMember ? (
          <>
            <Flex justify='space-between' py={4}>
              <Box>
                <TextBox size='sm'>Shares</TextBox>
                <TextBox variant='value'>
                  {uberHausData?.members[0].shares}
                </TextBox>
              </Box>
              <Box>
                <TextBox size='sm'>Loot</TextBox>
                <TextBox variant='value'>
                  {uberHausData?.members[0].loot}
                </TextBox>
              </Box>
              <Box>
                <TextBox size='sm'>Join Date</TextBox>
                <TextBox variant='value'>
                  {format(
                    new Date(+uberHausData?.members[0].createdAt * 1000),
                    'MMM. d, yyyy',
                  ) || '--'}
                </TextBox>
              </Box>
            </Flex>
            <Box>
              <TextBox mb={2} size='sm'>
                Delegate
              </TextBox>
              <Flex justify='space-between'>
                <Flex>
                  <Image
                    src={DAOHaus}
                    alt='delegate name'
                    w='50px'
                    h='50px'
                    mr={3}
                  />
                  <Box>
                    <Box fontFamily='heading' fontWeight={800}>
                      Takashi
                    </Box>
                    <Box fontFamily='mono' fontSize='sm'>
                      Takashi.eth
                    </Box>
                  </Box>
                </Flex>

                <Button w='25%' onClick={openModal}>
                  Manage
                </Button>
              </Flex>
            </Box>
          </>
        ) : null}
      </ContentBox>
    </>
  );
};

export default DaoToDaoManager;
