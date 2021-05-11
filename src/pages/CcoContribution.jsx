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
import { daosqaureCcoDaoResolver } from '../utils/resolvers';

// TODO: filter out proposals after max limit is hit

const CcoContribution = ({ daoMetaData, currentDaoTokens, daoProposals }) => {
  const { daochain } = useParams();
  const { refreshDao } = useTX();
  const { address, injectedChain } = useInjectedProvider();

  const [roundData, setRoundData] = useState(null);
  const [daoCardData, setDaoCardData] = useState(null);
  const [isEligible, setIsEligible] = useState('unchecked');
  const [currentContributionData, setCurrentContributionData] = useState(null);
  const [claimComplete, setClaimComplete] = useState(false);

  const networkMatch = injectedChain?.network === roundData?.network;

  // TODO: make this work
  // const dao = daosqaureCcoDaoResolver({meta: daoMetaData, });

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
        claimOpen: Number(configData.claimPeriodStartTime) < now,
      });

      setDaoCardData(
        daosqaureCcoDaoResolver({
          meta: daoMetaData,
          proposals: daoProposals,
        }),
      );
    };

    const someTokens = currentDaoTokens && currentDaoTokens[0];
    const ccoType = daoMetaData?.daosquarecco ? 'daosquarecco' : 'cco';
    if (
      someTokens &&
      daoMetaData?.boosts &&
      daoMetaData.boosts[ccoType] &&
      daoProposals
    ) {
      setup(ccoType);
    }
  }, [currentDaoTokens, daoMetaData, daoProposals]);

  useEffect(() => {
    if (roundData && address && daoProposals && daoProposals.length) {
      const contributionProposals = daoProposals.filter(proposal => {
        return isCcoProposal(proposal, roundData, true);
      });
      const addressProposals = contributionProposals.filter(proposal => {
        return isCcoProposalForAddress(proposal, address, roundData);
      });
      const { contributionTotal, overTime } = contributionTotalValue({
        proposals: contributionProposals,
        round: roundData,
        allProposals: true,
      });

      console.log('contributionTotal', contributionTotal, overTime);
      // how do we stop this if over limit?
      // one prop in on time, one not
      // need a last prop created at...

      // get total of all, if over limit, filter
      const addressTotal = contributionTotalValue({
        proposals: addressProposals,
        round: roundData,
        overTime,
      });
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
            {daoCardData && (
              <CcoCard daoMetaData={daoMetaData} dao={daoCardData} />
            )}

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
