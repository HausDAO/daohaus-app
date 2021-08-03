import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Flex, Spinner } from '@chakra-ui/react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useDao } from '../contexts/DaoContext';
import { useTX } from '../contexts/TXContext';
import ApproveUberHausToken from './approveUberHausToken';
import { TokenService } from '../services/tokenService';
import {
  PROPOSAL_TYPES,
  MINION_ACTION_FUNCTION_NAMES,
} from '../utils/proposalUtils';
import { UBERHAUS_DATA } from '../utils/uberhaus';
import { LOCAL_ABI } from '../utils/abi';
import { createContract } from '../utils/contract';
import { transactionByProposalType } from '../utils/txHelpers';

const MinionExecute = ({ proposal, early }) => {
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
        const tx = transactionByProposalType(proposal);
        const abi = LOCAL_ABI[tx.contract.abiName];
        const web3Contract = createContract({
          address: proposal.minionAddress,
          abi,
          chainID: daochain,
          web3: injectedProvider,
        });

        const action = await web3Contract.methods[
          MINION_ACTION_FUNCTION_NAMES[tx.contract.abiName]
        ](proposal.proposalId).call();

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

        setMinionDetails(action);
        setShouldFetch(false);
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
  }, [proposal, daochain, shouldFetch]);

  const handleExecute = async () => {
    if (!proposal?.minion) return;
    setLoading(true);

    const args = [proposal.proposalId];
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

    return (
      <Button onClick={handleExecute} disabled={!isCorrectChain}>
        {early && 'Early '}Execute Minion
      </Button>
    );
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
