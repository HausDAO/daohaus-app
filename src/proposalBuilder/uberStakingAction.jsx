import React, { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useTX } from '../contexts/TXContext';
import ExecuteAction from './executeAction';

import { createContract } from '../utils/contract';
import { UBERHAUS_DATA } from '../utils/uberhaus';
import { LOCAL_ABI } from '../utils/abi';
import { TX } from '../data/txLegos/contractTX';

const UberStakingAction = props => {
  const { proposal } = props;
  const { daochain } = useParams();
  const { submitTransaction } = useTX();

  const [isApproved, setIsApproved] = useState('loading');
  const [loading, setLoading] = useState(false);

  const [hausBalance, setHausBalance] = useState(null);
  useEffect(() => {
    const checkHausBal = async () => {
      const hausContract = createContract({
        address: UBERHAUS_DATA.STAKING_TOKEN,
        abi: LOCAL_ABI.ERC_20,
        chainID: daochain,
      });
      const amountApproved = await hausContract.methods
        .allowance(proposal?.minionAddress, UBERHAUS_DATA.ADDRESS)
        .call();
      const minionBalance = await hausContract.methods
        .balanceOf(proposal.minionAddress)
        .call();

      setIsApproved(Number(amountApproved) > Number(minionBalance));
      setHausBalance(minionBalance);
    };
    if (proposal) {
      checkHausBal();
    }
  }, [proposal.minionAddress]);

  const approveHAUS = async () => {
    setLoading(true);
    const { minionAddress, proposalId, proposalType } = proposal;
    await submitTransaction({
      tx: TX.APPROVE_UHMINION_HAUS,
      args: [proposal.proposalId],
      localValues: {
        chainID: daochain,
        minionAddress,
        uberHausAddress: UBERHAUS_DATA.ADDRESS,
        daoID: UBERHAUS_DATA.ADDRESS,
        tokenAddress: UBERHAUS_DATA.STAKING_TOKEN,
        userAddress: minionAddress,
        unlockAmount: hausBalance,
        proposalId,
        proposalType,
      },
    });
    setLoading(false);
  };

  if (isApproved === 'loading') return null;

  if (!isApproved) {
    return (
      <Button size='sm' minW='4rem' isLoading={loading} onClick={approveHAUS}>
        Approve HAUS
      </Button>
    );
  }
  return (
    <ExecuteAction
      {...props}
      executeTX={TX.UBER_EXECUTE_ACTION}
      executed={false}
    />
  );
};

export default UberStakingAction;
