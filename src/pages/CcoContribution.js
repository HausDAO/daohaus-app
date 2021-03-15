import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Box,
  Flex,
  Link,
  Progress,
  Button,
  Spinner,
  Text,
} from '@chakra-ui/react';
import MainViewLayout from '../components/mainViewLayout';
import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
import {
  countDownText,
  isCcoProposalForAddress,
  isCcoProposal,
  contributionTotalValue,
  claimCountDownText,
} from '../utils/cco';
import { getEligibility } from '../utils/metadata';
import { numberWithCommas, timeToNow } from '../utils/general';
import GenericModal from '../modals/genericModal';
import { useOverlay } from '../contexts/OverlayContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import CcoLootGrabForm from '../forms/ccoLootGrab';
import CcoClaim from '../forms/ccoClaim';
import { useTX } from '../contexts/TXContext';
import ComingSoonOverlay from '../components/comingSoonOverlay';
import { MM_ADDCHAIN_DATA } from '../utils/chain';

const CcoContribution = React.memo(function ccocontribution({
  daoMetaData,
  currentDaoTokens,
  daoProposals,
}) {
  const { setGenericModal } = useOverlay();
  const { daochain, daoid } = useParams();
  const { address, injectedChain, requestWallet } = useInjectedProvider();
  const [roundData, setRoundData] = useState(null);
  const [isEligible, setIsEligible] = useState('unchecked');
  const [checkingEligibility, setCheckingEligibility] = useState(false);
  const [currentContributionData, setCurrentContributionData] = useState(null);
  const [claimComplete, setClaimComplete] = useState(false);
  const { refreshDao } = useTX();

  useEffect(() => {
    const interval = setInterval(() => {
      refreshDao();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsEligible('unchecked');
  }, [address]);

  useEffect(() => {
    if (currentDaoTokens && daoMetaData?.boosts?.cco) {
      // if (currentDaoTokens && daoMetaData?.boosts?.cco?.active) {

      const ccoToken = currentDaoTokens.find(
        (token) =>
          token.tokenAddress.toLowerCase() ===
          daoMetaData.boosts.cco.metadata.tributeToken.toLowerCase(),
      );

      const now = new Date() / 1000;
      let round;
      if (now < daoMetaData.boosts.cco.metadata.raiseStartTime) {
        round = daoMetaData.boosts.cco.metadata.rounds[0];
      } else {
        round = daoMetaData.boosts.cco.metadata.rounds.find((round, i) => {
          const inRound =
            +round.startTime < now &&
            +`${+round.startTime + +round.duration}` > now;
          return (
            i === daoMetaData.boosts.cco.metadata.rounds.length - 1 || inRound
          );
        });
      }

      const currentRound = {
        ...round,
        endTime: `${+round.startTime + +round.duration}`,
        roundOpen:
          +round.startTime < now &&
          +`${+round.startTime + +round.duration}` > now,
        roundOver: +`${+round.startTime + +round.duration}` < now,
      };

      setRoundData({
        ccoToken,
        currentRound,
        network: daoMetaData.boosts.cco.metadata.network,
        claimTokenValue: daoMetaData.boosts.cco.metadata.claimTokenValue,
        claimTokenSymbol: daoMetaData.boosts.cco.metadata.claimTokenSymbol,
        raiseStartTime: daoMetaData.boosts.cco.metadata.raiseStartTime,
        beforeRaise: +daoMetaData.boosts.cco.metadata.raiseStartTime > now,
        raiseOver: +`${+round.startTime + +round.duration}` < now,
        claimPeriodStartTime:
          daoMetaData.boosts.cco.metadata.claimPeriodStartTime,
        claimOpen: +daoMetaData.boosts.cco.metadata.claimPeriodStartTime < now,
      });
    }
  }, [currentDaoTokens, daoMetaData]);

  useEffect(() => {
    if (roundData && address && daoProposals && daoProposals.length) {
      const contributionProposals = daoProposals.filter((proposal) => {
        return isCcoProposal(proposal, roundData);
      });
      const addressProposals = contributionProposals.filter((proposal) => {
        return isCcoProposalForAddress(proposal, address, roundData);
      });

      const contributionTotal = contributionTotalValue(
        contributionProposals,
        roundData,
      );
      const addressTotal = contributionTotalValue(addressProposals, roundData);

      setCurrentContributionData({
        contributionProposals,
        addressProposals,
        contributionTotal,
        addressTotal,
        statusPercentage:
          (contributionTotal / +roundData.currentRound.maxTarget) * 100,
        remaining: +roundData.currentRound.maxTarget - contributionTotal,
        addressRemaining:
          +roundData.currentRound.maxContribution - addressTotal,
      });

      if (isEligible === 'unchecked') {
        setIsEligible(addressTotal > 0 ? 'checked' : 'unchecked');
      }
    }
  }, [address, roundData, daoProposals]);

  const handleSwitchNetwork = async () => {
    if (daochain && window?.ethereum) {
      try {
        await window?.ethereum?.request({
          id: '1',
          jsonrpc: '2.0',
          method: 'wallet_addEthereumChain',
          params: [MM_ADDCHAIN_DATA[daochain]],
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const checkEligibility = async () => {
    setCheckingEligibility(true);
    const eligibleRes = await getEligibility(address);
    setIsEligible(eligibleRes ? 'checked' : 'denied');
    setCheckingEligibility(false);
  };

  const networkMatch = () => {
    return injectedChain?.network === roundData.network;
  };

  const eligibleBlock = isEligible === 'denied' || isEligible === 'unchecked';
  const raiseAtMax = currentContributionData?.remaining <= 0;
  const contributionClosed =
    roundData?.raiseOver ||
    currentContributionData?.addressRemaining <= 0 ||
    raiseAtMax;
  const now = new Date() / 1000;
  const beforeClaimPeriod = roundData?.claimPeriodStartTime > now;

  return (
    <MainViewLayout header='DAOhaus CCO' isDao={true}>
      <Box w='100%' position='relative'>
        <Flex wrap='wrap'>
          {roundData ? (
            <>
              <Box
                w={['100%', null, null, null, '50%']}
                pr={[0, null, null, null, 6]}
                mb={6}
              >
                <ContentBox mt={2} w='100%'>
                  <TextBox size='sm' color='whiteAlpha.900' mb={7}>
                    1. Check eligibility
                  </TextBox>
                  {networkMatch() ? (
                    <>
                      {isEligible === 'unchecked' ? (
                        <Button
                          onClick={checkEligibility}
                          disabled={checkingEligibility || roundData.raiseOver}
                        >
                          {!checkingEligibility ? (
                            <>Check Eligibility</>
                          ) : (
                            <Spinner />
                          )}
                        </Button>
                      ) : null}
                      {isEligible === 'checked' ? (
                        <>
                          <TextBox variant='value' size='md' my={2}>
                            You&apos;re eligible. Kudos for interacting with
                            DAOs!
                          </TextBox>

                          {roundData.beforeRaise ? (
                            <TextBox variant='value' size='md' my={2}>
                              Come back when the contribution round begins.
                            </TextBox>
                          ) : null}
                        </>
                      ) : null}
                      {isEligible === 'denied' ? (
                        <TextBox variant='value' size='md' my={2}>
                          Address is not eligible. Try again with another
                          address that has interacted with a DAO.
                        </TextBox>
                      ) : null}
                    </>
                  ) : (
                    <>
                      {address ? (
                        <Button onClick={handleSwitchNetwork}>
                          Switch to the {roundData.network} network
                        </Button>
                      ) : (
                        <Button onClick={requestWallet} mb={6}>
                          Connect Wallet
                        </Button>
                      )}
                    </>
                  )}
                </ContentBox>

                {networkMatch() ? (
                  <>
                    <ContentBox mt={2} w='100%'>
                      <Flex direction='column'>
                        <TextBox size='sm' color='whiteAlpha.900' mb={7}>
                          2. Contribute
                        </TextBox>
                        <Text fontSize='sm' color='whiteAlpha.700' as='i'>
                          {countDownText(
                            roundData.currentRound,
                            roundData.raiseOver,
                          )}
                        </Text>
                        <Text fontSize='sm' color='whiteAlpha.700' mt={2}>
                          {`${roundData.claimTokenValue} ${roundData.ccoToken.symbol} = 1 ${roundData.claimTokenSymbol} | ${roundData.currentRound.maxContribution} ${roundData.ccoToken.symbol} max per person`}
                        </Text>
                      </Flex>
                      {raiseAtMax ? (
                        <TextBox variant='value' size='md' my={2}>
                          Max target reached and there is no room left.
                        </TextBox>
                      ) : null}

                      {!eligibleBlock && !roundData.beforeRaise ? (
                        <Box borderTopWidth='1px' mt={3}>
                          <CcoLootGrabForm
                            daoMetaData={daoMetaData}
                            roundData={roundData}
                            currentContributionData={currentContributionData}
                            contributionClosed={contributionClosed}
                          />

                          {currentContributionData ? (
                            <Box borderTopWidth='1px' mt={5}>
                              {currentContributionData.addressProposals.map(
                                (prop) => {
                                  return (
                                    <Flex
                                      justifyContent='space-between'
                                      alignContent='center'
                                      key={prop.id}
                                      mt={5}
                                    >
                                      <Text
                                        fontSize='sm'
                                        color='whiteAlpha.700'
                                        as='i'
                                      >
                                        {`You contributed ${prop.tributeOffered /
                                          10 ** roundData.ccoToken.decimals} ${
                                          roundData.ccoToken.symbol
                                        } ${timeToNow(prop.createdAt)}`}
                                      </Text>
                                      <RouterLink
                                        to={`/dao/${daochain}/${daoid}/proposals/${prop.proposalId}`}
                                      >
                                        View contribution
                                      </RouterLink>
                                    </Flex>
                                  );
                                },
                              )}
                            </Box>
                          ) : null}
                        </Box>
                      ) : null}
                    </ContentBox>

                    <ContentBox mt={2} w='100%'>
                      <Flex
                        justifyContent='space-between'
                        alignItems='center'
                        mt={5}
                      >
                        <TextBox size='sm' color='whiteAlpha.900'>
                          3. Claim
                        </TextBox>
                        <Text fontSize='sm' color='whiteAlpha.700' as='i'>
                          {claimCountDownText(roundData.claimPeriodStartTime)}
                        </Text>
                      </Flex>
                      <Flex
                        justifyContent='space-between'
                        alignItems='center'
                        mt={5}
                      >
                        <Box>
                          <Text fontSize='sm' color='whiteAlpha.700' as='i'>
                            HAUS Available to Claim
                          </Text>
                          <TextBox variant='value' size='md' my={2}>
                            {`${currentContributionData?.addressTotal /
                              roundData.claimTokenValue || 0} ${
                              roundData.claimTokenSymbol
                            }`}
                          </TextBox>
                        </Box>
                        {!beforeClaimPeriod ? (
                          <CcoClaim setClaimComplete={setClaimComplete} />
                        ) : null}
                      </Flex>
                      {claimComplete ? (
                        <Box mt={5} fontSize='lg'>
                          Your claim is complete. Withdraw your{' '}
                          {roundData.claimTokenSymbol} on the{' '}
                          <Text
                            as={RouterLink}
                            color='secondary.500'
                            to={`/dao/${daochain}/${daoid}/profile/${address}`}
                          >
                            Profile page
                          </Text>
                        </Box>
                      ) : null}
                    </ContentBox>
                  </>
                ) : null}
              </Box>
              <Box w={['100%', null, null, null, '50%']}>
                <ContentBox mt={2} w='100%'>
                  <Box
                    fontSize='xl'
                    fontWeight={700}
                    fontFamily='heading'
                    mb={7}
                  >
                    Status
                  </Box>
                  <Progress
                    colorScheme='secondary'
                    height='24px'
                    value={
                      currentContributionData
                        ? currentContributionData.statusPercentage
                        : 0
                    }
                    mb={7}
                  />
                  <Flex direction='row' justifyContent='space-between'>
                    <Box>
                      <TextBox size='sm' color='whiteAlpha.900'>
                        Min target
                      </TextBox>
                      <TextBox variant='value' size='xl' my={2}>
                        {`${numberWithCommas(
                          roundData.currentRound.minTarget,
                        )} ${roundData.ccoToken.symbol}`}
                      </TextBox>
                    </Box>
                    <Box>
                      <TextBox size='sm' color='whiteAlpha.900'>
                        Max target
                      </TextBox>
                      <TextBox variant='value' size='xl' my={2}>
                        {`${numberWithCommas(
                          roundData.currentRound.maxTarget,
                        )} ${roundData.ccoToken.symbol}`}
                      </TextBox>
                    </Box>
                  </Flex>
                  <Flex direction='row' justifyContent='space-between' mb={5}>
                    <Box>
                      <TextBox size='sm' color='whiteAlpha.900'>
                        Contributed
                      </TextBox>
                      <TextBox variant='value' size='xl' my={2}>
                        {`${numberWithCommas(
                          currentContributionData
                            ? currentContributionData.contributionTotal
                            : 0,
                        )} ${roundData.ccoToken.symbol}`}
                      </TextBox>
                    </Box>
                    <Box>
                      <TextBox size='sm' color='whiteAlpha.900'>
                        Room Left
                      </TextBox>
                      <TextBox variant='value' size='xl' my={2}>
                        {`${numberWithCommas(
                          currentContributionData
                            ? currentContributionData.remaining
                            : 0,
                        )} ${roundData.ccoToken.symbol}`}
                      </TextBox>
                    </Box>
                  </Flex>
                  <TextBox size='sm' color='whiteAlpha.900'>
                    {countDownText(roundData.currentRound, roundData.raiseOver)}
                  </TextBox>
                </ContentBox>
                <ContentBox mt={2} w='100%'>
                  <Box
                    fontSize='xl'
                    fontWeight={700}
                    fontFamily='heading'
                    mb={7}
                  >
                    Resources
                  </Box>
                  <TextBox
                    fontSize='sm'
                    colorScheme='secondary.500'
                    onClick={() => setGenericModal({ ccoProcess: true })}
                    mb={5}
                    cursor='pointer'
                  >
                    CCO Overview
                  </TextBox>
                  <TextBox
                    fontSize='sm'
                    colorScheme='secondary.500'
                    onClick={() => setGenericModal({ xDaiHelp: true })}
                    mb={5}
                    cursor='pointer'
                  >
                    How to get wxDAI
                  </TextBox>

                  <Link
                    href='https://daohaus.club/ '
                    isExternal
                    display='flex'
                    alignItems='center'
                    mb={5}
                  >
                    <TextBox fontSize='sm' colorScheme='secondary.500'>
                      More About DAOhaus
                    </TextBox>
                  </Link>

                  <Link
                    href='https://docs.daohaus.club/cco '
                    isExternal
                    display='flex'
                    alignItems='center'
                    mb={5}
                  >
                    <TextBox fontSize='sm' colorScheme='secondary.500'>
                      More About CCOs
                    </TextBox>
                  </Link>
                </ContentBox>
              </Box>
              <GenericModal modalId='ccoProcess'>
                <Box>
                  <Text mb={3} fontFamily='heading'>
                    Overview of this CCO
                  </Text>
                  <TextBox>1. Check Eligibility</TextBox>
                  <Text mb={5}>
                    We have scraped a ton of dao contracts, including &apos;The
                    DAO&apos;, Ethereum&apos;s first major attempt at a DAO.
                    There are ~44k addresses that have ‘proven’ eligible for
                    HAUS distribution, all of the below actions demonstrate a
                    willingness to govern within the Ethereum ecosystem and
                    therefore are included:
                    <ul>
                      <li>
                        All addresses that have ever sent or received TheDAO
                        tokens
                      </li>
                      <li>All members of Snapshot Spaces</li>
                      <li>
                        All vote creators and voters from Aragon Voting module
                      </li>
                      <li>
                        All addresses with VoteCast or DelegateChanged from
                        Compound
                      </li>
                      <li>
                        All stakers scraped from the Yearn Staked Event Emitted
                      </li>
                      <li>
                        All addresses with VoteCast or DelegateChanged from
                        Uniswap
                      </li>
                      <li>
                        All addresses that were in the ‘to or from’ fields from
                        DXDAO
                      </li>
                      <li>All addresses with VoteEmitted events from Aave</li>
                      <li>All Moloch DAO users</li>
                    </ul>
                  </Text>
                  <TextBox>2. Contribute</TextBox>
                  <Text>
                    Contributions are open until max target is reached.
                  </Text>
                  <TextBox variant='value' mb={3}>
                    1 HAUS = 8.88 wxDAI
                  </TextBox>
                  <TextBox size='xs'>Round 1</TextBox>
                  <Text mb={5}>
                    Starts at 8am EST March 15th
                    <br />
                    Runs for 4 Days or until max target is reached
                    <br />
                    Ends 8am EST March 19th
                    <br />
                    min contribution per person: 50 wxDAI
                    <br />
                    max contribution per person: 5,000 wxDAI
                    <br />
                    min target: 500,000 wxDAI
                    <br />
                    max target: 1,111,110 wxDAI
                  </Text>
                  <TextBox size='xs'>Round 2 (IF needed)</TextBox>
                  <Text mb={5}>
                    IF max target is not reached by the end of Round 1, then
                    Round 2 begins.
                    <br />
                    Max contribution per person is raised to 50,000 wxDAI
                    <br />
                    Starts 8am EST March 19th
                    <br />
                    Runs for 3 Days or until max target is reached.
                  </Text>
                  <TextBox>3. Claim</TextBox>
                  <Text>
                    Claiming opens Tuesday, Mar 23 at 12pm EST
                    <br />
                    IF min target is reached, contributors will be able to claim
                    their proportionate HAUS tokens.
                    <br />
                    IF min target is not reached after Round 2, contributors
                    will be able to withdraw their original wxDAI contributions.
                  </Text>
                </Box>
              </GenericModal>
              <GenericModal modalId='xDaiHelp'>
                <TextBox>xDAI Quick Start</TextBox>
                <TextBox size='sm' my={5} onClick={handleSwitchNetwork}>
                  Add xDAI network to Metamask
                </TextBox>
                {/* <TextBox size='xs' mb={5}>
                  Magic
                </TextBox>
                <Button variant='outline'>Add xDAI to Metamask</Button> */}
                <TextBox size='xs' my={5}>
                  Manual
                </TextBox>
                <Text fontFamily='mono'>
                  Network Name: xDai
                  <br />
                  New RPC URL: https://rpc.xdaichain.com/
                  <br />
                  Chain ID: 0x64 (100)
                  <br />
                  Symbol: xDai
                  <br />
                  Block Explorer URL: https://blockscout.com/xdai/mainnet
                </Text>
                <TextBox size='sm' my={5}>
                  Get some wxDAI
                </TextBox>
                <Text mb={3}>
                  1. Swap to DAI on a DEX.{' '}
                  <Link
                    color='secondary.500'
                    isExternal
                    href='https://uniswap.exchange'
                  >
                    Go to Uniswap
                  </Link>
                </Text>
                <Text mb={3}>
                  2. On Mainnet: Use the Bridge to send the DAI to yourself on
                  the xDAI network{' '}
                  <Link
                    isExternal
                    color='secondary.500'
                    href='http://bridge.xdaichain.com/'
                  >
                    Go to Bridge
                  </Link>
                </Text>
                <Text mb={3}>
                  3. Switch to xDAI network in Metamask, and you should see your
                  xDAI balance.
                </Text>
                <Text>
                  4. Still on xDAI, wrap the xDAI into wxDAI at{' '}
                  <Link
                    color='secondary.500'
                    isExternal
                    href='https://wrapeth.com'
                  >
                    Wrapeth
                  </Link>
                </Text>
              </GenericModal>
            </>
          ) : (
            <>
              <Box>DAO does not have an active CCO</Box>
              {daoMetaData?.boosts?.cco && !daoMetaData.boosts.cco.active ? (
                <Box mt={500}>
                  <ComingSoonOverlay
                    message='Contribution period is complete. The max contribution target was hit.'
                    fontSize='3xl'
                  />
                </Box>
              ) : null}
            </>
          )}
        </Flex>
      </Box>
    </MainViewLayout>
  );
});

export default CcoContribution;
