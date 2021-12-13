import React, { useMemo, useState } from 'react';
import { Button, Flex } from '@chakra-ui/react';

import { useDao } from '../contexts/DaoContext';
import { useTX } from '../contexts/TXContext';

import { ParaSm } from '../components/typography';
import { propStatusText } from './propCardText';

import { readableTokenBalance } from '../utils/proposalCard';
import { TX } from '../data/contractTX';
import {
  PropActionBox,
  StatusCircle,
  StatusDisplayBox,
} from './actionPrimitives';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

const Unsponsored = ({ proposal, canInteract, isMember }) => {
  const { daoOverview } = useDao();
  const { address } = useInjectedProvider();

  const [isLoading, setLoading] = useState(false);
  const { submitTransaction } = useTX();

  const deposit = useMemo(() => {
    const { depositToken, proposalDeposit } = daoOverview || {};
    if (!depositToken?.decimals || !depositToken.symbol || !proposalDeposit)
      return;
    return readableTokenBalance({
      balance: proposalDeposit,
      decimals: depositToken?.decimals,
      symbol: depositToken?.symbol,
    });
  }, [daoOverview]);

  const sponsorProposal = async () => {
    setLoading(true);
    await submitTransaction({
      args: [proposal.proposalId],
      tx: TX.SPONSOR_PROPOSAL,
    });
    setLoading(false);
  };
  const cancelProposal = async () => {
    setLoading(true);
    await submitTransaction({
      args: [proposal.proposalId],
      tx: TX.CANCEL_PROPOSAL,
    });
    setLoading(false);
  };

  return (
    <PropActionBox>
      <StatusDisplayBox>
        <StatusCircle color='green' />
        <ParaSm fontWeight='700' mr='1'>
          Unsponsored
        </ParaSm>
      </StatusDisplayBox>
      <ParaSm mb={3}>{propStatusText.Unsponsored}</ParaSm>
      <Flex>
        <Button
          size='sm'
          minW='4rem'
          fontWeight='700'
          mr='auto'
          disabled={!canInteract || !isMember}
          onClick={sponsorProposal}
          isLoading={isLoading}
        >
          Sponsor {deposit && `(${deposit})`}
        </Button>
        {address?.toLowerCase() === proposal?.proposer?.toLowerCase() && (
          <Button
            size='sm'
            fontWeight='700'
            minW='4rem'
            variant='outline'
            disabled={!canInteract}
            onClick={cancelProposal}
            isLoading={isLoading}
          >
            Cancel
          </Button>
        )}
      </Flex>
    </PropActionBox>
  );
};
export default Unsponsored;
