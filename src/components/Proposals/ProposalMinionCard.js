import React, { useEffect, useState } from 'react';
import { Box, Skeleton, Text } from '@chakra-ui/core';
import { useUser, useWeb3Connect } from '../../contexts/PokemolContext';
import { MinionService } from '../../utils/minion-service';

const ProposalMinionCard = ({ proposal }) => {
  const [minionDeets, setMinionDeets] = useState();
  const [loading, setLoading] = useState(true);
  const [web3Connect] = useWeb3Connect();
  const [user] = useUser();

  useEffect(() => {
    let action;
    const getMinionDeets = async () => {
      const setupValues = {
        minion: '0x36473d5bbfa176733898019245a603d915171b7c',
      };
      const minionService = new MinionService(
        web3Connect?.web3,
        user?.username,
        setupValues,
      );

      try {
        action = await minionService.getAction(proposal.proposalId);
      } catch (err) {
        console.log('error: ', err);
      } finally {
        setLoading(false);
      }
      console.log('action>>>>>>>>', proposal.proposalId, action);
      setMinionDeets(action);
    };
    if (proposal?.proposalId) {
      getMinionDeets();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal, user]);

  return (
    <>
      <Skeleton isLoaded={!loading}>
        <Box w='100%' mt={8}>
          <Text>Target Address: {minionDeets?.to}</Text>
          <Text>Submitted by {minionDeets?.proposer}</Text>
          <Text>More info</Text>
        </Box>
      </Skeleton>
    </>
  );
};

export default ProposalMinionCard;
