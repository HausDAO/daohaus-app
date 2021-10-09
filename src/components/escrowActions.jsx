import React, { useEffect, useState } from 'react';
import { Button, Flex, Spinner, Text } from '@chakra-ui/react';

import { useUser } from '../contexts/UserContext';
import { MinionService } from '../services/minionService';
import { useOverlay } from '../contexts/OverlayContext';
import { createPoll } from '../services/pollService';
import { useTX } from '../contexts/TXContext';

const EscrowActions = ({ proposal, address, injectedProvider, daochain }) => {
  const { errorToast, successToast, setTxInfoModal } = useOverlay();
  const { molochAddress, minionAddress, proposalId } = proposal;
  const { cachePoll, resolvePoll } = useUser();
  const [loading, setLoading] = useState(true);
  const [tokensAvailable, setTokensAvailable] = useState(false);
  const { refreshDao } = useTX();

  useEffect(() => {
    if (loading) {
      MinionService({
        web3: injectedProvider,
        minion: minionAddress,
        chainID: daochain,
        minionType: 'escrowMinion',
      })('escrowBalances')({
        args: [molochAddress, proposalId, 0],
      })
        .then(({ executed }) => {
          setTokensAvailable(!executed);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, []);

  const withdrawEscrowTokens = async () => {
    const args = [proposalId, molochAddress, [0]];

    try {
      setLoading(true);
      const poll = createPoll({ action: 'withdrawEscrowTokens', cachePoll })({
        daoID: molochAddress,
        chainID: daochain,
        proposalId,
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
              title: 'Tokens Withdrawn to vault!',
            });
            refreshDao();
            resolvePoll(txHash);
            setLoading(false);
          },
        },
      });

      const onTxHash = () => {
        setTxInfoModal(true);
      };

      await MinionService({
        web3: injectedProvider,
        minion: minionAddress,
        chainID: daochain,
        minionType: 'escrowMinion',
      })('withdrawToDestination')({
        args,
        address,
        poll,
        onTxHash,
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Flex alignItems='center' flexDir='row'>
      {tokensAvailable ? (
        <Button onClick={withdrawEscrowTokens}>Withdraw from Escrow</Button>
      ) : (
        <Text>Tokens Withdrawn</Text>
      )}
    </Flex>
  );
};

export default EscrowActions;
