import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import MainViewLayout from '../components/mainViewLayout';
import {
  isCcoProposalForAddress,
  isCcoProposal,
  contributionTotalValue,
} from '../utils/cco';
import { getDateTime } from '../utils/metadata';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useTX } from '../contexts/TXContext';
import { MM_ADDCHAIN_DATA } from '../utils/chain';
import CcoCard from '../components/ccoCard';
import CcoEligibility from '../components/ccoElibility';
import CcoResources from '../components/ccoResources';
import CcoContributionCard from '../components/ccoContributeCard';
import CcoClaimCard from '../components/ccoClaimCard';

const CcoContribution = ({ daoMetaData, currentDaoTokens, daoProposals }) => {
  const { daochain } = useParams();
  const { refreshDao } = useTX();
  const { address, injectedChain } = useInjectedProvider();

  const [roundData, setRoundData] = useState(null);
  const [isEligible, setIsEligible] = useState('unchecked');
  const [currentContributionData, setCurrentContributionData] = useState(null);
  const [claimComplete, setClaimComplete] = useState(false);

  const networkMatch = injectedChain?.network === roundData?.network;

  useEffect(() => {
    const interval = setInterval(() => {
      refreshDao();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsEligible('unchecked');
  }, [address]);

  useEffect(() => {
    const setup = async ccoType => {
      const ccoToken = currentDaoTokens.find(
        token =>
          token.tokenAddress.toLowerCase() ===
          daoMetaData.boosts[ccoType].metadata.tributeToken.toLowerCase(),
      );

      const date = await getDateTime();
      const now = Number(date.seconds);
      const configData = daoMetaData.boosts[ccoType].metadata;
      const duration =
        Number(configData.raiseEndTime) - Number(configData.raiseStartTime);

      setRoundData({
        ccoType,
        now,
        ccoToken,
        active: daoMetaData.boosts[ccoType].active,
        ...configData,
        beforeRaise:
          Number(daoMetaData.boosts[ccoType].metadata.raiseStartTime) > now,
        raiseOpen:
          Number(configData.raiseStartTime) < now &&
          Number(`${+configData.raiseStartTime + duration}`) > now,
        raiseOver: `${Number(configData.startTime) + duration}` < now,
        claimPeriodStartTime: configData.claimPeriodStartTime,
        claimOpen: Number(configData.claimPeriodStartTime) < now,
      });
    };

    const someTokens = currentDaoTokens && currentDaoTokens[0];
    const ccoType = daoMetaData?.daosquarecco ? 'daosquarecco' : 'cco';
    if (someTokens && daoMetaData?.boosts && daoMetaData.boosts[ccoType]) {
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
      const addressTotal = contributionTotalValue(addressProposals, roundData);
      const remaining = Number(roundData.maxTarget) - contributionTotal;

      setCurrentContributionData({
        contributionProposals,
        addressProposals,
        contributionTotal,
        addressTotal,
        remaining,
        statusPercentage:
          (contributionTotal / Number(roundData.maxTarget)) * 100,
        addressRemaining: Number(roundData.maxContribution) - addressTotal,
        raiseAtMax: remaining <= 0,
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
        isDao={!daoMetaData.daosquarecco}
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
              raiseAtMax={currentContributionData?.raiseAtMax}
              handleSwitchNetwork={handleSwitchNetwork}
              setIsEligible={setIsEligible}
            />

            {networkMatch && (
              <>
                <CcoContributionCard
                  raiseAtMax={currentContributionData?.raiseAtMax}
                  roundData={roundData}
                  daoMetaData={daoMetaData}
                  currentContributionData={currentContributionData}
                  isEligible={isEligible}
                />

                <CcoClaimCard
                  roundData={roundData}
                  setClaimComplete={setClaimComplete}
                  claimComplete={claimComplete}
                />
              </>
            )}
          </Box>
          <Box w={['100%', null, null, null, '40%']}>
            <CcoResources daoMetaData={daoMetaData} ccoData={roundData} />
          </Box>
        </Flex>
      </Box>
    </MainViewLayout>
  );
};

export default CcoContribution;
