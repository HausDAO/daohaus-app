import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Flex, Text } from '@chakra-ui/layout';

import ContentBox from './ContentBox';
import CcoLootGrabForm from '../forms/ccoLootGrab';
import { countDownText } from '../utils/cco';
import { timeToNow } from '../utils/general';

const CcoContributionCard = ({
  raiseAtMax,
  roundData,
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
      <Flex alignItems='flex-end' wrap='wrap'>
        <Flex
          w='100%'
          justify='space-between'
          align='flex-end'
          wrap='wrap'
          mb={3}
        >
          {!raiseAtMax ? (
            <Text fontSize='sm' color='blackAlpha.700' as='i' marginLeft='auto'>
              {countDownText(roundData)}
            </Text>
          ) : (
            <Text fontSize='sm' color='blackAlpha.700' as='i' marginLeft='auto'>
              Max target reached. Contributions are closed.
            </Text>
          )}
        </Flex>
        <Flex w='100%' align='flex-start'>
          <Flex direction='column'>
            <Box fontSize='3xl' fontFamily='heading' pr={5}>
              2
            </Box>
          </Flex>
          <Flex direction='column' w='100%'>
            <Box w='100%'>
              <CcoLootGrabForm
                roundData={roundData}
                currentContributionData={currentContributionData}
                contributionClosed={contributionClosed}
                openContribution={!eligibleBlock && roundData.raiseOpen}
              />

              {currentContributionData && (
                <Box borderTopWidth='1px' mt={5} borderColor='mode.900'>
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
                          style={{ color: '#919191', fontSize: '13px' }}
                        >
                          View contribution
                        </RouterLink>
                      </Flex>
                    );
                  })}
                </Box>
              )}
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </ContentBox>
  );
};

export default CcoContributionCard;
