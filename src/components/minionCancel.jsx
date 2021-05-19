import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Flex, Spinner } from '@chakra-ui/react';

import { useUser } from '../contexts/UserContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useTX } from '../contexts/TXContext';
import { createPoll } from '../services/pollService';
import { MinionService } from '../services/minionService';

const MinionCancel = ({ proposal }) => {
  const { daochain, daoid } = useParams();
  const {
    errorToast,
    successToast,
    setProposalModal,
    setTxInfoModal,
  } = useOverlay();
  const { address, injectedProvider } = useInjectedProvider();
  const { cachePoll, resolvePoll } = useUser();
  const { refreshDao } = useTX();

  const [loading, setLoading] = useState(false);

  const cancelMinion = async () => {
    if (!proposal?.minion) return;

    setLoading(true);
    const args = [proposal.proposalId];
    try {
      const poll = createPoll({ action: 'cancelProposal', cachePoll })({
        daoID: daoid,
        chainID: daochain,
        proposalId: proposal.proposalId,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: 'There was an error.',
            });
            resolvePoll(txHash);
            console.error(`Could not find a matching proposal: ${error}`);
            setLoading(false);
          },
          onSuccess: txHash => {
            successToast({
              title: 'Cancelled proposal!',
            });
            refreshDao();
            resolvePoll(txHash);
            setLoading(false);
          },
        },
      });
      const onTxHash = () => {
        setProposalModal(false);
        setTxInfoModal(true);
      };

      await MinionService({
        web3: injectedProvider,
        minion: proposal.minionAddress,
        chainID: daochain,
      })('cancelAction')({
        args,
        address,
        poll,
        onTxHash,
      });
    } catch (err) {
      console.log('error: ', err);
      setLoading(false);
    }
  };

  const isCorrectChain =
    daochain === injectedProvider?.currentProvider?.chainId;

  const getMinionAction = () => {
    return (
      <Button onClick={cancelMinion} disabled={!isCorrectChain}>
        Cancel Minion
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

export default MinionCancel;
