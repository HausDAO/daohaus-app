import React from 'react';
import { Box } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/button';
import { Spinner } from '@chakra-ui/spinner';

const CcoEligibilityButton = ({
  networkMatch,
  isEligible,
  checkEligibility,
  checkingEligibility,
  roundData,
  raiseAtMax,
  handleSwitchNetwork,
  address,
  requestWallet,
}) => {
  return (
    <>
      {networkMatch ? (
        <Box>
          {isEligible === 'unchecked' && (
            <>
              <Button
                variant='primary'
                fontFamily='heading'
                letterSpacing='0.1em'
                textTransform='uppercase'
                onClick={checkEligibility}
                disabled={
                  checkingEligibility || roundData.raiseOver || raiseAtMax
                }
              >
                {!checkingEligibility ? <>Check Eligibility</> : <Spinner />}
              </Button>

              {(roundData.raiseOver || raiseAtMax) && (
                <Box size='xs' my={2} color='blackAlpha.900'>
                  Contributions are closed
                </Box>
              )}
            </>
          )}
        </Box>
      ) : (
        <Box>
          <Button
            onClick={address ? handleSwitchNetwork : requestWallet}
            fontFamily='heading'
            letterSpacing='0.1em'
            textTransform='uppercase'
          >
            {address
              ? `Switch to the ${roundData.network} network`
              : `Connect Wallet`}
          </Button>
        </Box>
      )}
    </>
  );
};

export default CcoEligibilityButton;
