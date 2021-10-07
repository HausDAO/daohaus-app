import React, { useState } from 'react';
import {
  RiCloseCircleLine,
  RiCheckboxCircleLine,
  RiQuestionLine,
} from 'react-icons/ri';
import { Box, Flex } from '@chakra-ui/layout';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import ContentBox from './ContentBox';
import CcoEligibilityButton from './ccoEligibilityButton';
import { ToolTipWrapper } from '../staticElements/wrappers';
import { getEligibility } from '../utils/metadata';

const CcoEligibility = ({
  networkMatch,
  isEligible,
  roundData,
  raiseAtMax,
  handleSwitchNetwork,
  setIsEligible,
}) => {
  const { address, requestWallet } = useInjectedProvider();
  const [checkingEligibility, setCheckingEligibility] = useState(false);

  const checkEligibility = async () => {
    setCheckingEligibility(true);
    const eligibleRes = await getEligibility(roundData.ccoId, address);
    const validRes = eligibleRes && !eligibleRes.error;
    setIsEligible(validRes ? 'checked' : 'denied');
    setCheckingEligibility(false);
  };

  return (
    <ContentBox variant='d2' mt={2} w='100%'>
      <Flex justify='start' align='center'>
        <Box fontSize='3xl' fontFamily='heading' pr={5}>
          1
        </Box>

        {isEligible === 'unchecked' && (
          <Flex mr='auto' align='center'>
            <Box>Only approved addresses can participate.</Box>
            <ToolTipWrapper
              hasArrow
              label={roundData.whitelistReqs}
              tooltip
              tooltipText={{
                title: 'Whitelist Requirements',
                body: roundData.whitelistReqs,
              }}
              placement='top'
            >
              <RiQuestionLine style={{ marginLeft: '5px' }} />
            </ToolTipWrapper>
          </Flex>
        )}

        <CcoEligibilityButton
          networkMatch={networkMatch}
          isEligible={isEligible}
          checkEligibility={checkEligibility}
          checkingEligibility={checkingEligibility}
          roundData={roundData}
          raiseAtMax={raiseAtMax}
          handleSwitchNetwork={handleSwitchNetwork}
          address={address}
          requestWallet={requestWallet}
        />

        {isEligible === 'checked' && (
          <>
            <Box
              size='md'
              my={2}
              color='#919191'
              display='flex'
              alignItems='center'
              fontWeight='700'
              w='100%'
            >
              <Box>You are eligible to contribute.</Box>
              <RiCheckboxCircleLine
                style={{
                  fill: '#F49C32',
                  marginLeft: 'auto',
                  width: '36px',
                  height: '36px',
                }}
              />
            </Box>

            {roundData.beforeRaise && (
              <Box size='md' my={2} color='blackAlpha.900'>
                Come back when the contribution round begins.
              </Box>
            )}
          </>
        )}
        {isEligible === 'denied' && (
          <Box
            size='md'
            my={2}
            color='red'
            display='flex'
            alignItems='center'
            fontWeight='700'
            w='100%'
          >
            Address is not eligible.
            <RiCloseCircleLine
              style={{
                fill: 'red',
                marginLeft: 'auto',
                width: '36px',
                height: '36px',
              }}
            />{' '}
          </Box>
        )}
      </Flex>
    </ContentBox>
  );
};

export default CcoEligibility;
