import React, { useState } from 'react';
import { Box, Flex } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import { Button } from '@chakra-ui/button';

import { Tooltip } from '@chakra-ui/tooltip';
import { RiQuestionLine } from 'react-icons/ri';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import ContentBox from './ContentBox';
import { getEligibility } from '../utils/metadata';
import { ToolTipWrapper } from '../staticElements/wrappers';

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
      <Flex justifyContent='flex-start'>
        <Box fontSize='3xl' fontFamily='heading' pr={5}>
          1
        </Box>
        <Box>
          Only approved addresses can participate. Click the button to check
          your eligibility.
          <ToolTipWrapper
            placement='right'
            tooltip
            tooltipText={{
              title: 'Whitelist Requirements',
              body: roundData.whitelistReqs,
            }}
          >
            <RiQuestionLine />
          </ToolTipWrapper>
        </Box>
        {networkMatch ? (
          <Box>
            {isEligible === 'unchecked' && (
              <Tooltip
                hasArrow
                shouldWrapChildren
                label={roundData.whitelistReqs}
                placement='top'
              >
                <Button
                  variant='primary'
                  onClick={checkEligibility}
                  disabled={
                    checkingEligibility || roundData.raiseOver || raiseAtMax
                  }
                >
                  {!checkingEligibility ? <>Check Eligibility</> : <Spinner />}
                </Button>
              </Tooltip>
            )}
            {isEligible === 'checked' && (
              <>
                <Box size='md' my={2} color='blackAlpha.900'>
                  You are eligible to contribute.
                </Box>

                {roundData.beforeRaise ? (
                  <Box size='md' my={2} color='blackAlpha.900'>
                    Come back when the contribution round begins.
                  </Box>
                ) : null}
              </>
            )}
            {isEligible === 'denied' && (
              <Box size='md' my={2} color='blackAlpha.900'>
                Address is not eligible.
              </Box>
            )}
          </Box>
        ) : (
          <Box>
            {address ? (
              <Button onClick={handleSwitchNetwork}>
                {`Switch to the ${roundData.network} network`}
              </Button>
            ) : (
              <Button onClick={requestWallet} mb={6}>
                Connect Wallet
              </Button>
            )}
          </Box>
        )}
      </Flex>
    </ContentBox>
  );
};

export default CcoEligibility;
