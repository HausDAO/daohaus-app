import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Flex, Spinner } from '@chakra-ui/react';

import { useDao } from '../contexts/DaoContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useTX } from '../contexts/TXContext';
import ApproveUberHausToken from './approveUberHausToken';
import {
  MINION_TYPES,
  multicallActionsFromProposal,
  PROPOSAL_TYPES,
} from '../utils/proposalUtils';
import { TokenService } from '../services/tokenService';
import { transactionByProposalType } from '../utils/txHelpers';
import { UBERHAUS_DATA } from '../utils/uberhaus';

const MinionExecute = ({
  hideMinionExecuteButton,
  minionAction,
  proposal,
  early,
}) => {
  const { daochain } = useParams();
  const { injectedProvider } = useInjectedProvider();
  const { submitTransaction, refreshDao } = useTX();
  const { refreshMinionVault } = useDao();

  const [loading, setLoading] = useState(false);
  const [minionDetails, setMinionDetails] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [needsHausApproval, setNeedsHausApproval] = useState(false);
  const [minionBalance, setMinionBalance] = useState(null);

  const isCorrectChain =
    daochain === injectedProvider?.currentProvider?.chainId;

  useEffect(() => {
    const getMinionDetails = async () => {
      setLoading(true);
      try {
        if (proposal.proposalType === PROPOSAL_TYPES.MINION_UBER_STAKE) {
          const hausService = await TokenService({
            chainID: daochain,
            tokenAddress: UBERHAUS_DATA.STAKING_TOKEN,
            is32: false,
          });

          const amountApproved = await hausService('allowance')({
            accountAddr: proposal?.minionAddress,
            contractAddr: UBERHAUS_DATA.ADDRESS,
          });

          const minionBalance = await hausService('balanceOf')(
            proposal.minionAddress,
          );

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
    if (proposal.minion.minionType === MINION_TYPES.NEAPOLITAN) {
      const actions = multicallActionsFromProposal(proposal);
      args = [
        proposal.proposalId,
        actions.targets,
        actions.values,
        actions.datas,
      ];
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
    await refreshMinionVault(proposal.minionAddress);
    refreshDao();
    setShouldFetch(true);
    setLoading(false);
  };

  const getMinionAction = () => {
    if (minionDetails?.executed) return <Box>Executed</Box>;

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
