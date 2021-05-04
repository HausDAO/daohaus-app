import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Flex, Link, Button, Spinner, Text } from '@chakra-ui/react';
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
import { getEligibility, getDateTime } from '../utils/metadata';
import { timeToNow } from '../utils/general';
import GenericModal from '../modals/genericModal';
import { useOverlay } from '../contexts/OverlayContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import CcoLootGrabForm from '../forms/ccoLootGrab';
import CcoClaim from '../forms/ccoClaim';
import { useTX } from '../contexts/TXContext';
// import ComingSoonOverlay from '../components/comingSoonOverlay';
import { MM_ADDCHAIN_DATA } from '../utils/chain';
import { useDaoMember } from '../contexts/DaoMemberContext';
import CcoCard from '../components/ccoCard';

const CcoContribution = React.memo(
  ({ daoMetaData, currentDaoTokens, daoProposals }) => {
    const { setGenericModal } = useOverlay();
    const { daochain, daoid } = useParams();
    const { daoMember } = useDaoMember();
    const { refreshDao } = useTX();
    const { address, injectedChain, requestWallet } = useInjectedProvider();

    const [roundData, setRoundData] = useState(null);
    const [isEligible, setIsEligible] = useState('unchecked');
    const [checkingEligibility, setCheckingEligibility] = useState(false);
    const [currentContributionData, setCurrentContributionData] = useState(
      null,
    );
    const [claimComplete, setClaimComplete] = useState(false);

    useEffect(() => {
      const interval = setInterval(() => {
        refreshDao();
      }, 10000);
      return () => clearInterval(interval);
    }, []);

    // reset eligibility status on account change
    useEffect(() => {
      setIsEligible('unchecked');
    }, [address]);

    // format config data for ui states
    useEffect(() => {
      const setup = async ccoType => {
        const ccoToken = currentDaoTokens.find(
          token =>
            token.tokenAddress.toLowerCase() ===
            daoMetaData.boosts[ccoType].metadata.tributeToken.toLowerCase(),
        );

        const date = await getDateTime();
        const now = +date.seconds;
        const configData = daoMetaData.boosts[ccoType].metadata;

        setRoundData({
          ccoType,
          now,
          ccoToken,
          endTime: `${Number(configData.raiseStartTime) +
            Number(configData.duration)}`,
          beforeRaise:
            Number(daoMetaData.boosts[ccoType].metadata.raiseStartTime) > now,
          raiseOpen:
            Number(configData.raiseStartTime) < now &&
            Number(`${+configData.raiseStartTime + +configData.duration}`) >
              now,
          raiseOver:
            `${Number(configData.startTime) + Number(configData.duration)}` <
            now,
          claimPeriodStartTime:
            daoMetaData.boosts[ccoType].metadata.claimPeriodStartTime,
          claimOpen:
            Number(daoMetaData.boosts[ccoType].metadata.claimPeriodStartTime) <
            now,
        });
      };

      const someTokens = currentDaoTokens && currentDaoTokens[0];
      const ccoType = daoMetaData?.daosquarecco ? 'daosquarecco' : 'cco';
      if (someTokens && daoMetaData && daoMetaData.boosts[ccoType]) {
        setup(ccoType);
      }
    }, [currentDaoTokens, daoMetaData]);

    useEffect(() => {
      if (roundData && address && daoProposals && daoProposals.length) {
        const contributionProposals = daoProposals.filter(proposal => {
          // TODO: right now this is checking on sponsored, will need to adjust
          // to look at unsponsored and stop at max limit
          return isCcoProposal(proposal, roundData);
        });

        const addressProposals = contributionProposals.filter(proposal => {
          return isCcoProposalForAddress(proposal, address, roundData);
        });

        const contributionTotal = contributionTotalValue(
          contributionProposals,
          roundData,
        );
        const addressTotal = contributionTotalValue(
          addressProposals,
          roundData,
        );

        setCurrentContributionData({
          contributionProposals,
          addressProposals,
          contributionTotal,
          addressTotal,
          statusPercentage: (contributionTotal / +roundData.maxTarget) * 100,
          remaining: +roundData.maxTarget - contributionTotal,
          addressRemaining: +roundData.maxContribution - addressTotal,
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
    const hasBalance =
      daoMember &&
      roundData &&
      daoMember.tokenBalances.find(bal => {
        const isRaiseToken =
          bal.token.tokenAddress.toLowerCase() ===
          roundData.ccoToken.tokenAddress.toLowerCase();
        return isRaiseToken && +bal.token.balance > 0;
      });
    const claimAmount = (
      +daoMember?.loot / roundData?.claimTokenValue || 0
    ).toFixed(2);

    if (!roundData) {
      return (
        <MainViewLayout header={daoMetaData?.name} isDao>
          <Box w='100%' position='relative'>
            <Flex wrap='wrap'>
              <Box>DAO does not have an active CCO</Box>
            </Flex>
          </Box>
        </MainViewLayout>
      );
    }

    if (roundData && roundData.active) {
      return (
        <MainViewLayout
          header={daoMetaData?.name}
          isDao
          isDaosquare={daoMetaData.daosquarecco}
        >
          <Box w='100%' position='relative'>
            <Flex wrap='wrap'>
              <Box>CCO is paused</Box>
            </Flex>
          </Box>
        </MainViewLayout>
      );
    }

    return (
      <MainViewLayout
        header={daoMetaData?.name}
        isDao
        isDaosquare={daoMetaData.daosquarecco}
      >
        <Box w='100%' position='relative'>
          <Flex wrap='wrap'>
            <Box
              w={['100%', null, null, null, '60%']}
              pr={[0, null, null, null, 6]}
              mb={6}
            >
              <CcoCard daoMetaData={daoMetaData} />

              <ContentBox variant='d2' mt={2} w='100%'>
                <TextBox size='sm' color='blackAlpha.900' mb={7}>
                  1. Check eligibility
                </TextBox>
                {networkMatch() ? (
                  <>
                    {isEligible === 'unchecked' ? (
                      <Button
                        onClick={checkEligibility}
                        disabled={
                          checkingEligibility ||
                          roundData.raiseOver ||
                          raiseAtMax
                        }
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
                        <Box size='md' my={2} color='blackAlpha.900'>
                          You&apos;re eligible. Kudos for interacting with DAOs!
                        </Box>

                        {roundData.beforeRaise ? (
                          <Box size='md' my={2} color='blackAlpha.900'>
                            Come back when the contribution round begins.
                          </Box>
                        ) : null}
                      </>
                    ) : null}
                    {isEligible === 'denied' ? (
                      <Box size='md' my={2} color='blackAlpha.900'>
                        Address is not eligible. Try again with another address
                        that has interacted with a DAO.
                      </Box>
                    ) : null}
                  </>
                ) : (
                  <>
                    {address ? (
                      <Button onClick={handleSwitchNetwork}>
                        {`Switch to the ${roundData.network} network`}
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
                  <ContentBox variant='d2' mt={2} w='100%'>
                    <Flex direction='column'>
                      <TextBox size='sm' color='blackAlpha.900' mb={7}>
                        2. Contribute
                      </TextBox>
                      {!raiseAtMax ? (
                        <Text fontSize='sm' color='blackAlpha.700' as='i'>
                          {countDownText(
                            roundData.currentRound,
                            roundData.raiseOver,
                          )}
                        </Text>
                      ) : null}
                      <Text fontSize='sm' color='blackAlpha.700' mt={2}>
                        {`${roundData.claimTokenValue} ${roundData.ccoToken.symbol} = 1 ${roundData.claimTokenSymbol} | ${roundData.currentRound.maxContribution} ${roundData.ccoToken.symbol} max per person`}
                      </Text>
                    </Flex>
                    {raiseAtMax ? (
                      <Box size='md' my={2} color='blackAlpha.900'>
                        Max target reached. Contributions are closed.
                      </Box>
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
                              prop => {
                                return (
                                  <Flex
                                    justifyContent='space-between'
                                    alignContent='center'
                                    key={prop.id}
                                    mt={5}
                                  >
                                    <Text
                                      fontSize='sm'
                                      color='blackAlpha.700'
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

                  <ContentBox variant='d2' mt={2} w='100%'>
                    <Flex
                      justifyContent='space-between'
                      alignItems='center'
                      mt={5}
                    >
                      <TextBox size='sm' color='blackAlpha.900'>
                        3. Claim
                      </TextBox>
                      <Text fontSize='sm' color='blackAlpha.700' as='i'>
                        {claimCountDownText(roundData.claimPeriodStartTime)}
                      </Text>
                    </Flex>
                    <Flex
                      justifyContent='space-between'
                      alignItems='center'
                      mt={5}
                    >
                      <Box>
                        <Text fontSize='sm' color='blackAlpha.700' as='i'>
                          HAUS Available to Claim
                        </Text>
                        <TextBox variant='value' size='md' my={2}>
                          {`${claimAmount} ${roundData.claimTokenSymbol}`}
                        </TextBox>
                      </Box>
                      {!roundData.claimOpen ? (
                        <CcoClaim setClaimComplete={setClaimComplete} />
                      ) : null}
                    </Flex>
                    {claimComplete || hasBalance ? (
                      <Box mt={5} fontSize='lg'>
                        {`Your claim is complete. Withdraw your
                          ${roundData.claimTokenSymbol} on the `}
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
            <Box w={['100%', null, null, null, '40%']}>
              <ContentBox variant='d2' mt={2} w='100%'>
                <Box
                  fontSize='xl'
                  fontWeight={700}
                  fontFamily='heading'
                  mb={7}
                  color='blackAlpha.900'
                >
                  Resources
                </Box>
                <TextBox
                  fontSize='sm'
                  color='secondary.500'
                  onClick={() => setGenericModal({ ccoProcess: true })}
                  mb={5}
                  cursor='pointer'
                >
                  CCO Overview
                </TextBox>
                <TextBox
                  fontSize='sm'
                  color='secondary.500'
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
                  <TextBox fontSize='sm' color='secondary.500'>
                    More About DAOhaus
                  </TextBox>
                </Link>

                <Link
                  href='https://daohaus.club/docs/cco'
                  isExternal
                  display='flex'
                  alignItems='center'
                  mb={5}
                >
                  <TextBox fontSize='sm' color='secondary.500'>
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
                  DAO&apos;, Ethereum&apos;s first major attempt at a DAO. There
                  are ~122k addresses that have ‘proven’ eligible for HAUS
                  distribution, all of the below actions demonstrate a
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
                <Text>Contributions are open until max target is reached.</Text>
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
                  IF max target is not reached by the end of Round 1, then Round
                  2 begins.
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
                  IF min target is not reached after Round 2, contributors will
                  be able to withdraw their original wxDAI contributions.
                </Text>
              </Box>
            </GenericModal>
            <GenericModal modalId='xDaiHelp'>
              <TextBox>xDAI Quick Start</TextBox>
              <TextBox size='sm' my={5} onClick={handleSwitchNetwork}>
                Add xDAI network to Metamask
              </TextBox>
              <TextBox size='xs' mb={5}>
                Magic
              </TextBox>
              <Button variant='outline'>Add xDAI to Metamask</Button>
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
                1. Swap to DAI on a DEX.
                <Link
                  color='secondary.500'
                  isExternal
                  href='https://uniswap.exchange'
                >
                  Go to Uniswap
                </Link>
              </Text>
              <Text mb={3}>
                2. On Mainnet: Use the Bridge to send the DAI to yourself on the
                xDAI network
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
                4. Still on xDAI, wrap the xDAI into wxDAI at
                <Link
                  color='secondary.500'
                  isExternal
                  href='https://wrapeth.com'
                >
                  Wrapeth
                </Link>
              </Text>
            </GenericModal>
          </Flex>
        </Box>
      </MainViewLayout>
    );
  },
);

export default CcoContribution;
