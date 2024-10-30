import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Flex, Spinner } from '@chakra-ui/react';

import { useDao } from '../contexts/DaoContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useTX } from '../contexts/TXContext';
import EscrowActions from './escrowActions';
import RaribleOrder from './raribleOrder';
import TextBox from './TextBox';
import {
  MINION_TYPES,
  proposalTypeMaker,
  PROPOSAL_TYPES,
} from '../utils/proposalUtils';
import { transactionByProposalType } from '../utils/txHelpers';
import { supportedChains } from '../utils/chain';

const MinionExecute = ({
  hideMinionExecuteButton,
  minionAction,
  proposal,
  early,
}) => {
  const { daochain } = useParams();
  const { address, injectedProvider } = useInjectedProvider();
  const { submitTransaction, refreshDao } = useTX();
  const { daoMembers } = useDao();
  const proposalType = useMemo(() => proposalTypeMaker(proposal.details), [
    proposal,
  ]);

  const [loading, setLoading] = useState(false);

  const isCorrectChain =
    daochain === injectedProvider?.currentProvider?.chainId;

  const hasraribleOrder = proposal.title.match(/Rarible NFT (Buy|Sell) Order/);
  const hasRaribleAction = hasraribleOrder && proposal.executed;

  const isEscrowMinion =
    proposal?.minionAddress?.toLowerCase() ===
    supportedChains[daochain].escrow_minion?.toLowerCase();

  const handleExecute = async () => {
    if (!proposal?.minion) return;
    setLoading(true);

    let args = [proposal.proposalId];
    if (proposal.minion.minionType === MINION_TYPES.SAFE) {
      args = [proposal.proposalId, proposal.actions[0].data];
    }

    await submitTransaction({
      tx: transactionByProposalType(proposal),
      args,
      localValues: {
        minionAddress: proposal.minionAddress,
        proposalId: proposal.proposalId,
        proposalType: proposal.proposalType,
      },
    });
    await refreshDao();
    setLoading(false);
  };

  const getMinionAction = () => {
    const isMember = daoMembers?.some(
      member => member.memberAddress === address,
    );

    if (hasRaribleAction) return <RaribleOrder proposal={proposal} />;

    if (hideMinionExecuteButton) {
      return null;
    }

    if (isEscrowMinion) {
      return <EscrowActions proposal={proposal} />;
    }

    if (proposalType === PROPOSAL_TYPES.MINION_BUYOUT) {
      const memberApplicant = daoMembers.find(
        member => member.memberAddress === proposal.createdBy,
      );

      const canExecute =
        memberApplicant?.loot === '0' && memberApplicant.shares === '0';

      return proposal?.status === 'NeedsExecution' ? (
        <Flex alignItems='center' flexDir='column'>
          <Button
            onClick={handleExecute}
            mb={4}
            disabled={
              !canExecute || (minionAction?.memberOnlyEnabled && !isMember)
            }
          >
            Execute Minion
          </Button>
          {!canExecute && (
            <TextBox size='xs' align='center' w='100%'>
              Proposer Must Rage Quit Before This Minion Can Be Executed.
            </TextBox>
          )}
        </Flex>
      ) : null;
    }

    if (hideMinionExecuteButton === false) {
      return (
        <Button
          onClick={handleExecute}
          disabled={
            !isCorrectChain || (minionAction?.memberOnlyEnabled && !isMember)
          }
        >
          {early && 'Early '}Execute Minion
        </Button>
      );
    }
  };

  return (
    <Flex justify='center' pt='10px'>
      <Flex direction='column'>
        {loading ? <Spinner /> : getMinionAction()}
      </Flex>
    </Flex>
  );
};

export default MinionExecute;
