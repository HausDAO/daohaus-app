import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Flex, Text } from '@chakra-ui/react';
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
import { getDateTime } from '../utils/metadata';
import { timeToNow } from '../utils/general';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import CcoLootGrabForm from '../forms/ccoLootGrab';
import CcoClaim from '../forms/ccoClaim';
import { useTX } from '../contexts/TXContext';
import { MM_ADDCHAIN_DATA } from '../utils/chain';
import { useDaoMember } from '../contexts/DaoMemberContext';
import CcoCard from '../components/ccoCard';
import CcoEligibility from '../components/ccoElibility';
import CcoResources from '../components/ccoResources';

const CcoContribution = React.memo(
  ({ daoMetaData, currentDaoTokens, daoProposals }) => {
    const { daochain, daoid } = useParams();
    const { daoMember } = useDaoMember();
    const { refreshDao } = useTX();
    const { address, injectedChain } = useInjectedProvider();

    const [roundData, setRoundData] = useState(null);
    const [isEligible, setIsEligible] = useState('unchecked');
    const [currentContributionData, setCurrentContributionData] = useState(
      null,
    );
    const [claimComplete, setClaimComplete] = useState(false);

    const networkMatch = injectedChain?.network === roundData?.network;
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
          active: daoMetaData.boosts[ccoType].active,
          ...configData,
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
          claimPeriodStartTime: configData.claimPeriodStartTime,
          claimOpen: Number(configData.claimPeriodStartTime) < now,
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

    if (!roundData) {
      return <MainViewLayout header={daoMetaData?.name} isDao />;
    }

    if (roundData && !roundData.active) {
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

              <CcoEligibility
                networkMatch={networkMatch}
                isEligible={isEligible}
                roundData={roundData}
                raiseAtMax={raiseAtMax}
                handleSwitchNetwork={handleSwitchNetwork}
                setIsEligible={setIsEligible}
              />

              {networkMatch && (
                <>
                  <ContentBox variant='d2' mt={2} w='100%'>
                    <Flex direction='column'>
                      <TextBox size='sm' color='blackAlpha.900' mb={7}>
                        2. Contribute
                      </TextBox>
                      {!raiseAtMax ? (
                        <Text fontSize='sm' color='blackAlpha.700' as='i'>
                          {countDownText(roundData)}
                        </Text>
                      ) : null}
                      <Text fontSize='sm' color='blackAlpha.700' mt={2}>
                        {`${roundData.claimTokenValue} ${roundData.ccoToken.symbol} = 1 ${roundData.claimTokenSymbol} | ${roundData.maxContribution} ${roundData.ccoToken.symbol} max per person`}
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
              )}
            </Box>
            <Box w={['100%', null, null, null, '40%']}>
              <CcoResources
                daoMetaData={daoMetaData}
                handleSwitchNetwork={handleSwitchNetwork}
              />
            </Box>
          </Flex>
        </Box>
      </MainViewLayout>
    );
  },
);

export default CcoContribution;
