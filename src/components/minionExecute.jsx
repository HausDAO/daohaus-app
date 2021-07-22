import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Flex, Spinner } from '@chakra-ui/react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useDao } from '../contexts/DaoContext';
import { useTX } from '../contexts/TXContext';
import ApproveUberHausToken from './approveUberHausToken';
import { TokenService } from '../services/tokenService';
import { PROPOSAL_TYPES } from '../utils/proposalUtils';
import { UBERHAUS_DATA } from '../utils/uberhaus';
import { createContract } from '../utils/contract';
import { LOCAL_ABI } from '../utils/abi';
import { TX } from '../data/contractTX';

const MinionExecute = ({ proposal, early }) => {
  const { daochain } = useParams();
  const { injectedProvider } = useInjectedProvider();
  const { submitTransaction } = useTX();
  const { refreshMinionVault } = useDao();

  const [loading, setLoading] = useState(false);
  const [minionDetails, setMinionDetails] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [needsHausApproval, setNeedsHausApproval] = useState(false);
  const [minionBalance, setMinionBalance] = useState(null);

  const isCorrectChain =
    daochain === injectedProvider?.currentProvider?.chainId;

  const transactionByProposalType = () => {
    if (proposal.proposalType === PROPOSAL_TYPES.MINION_UBER_DEL) {
      return TX.UBERHAUS_MINION_EXECUTE_APPOINTMENT;
    }
    if (proposal.proposalType === PROPOSAL_TYPES.MINION_SUPERFLUID) {
      return TX.SUPERFLUID_MINION_EXECUTE;
    }
    return TX.MINION_SIMPLE_EXECUTE;
  };

  useEffect(() => {
    const getMinionDetails = async () => {
      setLoading(true);
      try {
        const tx = transactionByProposalType(proposal.proposalType);
        const abi = LOCAL_ABI[tx.contract.abiName];
        const web3Contract = createContract({
          address: proposal.minionAddress,
          abi,
          chainID: daochain,
          web3: injectedProvider,
        });

        let action;
        if (tx.contract.abiName === 'VANILLA_MINION') {
          action = await web3Contract.methods
            .actions(proposal.proposalId)
            .call();

          console.log('action', action);
        }
        if (tx.contract.abiName === 'UBERHAUS_MINION') {
          action = await web3Contract.methods
            .appointments(proposal.proposalId)
            .call();
        }
        if (tx.contract.abiName === 'SUPERFLUID_MINION') {
          action = await web3Contract.methods
            .streams(proposal.proposalId)
            .call();
        }

        if (proposal.proposalType === PROPOSAL_TYPES.MINION_UBER_STAKE) {
          // TODO: Might be able to get rid of tokenservice - but is32 might be an issue
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

  console.log('minionDetails', minionDetails);

  const handleExecute = async () => {
    if (!proposal?.minion) return;
    setLoading(true);

    // TODO: args by minion type once we have escrow/neapolitan
    const args = [proposal.proposalId];

    await submitTransaction({
      tx: transactionByProposalType(proposal.proposalType),
      args,
      localValues: {
        minionAddress: proposal.minionAddress,
        proposalId: proposal.proposalId,
        proposalType: proposal.proposalType,
      },
      lifeCycleFns: {
        onPollSuccess() {
          // TODO: More testing on this to check that it resolves before refreshdao
          // - posible to make async?
          refreshMinionVault(proposal.minionAddress);
        },
      },
    });
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
