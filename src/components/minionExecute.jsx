import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Flex, Spinner } from '@chakra-ui/react';

import { useDao } from '../contexts/DaoContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useTX } from '../contexts/TXContext';
import ApproveUberHausToken from './approveUberHausToken';
import EscrowActions from './escrowActions';
import RaribleOrder from './raribleOrder';
import TextBox from './TextBox';
import {
  MINION_TYPES,
  proposalTypeMaker,
  PROPOSAL_TYPES,
} from '../utils/proposalUtils';
import { transactionByProposalType } from '../utils/txHelpers';
import { createContract } from '../utils/contract';
import { LOCAL_ABI } from '../utils/abi';
import { supportedChains } from '../utils/chain';
import { UBERHAUS_DATA } from '../utils/uberhaus';

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
  const [minionDetails, setMinionDetails] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [needsHausApproval, setNeedsHausApproval] = useState(false);
  const [minionBalance, setMinionBalance] = useState(null);

  const isCorrectChain =
    daochain === injectedProvider?.currentProvider?.chainId;

  const hasraribleOrder = proposal.title.match(/Rarible NFT (Buy|Sell) Order/);
  const hasRaribleAction = hasraribleOrder && proposal.executed;
  const orderType = hasraribleOrder && hasraribleOrder[1];

  const isEscrowMinion =
    proposal?.minionAddress?.toLowerCase() ===
    supportedChains[daochain].escrow_minion?.toLowerCase();

  useEffect(() => {
    const getMinionDetails = async () => {
      setLoading(true);
      try {
        if (
          proposal.proposalType === PROPOSAL_TYPES.MINION_UBER_STAKE ||
          proposalType === PROPOSAL_TYPES.MINION_UBER_STAKE
        ) {
          const hausService = createContract({
            address: UBERHAUS_DATA.STAKING_TOKEN,
            abi: LOCAL_ABI.ERC_20,
            chainID: daochain,
          });

          const amountApproved = await hausService.methods
            .allowance(proposal?.minionAddress, UBERHAUS_DATA.ADDRESS)
            .call();

          const minionBalance = await hausService.methods
            .balanceOf(proposal.minionAddress)
            .call();

          setMinionBalance(minionBalance);
          setNeedsHausApproval(+amountApproved < +minionBalance);
        }

        if (minionAction) {
          setMinionDetails(minionAction);
          setShouldFetch(false);
        }
        setLoading(false);
      } catch (err) {
        setShouldFetch(false);
        setLoading(false);
        setMinionDetails(null);
      }
    };

    if (
      proposal?.proposalId &&
      proposal?.minionAddress &&
      daochain &&
      shouldFetch
    ) {
      getMinionDetails();
    }
  }, [daochain, minionAction, proposal, shouldFetch]);

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
    setShouldFetch(true);
    setLoading(false);
  };

  const getMinionAction = () => {
    if (hasRaribleAction)
      return <RaribleOrder proposal={proposal} orderType={orderType} />;

    if (proposal.executed || minionDetails?.executed) {
      return <Box>Executed</Box>;
    }

    if (needsHausApproval) {
      return (
        <ApproveUberHausToken
          minionAddress={proposal.minionAddress}
          minionBalance={minionBalance}
          setShouldFetch={setShouldFetch}
        />
      );
    }

    if (hideMinionExecuteButton) {
      return null;
    }

    if (isEscrowMinion) {
      return <EscrowActions proposal={proposal} />;
    }

    if (proposalType === PROPOSAL_TYPES.MINION_BUYOUT) {
      const isMember = daoMembers?.find(
        member => member.memberAddress === address,
      );
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

    if (
      !minionDetails?.executed &&
      proposal.proposalType === PROPOSAL_TYPES.MINION_UBER_RQ
    ) {
      return (
        <Flex alignItems='center' flexDir='column'>
          <Button onClick={handleExecute} mb={4} disabled={!isCorrectChain}>
            Execute Minion
          </Button>
          <Box>
            Warning: Execute will Fail if current minion has a yes vote on an
            active proposal
          </Box>
        </Flex>
      );
    }

    if (hideMinionExecuteButton === false) {
      return (
        <Button onClick={handleExecute} disabled={!isCorrectChain}>
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
