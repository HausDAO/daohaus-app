import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Button } from '@chakra-ui/button';
import {
  Box,
  Flex,
  Icon,
  Image,
  Link,
  ListItem,
  OrderedList,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';

import TextBox from './TextBox';
import {
  UBERHAUS_ADDRESS,
  UBERHAUS_NETWORK,
  UBERHAUS_NETWORK_NAME,
  UBERHAUS_STAKING_TOKEN,
  UBERHAUS_STAKING_TOKEN_SYMBOL,
} from '../utils/uberhaus';
import ContentBox from './ContentBox';
import DAOHaus from '../assets/img/Daohaus__Castle--Dark.svg';
import DaoToDaoUberAlly from './daoToDaoUberAllyLink';
import { chainByName } from '../utils/chain';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { TokenService } from '../services/tokenService';
import { useOverlay } from '../contexts/OverlayContext';
import { pendingUberHausStakingProposal } from '../utils/proposalUtils';
import { truncateAddr } from '../utils/general';
import DaoToDaoProposalCard from './daoToDaoProposalCard';

// import ComingSoonOverlay from './comingSoonOverlay';

const DaoToDaoManager = ({
  daoOverview,
  daoMetaData,
  setProposalType,
  isMember,
  uberProposals,
  uberMembers,
  uberOverview,
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

  useEffect(() => {
    const setup = async () => {
      if (daoOverview && uberMembers && uberProposals && daoProposals) {
        const uberHausMinionData = daoOverview.minions.find(
          (minion) =>
            minion.minionType === 'UberHaus minion' &&
            minion.uberHausAddress === UBERHAUS_ADDRESS,
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
                pendingUberHausStakingProposal(prop),
              )) ||
            uberProposals.find((prop) => pendingUberHausStakingProposal(prop));

          const tokenBalance = await TokenService({
            chainID: daochain,
            tokenAddress: UBERHAUS_STAKING_TOKEN,
            is32: false,
          })('balanceOf')(uberHausMinionData.minionAddress);
          setUberHausMinion({
            ...uberHausMinionData,
            balance: tokenBalance,
            uberHausMembership,
            activeMembershipProposal,
          });
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    if (daoOverview) {
      setLoading(true);
      setup();
    }
  }, [daoOverview, uberMembers, uberProposals, daoProposals]);

  const handleStakeClick = () => {
    setD2dProposalModal((prevState) => !prevState);
    setProposalType('d2dStake');
  };

  const userNetworkMismatchOrNotMember =
    injectedChain?.chain_id !== daochain || !isMember;

  const daoNotOnUberNetwork = daochain !== UBERHAUS_NETWORK;

  const hasMinionNotMember =
    uberHausMinion && !uberHausMinion.uberHausMembership;

  const uberAlly = daoMetaData?.allies.find(
    (ally) => ally.allyType === 'uberHausBurner' && ally.isParent,
  );

  const uberParent = daoMetaData?.allies.find(
    (ally) => ally.allyType === 'uberHausBurner' && !ally.isParent,
  );

  console.log('uberHausMinion', uberHausMinion);

  return (
    <>
      <TextBox size='xs' mb={2}>
        DAO On DAO Memberships
      </TextBox>
      <ContentBox w='40%' position='relative'>
        <Flex align='center'>
          <Image src={DAOHaus} w='50px' h='50px' mr={4} />
          <Box fontFamily='heading' fontSize='xl' fontWeight={900}>
            UberHAUS
          </Box>
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
                        name: `Manange membership in the ${UBERHAUS_NETWORK_NAME} burner dao`,
                        link: `/dao/${
                          chainByName(uberAlly.allyNetwork).chain_id
                        }/${uberAlly.ally}/allies`,
                      }}
                    />
                  </Box>
                ) : (
                  <>
                    {!userNetworkMismatchOrNotMember ? (
                      <Box fontSize='md' my={2}>
                        Are you a member of this DAO and on the correct network?
                      </Box>
                    ) : (
                      <>
                        <Box fontSize='md' my={2}>
                          UberHAUS is on the {UBERHAUS_NETWORK_NAME} network.
                          You&apos;ll need to summon a clone of your DAO there
                          to join.
                          <Box my={2}>
                            <Link
                              href='https://discord.gg/eJsBk3sf'
                              target='_blank'
                              rel='noreferrer noopener'
                              color='secondary.500'
                              my={3}
                            >
                              Get help in our Discord.
                            </Link>
                          </Box>
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
                      {UBERHAUS_STAKING_TOKEN_SYMBOL} into the UberHAUS DAO.
                    </Box>

                    <>
                      {+uberHausMinion.balance <= 0 ? (
                        <>
                          <Box fontSize='md' my={2}>
                            Before you can make a proposal you&apos;ll need to
                            send {UBERHAUS_STAKING_TOKEN_SYMBOL} to your
                            minion&apos;s address
                          </Box>
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
                          <Box fontSize='md' my={2}>
                            Or create a funding proposal from the dao to the
                            minion address.
                          </Box>
                        </>
                      ) : (
                        <Button w='75%' onClick={handleStakeClick}>
                          Make Staking Proposal
                        </Button>
                      )}
                    </>
                  </>
                ) : null}

                {uberHausMinion?.activeMembershipProposal ? (
                  <Box mt={10}>
                    <DaoToDaoProposalCard
                      proposal={uberHausMinion.activeMembershipProposal}
                    />
                  </Box>
                ) : null}

                {uberParent ? (
                  <Box mt={10} borderTop='1px' py={5}>
                    <DaoToDaoUberAlly
                      dao={{
                        bodyText: `Your UberHAUS membership is managed here in this ${UBERHAUS_NETWORK_NAME} clone DAO`,
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
      </ContentBox>
    </>
  );
};

export default DaoToDaoManager;
