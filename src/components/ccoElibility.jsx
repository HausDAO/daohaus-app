import React, { useState } from 'react';
import { Box } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/spinner';
import { Button } from '@chakra-ui/button';

import { Tooltip } from '@chakra-ui/tooltip';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import ContentBox from './ContentBox';
import TextBox from './TextBox';
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
      <Tooltip
        hasArrow
        shouldWrapChildren
        label={roundData.whitelistReqs}
        placement='top'
      >
        <TextBox size='sm' color='blackAlpha.900' mb={7}>
          1. Check eligibility
        </TextBox>
      </Tooltip>
      {networkMatch ? (
        <>
          {isEligible === 'unchecked' && (
            <Button
              onClick={checkEligibility}
              disabled={
                checkingEligibility || roundData.raiseOver || raiseAtMax
              }
            >
              {!checkingEligibility ? <>Check Eligibility</> : <Spinner />}
            </Button>
          )}
          {isEligible === 'checked' && (
            <>
              <Box size='md' my={2} color='blackAlpha.900'>
                You&apos;re eligible. Kudos for interacting with DAOs!
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
              Address is not eligible. Try again with another address that has
              interacted with a DAO.
            </Box>
          )}
        </>
      ) : (
        <>
          {address ? (
            <Button onClick={handleSwitchNetwork}>
              {`Switch to the ${roundData.network} network`}
            </Button>
          ) : (
            <Button onClick={requestWallet} mb={6}>
              Connect Wallet
            </Button>
          )}
        </>
      )}
    </ContentBox>
  );
};

export default CcoEligibility;
