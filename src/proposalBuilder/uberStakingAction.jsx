import { Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TX } from '../data/contractTX';
import { LOCAL_ABI } from '../utils/abi';
import { createContract } from '../utils/contract';
import { UBERHAUS_DATA } from '../utils/uberhaus';
import ExecuteAction from './ExecuteAction';

const UberStakingAction = props => {
  const { proposal, minionAction } = props;
  const { daochain } = useParams();
  const [hasEnough, setHasEnough] = useState('loading');
  // const [hausBalance, setHausBalance] = useState(null);
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

      setHasEnough(Number(amountApproved) > Number(minionBalance));
      // setHausBalance(minionBalance);
    };
    if (proposal) {
      checkHausBal();
    }
  }, [proposal.minionAddress]);

  if (hasEnough === 'loading') return null;

  if (!hasEnough) {
    return (
      <Button size='sm' minW='4rem'>
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
