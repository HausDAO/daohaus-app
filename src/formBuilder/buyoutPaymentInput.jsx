import React, { useState, useEffect } from 'react';
import { Flex, Text, Box } from '@chakra-ui/react';

import { useDaoMember } from '../contexts/DaoMemberContext';
import { useDao } from '../contexts/DaoContext';

import PaymentInput from './paymentInput';

const BuyoutPaymentInput = props => {
  const { localForm } = props;
  const { setValue, watch, register } = localForm;
  const { isMember, daoMember } = useDaoMember();
  const { daoOverview } = useDao();
  const [sharesLoot, setSharesLoot] = useState();
  const [percentSharesLoot, setPercentSharesLoot] = useState();

  useEffect(() => {
    console.log({ isMember, daoMember });
    if (isMember && daoMember) {
      const newSharesLoot = +daoMember.shares + +daoMember.loot;
      setSharesLoot(newSharesLoot);
      setPercentSharesLoot(
        newSharesLoot / (+daoOverview.totalShares + +daoOverview.totalLoot),
      );
    }
  }, [isMember, daoMember]);

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
          {sharesLoot} ({percentSharesLoot}% of total)
        </Text>
        <Text fontSize='sm' fontFamily='heading' color='mode.900'>
          Estimated Exit Value on Ragequit
        </Text>
        <Text fontSize='xs' fontFamily='mono' color='mode.200'>
          {300} DAI
        </Text>
      </Box>
      <PaymentInput {...props} />
      <Text color='secondary.500' fontFamily='heading' fontSize='sm'>
        ! IF the proposal passes, the Funds will only be available after you
        ragequit
      </Text>
    </Flex>
  );
};
export default BuyoutPaymentInput;
