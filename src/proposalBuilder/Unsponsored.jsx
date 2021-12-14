import React, { useMemo, useState } from 'react';
import { Button, Flex } from '@chakra-ui/react';

import { useDao } from '../contexts/DaoContext';
import { useTX } from '../contexts/TXContext';

import { ParaSm } from '../components/typography';
import { propStatusText } from './propCardText';

import { readableTokenBalance } from '../utils/proposalCard';
import { TX } from '../data/contractTX';
import {
  EarlyExecuteGauge,
  PropActionBox,
  StatusCircle,
  StatusDisplayBox,
} from './actionPrimitives';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useDaoMember } from '../contexts/DaoMemberContext';
import SkeletonCard from './SkeletonCard';

const Unsponsored = props => {
  const { proposal } = props;
  console.log(`props`, props);
  const { daoOverview } = useDao();
  const { daoMember } = useDaoMember();
  const { address } = useInjectedProvider();

  const [isLoadingTx, setLoadingTx] = useState(false);
  const [memberBalanceData, setMemberBalanceData] = useState();
  const { submitTransaction } = useTX();

  const deposit = useMemo(() => {
    const { depositToken, proposalDeposit } = daoOverview || {};
    if (!depositToken?.decimals || !depositToken.symbol || !proposalDeposit)
      return;
    const { decimals, symbol } = depositToken;
    return readableTokenBalance({
      balance: proposalDeposit,
      decimals,
      symbol,
    });
  }, [daoOverview, daoMember]);

  const sponsorProposal = async () => {
    setLoadingTx(true);
    await submitTransaction({
      args: [proposal.proposalId],
      tx: TX.SPONSOR_PROPOSAL,
    });
    setLoadingTx(false);
  };
  const cancelProposal = async () => {
    setLoadingTx(true);
    await submitTransaction({
      args: [proposal.proposalId],
      tx: TX.CANCEL_PROPOSAL,
    });
    setLoadingTx(false);
  };

  if (daoMember || !daoOverview) {
    return <SkeletonCard />;
  }
  if (!deposit?.canSpend) {
    return (
      <SponsorCard
        isLoadingTx={isLoadingTx}
        cancelProposal={cancelProposal}
        sponsorProposal={sponsorProposal}
        address={address}
        {...props}
      />
    );
  }
  if (deposit?.canSpend) {
    return <UnlockTokenCard />;
  }
};
export default Unsponsored;

const UnlockTokenCard = () => null;

const SponsorCard = ({
  isLoadingTx,
  cancelProposal,
  sponsorProposal,
  deposit,
  proposal,
  voteData,
  canInteract,
  isMember,
  address,
}) => {
  return (
    <PropActionBox>
      <StatusDisplayBox>
        <EarlyExecuteGauge proposal={proposal} voteData={voteData} />
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
          isLoading={isLoadingTx}
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
            isLoading={isLoadingTx}
          >
            Cancel
          </Button>
        )}
      </Flex>
    </PropActionBox>
  );
};
