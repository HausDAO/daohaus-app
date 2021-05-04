import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Flex, Text } from '@chakra-ui/layout';
import CcoLootGrabForm from '../forms/ccoLootGrab';
import { countDownText } from '../utils/cco';
import { timeToNow } from '../utils/general';
import ContentBox from './ContentBox';
import TextBox from './TextBox';

const CcoContributionCard = ({
  raiseAtMax,
  roundData,
  daoMetaData,
  currentContributionData,
  isEligible,
}) => {
  const { daochain, daoid } = useParams();

  const contributionClosed =
    roundData?.raiseOver ||
    currentContributionData?.addressRemaining <= 0 ||
    raiseAtMax;
  const eligibleBlock = isEligible === 'denied' || isEligible === 'unchecked';

  return (
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
              {currentContributionData.addressProposals.map(prop => {
                return (
                  <Flex
                    justifyContent='space-between'
                    alignContent='center'
                    key={prop.id}
                    mt={5}
                  >
                    <Text fontSize='sm' color='blackAlpha.700' as='i'>
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
              })}
            </Box>
          ) : null}
        </Box>
      ) : null}
    </ContentBox>
  );
};

export default CcoContributionCard;
