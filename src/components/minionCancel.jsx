import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Flex, Spinner } from '@chakra-ui/react';
import { ToolTipWrapper } from '../staticElements/wrappers';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useTX } from '../contexts/TXContext';
import { TX } from '../data/txLegos/contractTX';

const MinionCancel = ({ proposal }) => {
  const { daochain } = useParams();
  const { injectedProvider, address } = useInjectedProvider();
  const { submitTransaction } = useTX();

  const [loading, setLoading] = useState(false);
  const [isProposer, setIsProposer] = useState(false);

  const cancelMinion = async () => {
    if (proposal?.escrow) {
      setLoading(true);
      await submitTransaction({
        tx: TX.ESCROW_MINION_CANCEL,
        args: [proposal.proposalId, proposal.molochAddress],
      });
      setLoading(false);
    } else if (proposal?.minion) {
      setLoading(true);
      await submitTransaction({
        tx: TX.MINION_CANCEL,
        args: [proposal.proposalId],
        localValues: {
          minionAddress: proposal.minionAddress,
        },
      });
      setLoading(false);
    }
  };

  const isCorrectChain =
    daochain === injectedProvider?.currentProvider?.chainId;

  useEffect(() => {
    setIsProposer(
      proposal?.createdBy === address ||
        proposal?.createdBy === proposal?.minionAddress,
    );
  }, [address, proposal?.proposer, proposal?.createdBy]);

  const getMinionAction = () => {
    return (
      <ToolTipWrapper
        tooltip
        tooltipText={{ body: `Only proposor can cancel` }}
        placement='right'
        layoutProps={{
          transform: 'translateY(-2px)',
          display: 'inline-block',
        }}
      >
        <Button
          onClick={cancelMinion}
          disabled={!isCorrectChain || !isProposer}
        >
          Cancel Minion
        </Button>
      </ToolTipWrapper>
    );
  };

  return (
    <Flex justify='center'>
      <Flex direction='column'>
        {loading ? <Spinner /> : getMinionAction()}
      </Flex>
    </Flex>
  );
};

export default MinionCancel;
