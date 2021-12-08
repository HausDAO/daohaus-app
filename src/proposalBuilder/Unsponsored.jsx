import React, { useMemo, useState } from 'react';
import { Button } from '@chakra-ui/react';

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

const Unsponsored = ({ interaction, proposal }) => {
  const { daoOverview } = useDao();
  const { canInteract } = interaction || {};

  const [isLoading, setLoading] = useState(false);
  const { submitTransaction } = useTX();

  const sponsorProposal = async () => {
    setLoading(true);
    await submitTransaction({
      args: [proposal.proposalId],
      tx: TX.SPONSOR_PROPOSAL,
    });
    setLoading(false);
  };

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

  return (
    <PropActionBox>
      <StatusDisplayBox>
        <StatusCircle color='green' />
        <ParaSm fontWeight='700' mr='1'>
          Unsponsored
        </ParaSm>
      </StatusDisplayBox>
      <ParaSm mb={3}>{propStatusText.Unsponsored}</ParaSm>
      <Button
        size='sm'
        minW='4rem'
        fontWeight='700'
        disabled={!canInteract}
        onClick={sponsorProposal}
        isLoading={isLoading}
      >
        Sponsor {deposit && `(${deposit})`}
      </Button>
    </PropActionBox>
  );
};
export default Unsponsored;
