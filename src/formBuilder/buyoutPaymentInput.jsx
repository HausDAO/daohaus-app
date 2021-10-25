import React, { useState, useEffect } from 'react';
import { Flex, Text, Box } from '@chakra-ui/react';

import { useDaoMember } from '../contexts/DaoMemberContext';
import { useDao } from '../contexts/DaoContext';
import { useToken } from '../contexts/TokenContext';
import PaymentInput from './paymentInput';
import { tallyUSDs } from '../utils/tokenValue';

const BuyoutPaymentInput = props => {
  const { isMember, daoMember } = useDaoMember();
  const { daoOverview } = useDao();
  const { currentDaoTokens } = useToken();
  const [sharesLoot, setSharesLoot] = useState(0);
  const [percentSharesLoot, setPercentSharesLoot] = useState(0);
  const [estimate, setEstimate] = useState(0);

  useEffect(() => {
    if (isMember && daoMember) {
      const newSharesLoot = Number(daoMember.shares) + Number(daoMember.loot);
      setSharesLoot(newSharesLoot);
      setPercentSharesLoot(
        newSharesLoot /
          (Number(daoOverview.totalShares) + Number(daoOverview.totalLoot)),
      );
    }
  }, [isMember, daoMember]);

  useEffect(() => {
    if (percentSharesLoot && currentDaoTokens) {
      setEstimate((tallyUSDs(currentDaoTokens) * percentSharesLoot).toFixed(2));
    }
  }, [percentSharesLoot, currentDaoTokens]);

  return (
    <Flex direction='column'>
      <Box
        borderColor='mode.900'
        borderStyle='solid'
        borderWidth='1px'
        borderRadius={8}
        padding={4}
        marginBottom={4}
        marginTop={4}
      >
        <Text fontSize='sm' fontFamily='heading' color='mode.900'>
          Your Shares and Loot
        </Text>
        <Text fontSize='xs' fontFamily='mono' color='mode.200' marginBottom={4}>
          {sharesLoot} ({percentSharesLoot * 100}% of total)
        </Text>
        <Text fontSize='sm' fontFamily='heading' color='mode.900'>
          Estimated Exit Value on Ragequit
        </Text>
        <Text fontSize='xs' fontFamily='mono' color='mode.200'>
          ${estimate}
        </Text>
      </Box>
      <PaymentInput {...props} />
      <Text color='secondary.500' fontFamily='heading' fontSize='sm'>
        If the proposal passes, the Funds will only be available after you
        ragequit
      </Text>
    </Flex>
  );
};
export default BuyoutPaymentInput;
