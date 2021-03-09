import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Image,
  Flex,
  Box,
  Button,
  OrderedList,
  ListItem,
  Text,
  Icon,
} from '@chakra-ui/react';
import { BsBoxArrowInRight } from 'react-icons/bs';
import { format } from 'date-fns';

import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
import DAOHaus from '../assets/img/Daohaus__Castle--Dark.svg';
import { useOverlay } from '../contexts/OverlayContext';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { fetchUberHausData } from '../utils/theGraph';
import {
  UBERHAUS_ADDRESS,
  UBERHAUS_NETWORK,
  UBERHAUS_STAKING_TOKEN,
} from '../utils/uberhaus';

// TODO don't show for rinkeby/kovan. how does this work across network? will uberhaus be on mainnet or xdai? matic?

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
        minionId: `${daoOverview.id}-minion-${minionAddress}`,
      });
      console.log('data', data);
      setUberHausData({
        ...data.moloch,
        proposals: data.minion ? data.minion.proposals : [],
      });
    };

    if (daoOverview) {
      const uberHausMinionData = daoOverview.minions.find(
        (minion) =>
          minion.minionType === 'UberHaus minion' &&
          minion.uberHausAddress === UBERHAUS_ADDRESS,
      );
      console.log('uberHausMinion', uberHausMinionData);
      if (uberHausMinionData) {
        setUberHausMinion(uberHausMinionData);
        fetchUberHaus(
          uberHausMinionData.uberHausAddress,
          uberHausMinionData.minionAddress,
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
  const whiteListedStakingToken =
    daoOverview &&
    uberHausData &&
    daoOverview.tokenBalances.some((balance) => {
      return (
        balance.token.tokenAddress.toLowerCase() ===
        UBERHAUS_STAKING_TOKEN.toLowerCase()
      );
    });

  console.log('uberHausData', uberHausData);
  const activeProposals = uberHausData
    ? uberHausData.proposals.filter((prop) => {
        return !prop.cancelled && !prop.processed;
      })
    : [];
  // TODO: brittle check here. might need boost graph to track this?
  // lets just have this as active prop/memberhip or delegate and in child or haus dao
  const activeMembershipProposal = notMember && activeProposals[0];
  console.log('activeMembershipProposal', activeMembershipProposal);

  // other states:
  // has membershop proposal
  // // needs delegate
  // // open delegate proposal
  // also need to check if a prop is in uerhaus for them

  // going to be easier pulling these fro daoProposals with hydrated data... but need for uberhaus props too

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
        {notMember && !activeMembershipProposal ? (
          <Flex justify='space-between' py={4}>
            <Box>
              <TextBox size='sm'>Almost In</TextBox>
              {!whiteListedStakingToken ? (
                <Box fontSize='md' my={2}>
                  DAO NEEDS $HAUS whitelisted
                </Box>
              ) : null}

              {!whiteListedStakingToken ? (
                <Box fontSize='md' my={2}>
                  DAO NEEDS $HAUS whitelisted
                </Box>
              ) : null}

              {whiteListedStakingToken ? (
                <>
                  <Box fontSize='md' my={2}>
                    {daoMetaData?.name} is ready to stake HAUS and join uberHAUS
                  </Box>
                  <Button w='25%' onClick={handleStakeClick}>
                    Stake
                  </Button>
                </>
              ) : null}
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
        {activeProposals.length ? (
          <>
            {activeMembershipProposal ? (
              <Box>
                proposal card
                {/* <Text
                  fontFamily='heading'
                  mb={2}
                  size='xs'
                  color='secondary.300'
                >
                  membership proposal card here
                </Text> */}
              </Box>
            ) : (
              <Flex justifyContent='flex-start' alignItems='baseline'>
                <Text
                  fontFamily='heading'
                  mb={2}
                  size='xs'
                  color='secondary.300'
                >
                  {`${activeProposals.length} ACTIVE PROPOSAL${
                    activeProposals.length > 1 ? 'S' : ''
                  }`}
                </Text>
                <Link to={`/dao/${daochain}/${daoid}/proposals`}>
                  <Icon as={BsBoxArrowInRight} ml={10} />
                </Link>
              </Flex>
            )}
          </>
        ) : null}
      </ContentBox>
    </>
  );
};

export default DaoToDaoManager;
