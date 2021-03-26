import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Button } from '@chakra-ui/button';
import {
  Box,
  Flex,
  Icon,
  Image,
  Link,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';
import { RiLoginBoxLine } from 'react-icons/ri';
import { BiCheckbox, BiCheckboxChecked } from 'react-icons/bi';

import TextBox from './TextBox';
import { UBERHAUS_DATA } from '../utils/uberhaus';
import ContentBox from './ContentBox';
import DAOHaus from '../assets/img/Daohaus__Castle--Dark.svg';
import DaoToDaoUberAlly from './daoToDaoUberAllyLink';
import { chainByName } from '../utils/chain';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { TokenService } from '../services/tokenService';
import { useOverlay } from '../contexts/OverlayContext';
import {
  pendingUberHausStakingProposal,
  pendingUberHausStakingProposalChildDao,
} from '../utils/proposalUtils';
import { truncateAddr } from '../utils/general';
import DaoToDaoProposalCard from './daoToDaoProposalCard';
import DaoToDaoMemberInfo from './daoToDaoMemberInfo';

// import ComingSoonOverlay from './comingSoonOverlay';

const DaoToDaoManager = ({
  daoOverview,
  daoMetaData,
  setProposalType,
  isMember,
  uberProposals,
  uberMembers,
  daoProposals,
}) => {
  const toast = useToast();
  const { daochain, daoid } = useParams();
  const { injectedChain } = useInjectedProvider();
  const {
    setD2dProposalTypeModal,
    setD2dProposalModal,
    setGenericModal,
  } = useOverlay();
  const [uberHausMinion, setUberHausMinion] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('isMember', isMember);

  useEffect(() => {
    const setup = async () => {
      const uberHausMinionData = daoOverview.minions.find(
        (minion) =>
          minion.minionType === 'UberHaus minion' &&
          minion.uberHausAddress === UBERHAUS_DATA.ADDRESS,
      );
      if (uberHausMinionData) {
        const uberHausMembership = uberMembers.find((member) => {
          return (
            member.memberAddress.toLowerCase() ===
            uberHausMinionData.minionAddress.toLowerCase()
          );
        });

        const activeMembershipProposal =
          (!uberHausMembership &&
            daoProposals.find((prop) =>
              pendingUberHausStakingProposalChildDao(prop),
            )) ||
          uberProposals.find((prop) =>
            pendingUberHausStakingProposal(
              prop,
              uberHausMinionData.minionAddress.toLowerCase(),
            ),
          );

        const openChildProposals = daoProposals
          ? daoProposals.filter(
              (p) =>
                p.applicant.toLowerCase() ===
                  uberHausMinionData.minionAddress.toLowerCase() &&
                !p.cancelled &&
                !p.processed,
            )
          : [];

        const openUberProposals = uberProposals
          ? uberProposals.filter((p) => !p.cancelled && !p.processed)
          : [];

        const whitelistedStakingToken = daoOverview.tokenBalances.find(
          (bal) => {
            return (
              bal.token.tokenAddress.toLowerCase() ===
              UBERHAUS_DATA.STAKING_TOKEN.toLowerCase()
            );
          },
        );
        const tokenBalance = await TokenService({
          chainID: daochain,
          tokenAddress: UBERHAUS_DATA.STAKING_TOKEN,
          is32: false,
        })('balanceOf')(uberHausMinionData.minionAddress);

        setUberHausMinion({
          ...uberHausMinionData,
          balance: tokenBalance,
          uberHausMembership,
          activeMembershipProposal,
          openChildProposals,
          openUberProposals,
          whitelistedStakingToken,
        });
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    if (daoOverview && uberMembers && uberProposals && daoProposals) {
      setLoading(true);
      setup();
    }
  }, [daoOverview, uberMembers, uberProposals, daoProposals]);

  const handleStakeClick = () => {
    setD2dProposalModal((prevState) => !prevState);
    setProposalType('d2dStake');
  };

  const handleNominateDelegateClick = () => {
    setD2dProposalModal((prevState) => !prevState);
    setProposalType('d2dDelegate');
  };

  const openModal = () => setD2dProposalTypeModal((prevState) => !prevState);

  const userNetworkMismatchOrNotMember =
    injectedChain?.chain_id !== daochain || !isMember;

  const daoNotOnUberNetwork = daochain !== UBERHAUS_DATA.NETWORK;

  const hasMinionNotMember =
    uberHausMinion && !uberHausMinion.uberHausMembership;

  const isUberHausMember = uberHausMinion && uberHausMinion.uberHausMembership;

  const needDelegateKeySet =
    isUberHausMember &&
    uberHausMinion.uberHausDelegate !==
      uberHausMinion.uberHausMembership.delegateKey;

  const uberAlly = daoMetaData?.allies.find(
    (ally) => ally.allyType === 'uberHausBurner' && ally.isParent,
  );

  const uberParent = daoMetaData?.allies.find(
    (ally) => ally.allyType === 'uberHausBurner' && !ally.isParent,
  );

  if (daoid === UBERHAUS_DATA.ADDRESS) {
    return (
      <>
        <TextBox size='xs' mb={2}>
          DAO On DAO Memberships
        </TextBox>
        <ContentBox w='100%' maxWidth='40rem' position='relative'>
          <Flex align='center'>
            <>
              <Image src={DAOHaus} w='50px' h='50px' mr={4} />
              <Box
                fontFamily='heading'
                fontSize='xl'
                fontWeight={900}
                flexGrow='2'
              >
                YOUR ARE UberHAUS
              </Box>
            </>
          </Flex>
        </ContentBox>
      </>
    );
  }

  return (
    <>
      <TextBox size='xs' mb={2}>
        DAO On DAO Memberships
      </TextBox>
      <ContentBox w='100%' maxWidth='40rem' position='relative'>
        <Flex align='center'>
          {daoid === UBERHAUS_DATA.ADDRESS ? (
            <>
              <Image src={DAOHaus} w='50px' h='50px' mr={4} />
              <Box
                fontFamily='heading'
                fontSize='xl'
                fontWeight={900}
                flexGrow='2'
              >
                YOUR ARE UberHAUS
              </Box>
            </>
          ) : (
            <>
              <Image src={DAOHaus} w='50px' h='50px' mr={4} />
              <Box
                fontFamily='heading'
                fontSize='xl'
                fontWeight={900}
                flexGrow='2'
              >
                UberHAUS
              </Box>
              <RouterLink
                to={`/dao/${UBERHAUS_DATA.NETWORK}/${UBERHAUS_DATA.ADDRESS}`}
              >
                <Icon
                  as={RiLoginBoxLine}
                  color='secondary.500'
                  h='25px'
                  w='25px'
                />
              </RouterLink>
            </>
          )}
        </Flex>
        {/* <ComingSoonOverlay message='👀 Check back soon!' /> */}

        {loading ? (
          <Spinner />
        ) : (
          <>
            {daoNotOnUberNetwork ? (
              <Box>
                {uberAlly ? (
                  <Box mt={5}>
                    <DaoToDaoUberAlly
                      dao={{
                        name: `Manange membership in the ${UBERHAUS_DATA.NETWORK_NAME} burner dao`,
                        link: `/dao/${
                          chainByName(uberAlly.allyNetwork).chain_id
                        }/${uberAlly.ally}/allies`,
                      }}
                    />
                  </Box>
                ) : (
                  <>
                    {userNetworkMismatchOrNotMember ? (
                      <Box fontSize='md' my={2}>
                        Are you a member of this DAO and on the correct network?
                      </Box>
                    ) : (
                      <>
                        <Box fontSize='md' my={2}>
                          UberHAUS is on the {UBERHAUS_DATA.NETWORK_NAME}{' '}
                          network. You&apos;ll need to summon a clone of your
                          DAO there to join.
                        </Box>
                        <Button
                          w='50%'
                          as={RouterLink}
                          to={`/dao/${daochain}/${daoid}/uberhaus/clone`}
                        >
                          Summon Clone
                        </Button>
                      </>
                    )}
                  </>
                )}
              </Box>
            ) : (
              <>
                {!uberHausMinion ? (
                  <>
                    <Box fontSize='md' my={2}>
                      {daoMetaData?.name} is not a member of UberHAUS
                    </Box>
                    <Box fontSize='md' my={2}>
                      The 1st step to join is to summon a minion to help with
                      membership duties.
                    </Box>
                    {userNetworkMismatchOrNotMember ? (
                      <Box fontSize='md' my={2}>
                        Are you a member of this DAO and on the correct network?
                      </Box>
                    ) : (
                      <Button
                        w='50%'
                        onClick={() =>
                          setGenericModal({ uberMinionLaunch: true })
                        }
                      >
                        Summon Minion
                      </Button>
                    )}
                  </>
                ) : null}

                {hasMinionNotMember &&
                !uberHausMinion.activeMembershipProposal ? (
                  <>
                    <Box fontSize='md' my={2}>
                      {daoMetaData?.name} is not a member of UberHAUS
                    </Box>
                    <Box fontSize='md' my={2}>
                      The 2nd step to join is to make a proposal to stake{' '}
                      {UBERHAUS_DATA.STAKING_TOKEN_SYMBOL} into the UberHAUS
                      DAO.
                    </Box>

                    {+uberHausMinion.balance > 0 &&
                    uberHausMinion.whitelistedStakingToken ? (
                      <Button w='75%' onClick={handleStakeClick}>
                        Make Staking Proposal
                      </Button>
                    ) : (
                      <>
                        <Box fontSize='md' my={2}>
                          Before you can make a proposal your DAO and minion
                          need to be ready to work with{' '}
                          {UBERHAUS_DATA.STAKING_TOKEN_SYMBOL}.
                        </Box>

                        {!uberHausMinion.whitelistedStakingToken ? (
                          <Flex justifyContent='flex-start' alignItems='center'>
                            <Icon
                              as={BiCheckbox}
                              color='secondary.500'
                              h='25px'
                              w='25px'
                              mr={3}
                            />
                            <Box fontSize='md' my={2}>
                              Approve {UBERHAUS_DATA.STAKING_TOKEN_SYMBOL} with
                              a token proposal.
                            </Box>
                            <RouterLink
                              to={`/dao/${daochain}/${daoid}/proposals/new`}
                            >
                              <Icon
                                as={RiLoginBoxLine}
                                ml={5}
                                color='secondary.500'
                                h='25px'
                                w='25px'
                              />
                            </RouterLink>
                          </Flex>
                        ) : (
                          <Flex justifyContent='flex-start' alignItems='center'>
                            <Icon
                              as={BiCheckboxChecked}
                              color='secondary.500'
                              h='25px'
                              w='25px'
                              mr={3}
                            />
                            <Box fontSize='md' my={2}>
                              {UBERHAUS_DATA.STAKING_TOKEN_SYMBOL} is
                              whitelisted. Your DAO is ready!
                            </Box>
                          </Flex>
                        )}

                        {+uberHausMinion.balance <= 0 ? (
                          <>
                            <Flex
                              justifyContent='flex-start'
                              alignItems='center'
                            >
                              <Icon
                                as={BiCheckbox}
                                color='secondary.500'
                                h='25px'
                                w='25px'
                                mr={3}
                              />
                              <Box fontSize='md' my={2}>
                                Send {UBERHAUS_DATA.STAKING_TOKEN_SYMBOL} to
                                your minion&apos;s address
                              </Box>
                            </Flex>
                            <Flex>
                              <>{truncateAddr(uberHausMinion.minionAddress)}</>
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
                            </Flex>
                          </>
                        ) : (
                          <Flex justifyContent='flex-start' alignItems='center'>
                            <Icon
                              as={BiCheckboxChecked}
                              color='secondary.500'
                              h='25px'
                              w='25px'
                              mr={3}
                            />
                            <Box fontSize='md' my={2}>
                              The minion has a{' '}
                              {UBERHAUS_DATA.STAKING_TOKEN_SYMBOL} balance and
                              is ready!
                            </Box>
                          </Flex>
                        )}
                      </>
                    )}
                  </>
                ) : null}

                {uberHausMinion?.activeMembershipProposal ? (
                  <>
                    <DaoToDaoMemberInfo
                      membership={uberHausMinion?.uberHausMembership}
                      delegate={uberHausMinion?.uberHausDelegate}
                      handleNominateDelegateClick={handleNominateDelegateClick}
                    />
                    <Box mt={10}>
                      <DaoToDaoProposalCard
                        proposal={uberHausMinion.activeMembershipProposal}
                      />
                    </Box>
                  </>
                ) : null}

                {isUberHausMember ? (
                  <>
                    <DaoToDaoMemberInfo
                      membership={uberHausMinion?.uberHausMembership}
                      delegate={uberHausMinion?.uberHausDelegate}
                      needDelegateKeySet={needDelegateKeySet}
                      openModal={openModal}
                      handleNominateDelegateClick={handleNominateDelegateClick}
                    />

                    {uberHausMinion.openChildProposals.length ? (
                      <Flex
                        justifyContent='space-between'
                        alignItems='center'
                        mt={10}
                      >
                        <TextBox mb={2} size='sm'>
                          {`${uberHausMinion.openChildProposals.length} Active Proposals for UberHAUS`}
                        </TextBox>
                        <RouterLink to={`/dao/${daochain}/${daoid}/proposals`}>
                          <Icon
                            as={RiLoginBoxLine}
                            color='secondary.500'
                            h='25px'
                            w='25px'
                          />
                        </RouterLink>
                      </Flex>
                    ) : null}

                    {uberHausMinion.openUberProposals.length ? (
                      <Flex
                        justifyContent='space-between'
                        alignItems='center'
                        mt={10}
                      >
                        <TextBox mb={2} size='sm'>
                          {`${uberHausMinion.openUberProposals.length} Active Proposals in UberHAUS`}
                        </TextBox>
                        <RouterLink
                          to={`/dao/${UBERHAUS_DATA.NETWORK}/${UBERHAUS_DATA.ADDRESS}/proposals`}
                        >
                          <Icon
                            as={RiLoginBoxLine}
                            color='secondary.500'
                            h='25px'
                            w='25px'
                          />
                        </RouterLink>
                      </Flex>
                    ) : null}
                  </>
                ) : null}

                {uberParent ? (
                  <Box mt={10} borderTop='1px' py={5}>
                    <DaoToDaoUberAlly
                      dao={{
                        bodyText: `Your UberHAUS membership is managed here in this ${UBERHAUS_DATA.NETWORK_NAME} clone DAO`,
                        name: `Visit your home dao`,
                        link: `/dao/${
                          chainByName(uberParent.allyNetwork).chain_id
                        }/${uberParent.ally}/allies`,
                      }}
                    />
                  </Box>
                ) : null}
              </>
            )}
          </>
        )}

        {!isUberHausMember ? (
          <Box mt={7} mb={2} fontSize='sm'>
            <Link
              href='https://discord.gg/eJsBk3sf'
              target='_blank'
              rel='noreferrer noopener'
              color='secondary.500'
              my={3}
            >
              Need a hand? Get help in our Discord.
            </Link>
          </Box>
        ) : null}
      </ContentBox>
    </>
  );
};

export default DaoToDaoManager;
