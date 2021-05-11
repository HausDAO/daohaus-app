import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Flex, Text } from '@chakra-ui/layout';

import CcoClaim from '../forms/ccoClaim';
import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { claimCountDownText } from '../utils/cco';
import { useDaoMember } from '../contexts/DaoMemberContext';

const CcoClaimCard = ({ roundData, setClaimComplete, claimComplete }) => {
  const { daochain, daoid } = useParams();
  const { address } = useInjectedProvider();
  const { daoMember } = useDaoMember();

  const claimAmount = (Number(daoMember?.loot) / roundData?.ratio || 0).toFixed(
    2,
  );
  const hasBalance =
    daoMember &&
    roundData &&
    daoMember.tokenBalances.find(bal => {
      const isRaiseToken =
        bal.token.tokenAddress.toLowerCase() ===
        roundData.ccoToken.tokenAddress.toLowerCase();
      return isRaiseToken && Number(bal.token.balance) > 0;
    });

  return (
    <ContentBox variant='d2' mt={2} w='100%'>
      <Flex alignItems='start'>
        <Box fontSize='3xl' fontFamily='heading' pr={5}>
          3
        </Box>

        <Flex justifyContent='space-between' alignItems='start'>
          <Text fontSize='sm' color='blackAlpha.700' as='i'>
            {claimCountDownText(roundData.claimPeriodStartTime)}
          </Text>
        </Flex>
        <Flex justifyContent='space-between' alignItems='start'>
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
          <Box fontSize='lg'>
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
      </Flex>
    </ContentBox>
  );
};

export default CcoClaimCard;
