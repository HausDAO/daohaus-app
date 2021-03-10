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
  useToast,
} from '@chakra-ui/react';
import { BsBoxArrowInRight } from 'react-icons/bs';
import { format } from 'date-fns';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';

import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
import DAOHaus from '../assets/img/Daohaus__Castle--Dark.svg';
import { useOverlay } from '../contexts/OverlayContext';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { fetchUberHausData } from '../utils/theGraph';
import {
  UBERHAUS_ADDRESS,
  UBERHAUS_NETWORK,
  UBERHAUS_NETWORK_NAME,
  UBERHAUS_STAKING_TOKEN,
  UBERHAUS_STAKING_TOKEN_SYMBOL,
} from '../utils/uberhaus';
import { TokenService } from '../services/tokenService';
import { IsJsonString } from '../utils/general';
import { chainByName } from '../utils/chain';

const DaoToDaoManager = ({ daoOverview, daoMetaData, setProposalType }) => {
  const {
    setD2dProposalTypeModal,
    setD2dProposalModal,
    setGenericModal,
  } = useOverlay();
  const toast = useToast();
  const { daochain, daoid } = useParams();
  const [uberHausMinion, setUberHausMinion] = useState(null);

  const [uberHausData, setUberHausData] = useSessionStorage(
    `uberhaus-${daoid}`,
    null,
  );

  console.log('daoMetaData', daoMetaData);

  useEffect(() => {
    const setup = async () => {
      const fetchUberHaus = async (uberHausAddress, minionAddress) => {
        const data = await fetchUberHausData({
          chainID: daochain,
          molochAddress: uberHausAddress,
          memberAddress: minionAddress,
          minionId: `${daoOverview.id}-minion-${minionAddress}`,
        });
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
        if (uberHausMinionData) {
          const tokenBalance = await TokenService({
            chainID: daochain,
            tokenAddress: UBERHAUS_STAKING_TOKEN,
            is32: false,
          })('balanceOf')(uberHausMinionData.minionAddress);
          setUberHausMinion({ ...uberHausMinionData, balance: tokenBalance });
          fetchUberHaus(
            uberHausMinionData.uberHausAddress,
            uberHausMinionData.minionAddress,
          );
        }
      }
    };

    if (daoOverview) {
      setup();
    }
  }, [daoOverview]);

  const openModal = () => setD2dProposalTypeModal((prevState) => !prevState);

  const handleStakeClick = () => {
    setD2dProposalModal((prevState) => !prevState);
    setProposalType('d2dStake');
  };

  const wrongChain = daochain !== UBERHAUS_NETWORK;
  const uberAlly = daoMetaData?.allies.find(
    (ally) => ally.allyType === 'uberHausBurner' && ally.isParent,
  );
  const uberParent = daoMetaData?.allies.find(
    (ally) => ally.allyType === 'uberHausBurner' && !ally.isParent,
  );
  const noMinion = !uberHausMinion;
  const notMember = uberHausMinion && !uberHausData?.members[0];
  const isMember = uberHausMinion && uberHausData?.members[0];
  const hasMinionBalance = uberHausMinion && +uberHausMinion.balance > 0;
  const whiteListedStakingToken =
    daoOverview &&
    uberHausData &&
    daoOverview.tokenBalances.some((balance) => {
      return (
        balance.token.tokenAddress.toLowerCase() ===
        UBERHAUS_STAKING_TOKEN.toLowerCase()
      );
    });

  const activeProposals = uberHausData
    ? uberHausData.proposals.filter((prop) => {
        return !prop.cancelled && !prop.processed;
      })
    : [];

  console.log('uberAllies', uberAlly);

  // TODO: brittle check here. will this show if already a member
  // add check to see if it's open and if there is one in uberhaus
  // TODO: add uberhaus proposals to this list
  // TODO: get delegate, if none have button to delegate form

  const activeMembershipProposal =
    notMember &&
    activeProposals.find((prop) => {
      const details = IsJsonString(prop.details)
        ? JSON.parse(prop.details.replace(/(\r\n|\n|\r)/gm, ''))
        : '';
      console.log('details', details);
      return details.uberType === 'staking';
    });
  console.log('activeMembershipProposal', activeMembershipProposal);

  if (wrongChain) {
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
          {uberAlly ? (
            <>
              <Box fontSize='md' my={2}>
                <Link
                  to={`/dao/${chainByName(uberAlly.allyNetwork).chain_id}/${
                    uberAlly.ally
                  }/allies`}
                >
                  Your UberHAUS member is an {UBERHAUS_NETWORK_NAME} clone
                  <Icon as={BsBoxArrowInRight} ml={10} />
                </Link>
              </Box>
            </>
          ) : (
            <>
              <Box fontSize='md' my={2}>
                UberHAUS is on {UBERHAUS_NETWORK_NAME}. You&apos;ll need to
                summon a clone of your dao to join.
                <OrderedList>
                  <ListItem>
                    Summon burner dao on {UBERHAUS_NETWORK_NAME}
                  </ListItem>
                  <ListItem>
                    join button in your {UBERHAUS_NETWORK_NAME} burner dao to
                    launch uberhaus minion
                  </ListItem>
                  <ListItem>stake haus for shares</ListItem>
                </OrderedList>
              </Box>
              <Button w='25%'>Clone</Button>
            </>
          )}
        </ContentBox>
      </>
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
              DAOs on {UBERHAUS_NETWORK_NAME} can join UberHAUS by staking $HAUS
              for governance shares.
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
              <TextBox size='sm'>
                Stake {UBERHAUS_STAKING_TOKEN_SYMBOL}{' '}
              </TextBox>
              {!whiteListedStakingToken ? (
                <Box fontSize='md' my={2}>
                  FYI: Whitelist {UBERHAUS_STAKING_TOKEN_SYMBOL} to recieve
                  reward after staking.
                </Box>
              ) : null}

              {hasMinionBalance ? (
                <>
                  <Box fontSize='md' my={2}>
                    {daoMetaData?.name} is ready to stake HAUS and join uberHAUS
                  </Box>
                  <Button w='25%' onClick={handleStakeClick}>
                    Stake
                  </Button>
                </>
              ) : (
                <>
                  <Box fontSize='md' my={2}>
                    You can&apos;t staking into UberHAUS until your UberHAUS
                    minion has a {UBERHAUS_STAKING_TOKEN_SYMBOL} balance. Send{' '}
                    {UBERHAUS_STAKING_TOKEN_SYMBOL} directly to your
                    minion&apos;s address: {uberHausMinion.minionAddress}.
                  </Box>
                  <CopyToClipboard
                    text={uberHausMinion.minionAddress}
                    onCopy={() =>
                      toast({
                        title: 'Copied Address',
                        position: 'top-right',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                      })
                    }
                  >
                    <Icon
                      as={FaCopy}
                      color='secondary.300'
                      ml={2}
                      _hover={{ cursor: 'pointer' }}
                    />
                  </CopyToClipboard>
                  <Box fontSize='md' my={2}>
                    Or create a funding proposal if you want to send from your
                    dao to the minion.
                  </Box>
                </>
              )}
            </Box>
          </Flex>
        ) : (
          <>
            {activeMembershipProposal ? (
              <Box>
                <Flex justify='space-between' py={4}>
                  <Box>
                    <TextBox size='sm'>Shares</TextBox>
                    <TextBox variant='value'>0</TextBox>
                  </Box>
                  <Box>
                    <TextBox size='sm'>Loot</TextBox>
                    <TextBox variant='value'>0</TextBox>
                  </Box>
                  <Box>
                    <TextBox size='sm'>Join Date</TextBox>
                    <TextBox variant='value'>pending</TextBox>
                  </Box>
                </Flex>
                <Link
                  to={`/dao/${daochain}/${daoid}/proposals/${activeMembershipProposal.proposalId}`}
                >
                  Staking proposal in progress
                  <Icon as={BsBoxArrowInRight} ml={10} />
                </Link>
              </Box>
            ) : null}
          </>
        )}

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

            {activeProposals.length ? (
              <Flex
                justifyContent='flex-start'
                alignItems='baseline'
                borderTopWidth='1px'
                borderTopColor='whiteAlpha.200'
                my={3}
              >
                <Text
                  fontFamily='heading'
                  my={2}
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
            ) : null}
          </>
        ) : null}
      </ContentBox>
    </>
  );
};

export default DaoToDaoManager;
