import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Box, Text } from '@chakra-ui/react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useUser } from '../contexts/UserContext';
import { useTX } from '../contexts/TXContext';
import { createPoll } from '../services/pollService';
import { MolochService } from '../services/molochService';
import { useDaoMember } from '../contexts/DaoMemberContext';
import { useDao } from '../contexts/DaoContext';

// TODO: get overview and member from somewhere
const CcoClaim = ({ setClaimComplete }) => {
  const { daoMember } = useDaoMember();
  const { daoOverview } = useDao();
  const [loading, setLoading] = useState(false);
  const [canRage, setCanRage] = useState(false);
  const { address, injectedProvider } = useInjectedProvider();
  const { daochain, daoid } = useParams();
  const { cachePoll, resolvePoll } = useUser();
  const {
    errorToast,
    successToast,
    setGenericModal,
    setTxInfoModal,
  } = useOverlay();
  const { refreshDao } = useTX();

  useEffect(() => {
    const getCanRage = async () => {
      if (daoMember?.highestIndexYesVote?.proposalIndex) {
        const localCanRage = await MolochService({
          daoAddress: daoid,
          version: daoOverview.version,
          chainID: daochain,
        })('canRagequit')(daoMember?.highestIndexYesVote?.proposalIndex);
        setCanRage(localCanRage);
      } else {
        setCanRage(true);
      }
    };
    getCanRage();
  }, [address]);

  const handleClaim = async () => {
    const now = (new Date().getTime() / 1000).toFixed();
    setLoading(true);
    const args = [daoMember.shares, daoMember.loot];

    console.log('args', args);

    try {
      const poll = createPoll({ action: 'ragequitClaim', cachePoll })({
        chainID: daochain,
        molochAddress: daoid,
        createdAt: now,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: 'There was an error.',
            });
            resolvePoll(txHash);
            console.error(`poll error: ${error}`);
            setLoading(false);
          },
          onSuccess: txHash => {
            successToast({
              title: 'Claim submitted.',
            });

            refreshDao();
            resolvePoll(txHash);
            setLoading(false);
            setClaimComplete(true);
          },
        },
      });
      const onTxHash = () => {
        setGenericModal({});
        setTxInfoModal(true);
      };
      await MolochService({
        web3: injectedProvider,
        daoAddress: daoid,
        version: daoOverview.version,
        chainID: daochain,
      })('ragequit')({
        args,
        address,
        poll,
        onTxHash,
      });
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const hasSharesOrLoot = +daoMember?.loot > 0 || +daoMember?.shares > 0;

  if (!daoMember || !hasSharesOrLoot) {
    return null;
  }

  return canRage ? (
    <Box>
      <Button
        type='submit'
        loadingText='Submitting'
        isLoading={loading}
        disabled={loading}
        onClick={handleClaim}
        variant='primary'
      >
        CLAIM
      </Button>
    </Box>
  ) : (
    <Text fontSize='xs'>
      Sorry you cannot claim at this time. You have a &apos;Yes&apos; vote on a
      pending proposal. All proposals with a &apos;Yes&apos; vote must be
      completed and processed before you can rage.
    </Text>
  );
};

export default CcoClaim;
