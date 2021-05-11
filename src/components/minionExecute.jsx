import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Flex, Spinner } from '@chakra-ui/react';

import { useUser } from '../contexts/UserContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useTX } from '../contexts/TXContext';
import ApproveUberHausToken from './approveUberHausToken';
import { createPoll } from '../services/pollService';
import { MinionService } from '../services/minionService';
import { SuperfluidMinionService } from '../services/superfluidMinionService';
import { TokenService } from '../services/tokenService';
import { UberHausMinionService } from '../services/uberHausMinionService';
import { PROPOSAL_TYPES } from '../utils/proposalUtils';
import { UBERHAUS_DATA } from '../utils/uberhaus';

const MinionExecute = ({ proposal }) => {
  const { daochain } = useParams();
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
  const [minionDetails, setMinionDetails] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(true);
  const [needsHausApproval, setNeedsHausApproval] = useState(false);
  const [minionBalance, setMinionBalance] = useState(null);

  useEffect(() => {
    const getMinionDetails = async () => {
      setLoading(true);
      try {
        if (proposal.proposalType === PROPOSAL_TYPES.MINION_VANILLA) {
          const action = await MinionService({
            minion: proposal?.minionAddress,
            chainID: daochain,
          })('getAction')({ proposalId: proposal?.proposalId });
          setMinionDetails(action);
          setShouldFetch(false);
          setLoading(false);
        } else if (proposal.proposalType === PROPOSAL_TYPES.MINION_SUPERFLUID) {
          const action = await SuperfluidMinionService({
            minion: proposal?.minionAddress,
            chainID: daochain,
          })('getStream')({ proposalId: proposal?.proposalId });
          setMinionDetails(action);
          setShouldFetch(false);
          setLoading(false);
        } else if (
          proposal.proposalType === PROPOSAL_TYPES.MINION_UBER_STAKE ||
          proposal.proposalType === PROPOSAL_TYPES.MINION_UBER_RQ
        ) {
          const action = await UberHausMinionService({
            uberHausMinion: proposal.minionAddress,
            chainID: daochain,
          })('getAction')({ proposalId: proposal?.proposalId });

          console.log(
            proposal.proposalType === PROPOSAL_TYPES.MINION_UBER_STAKE,
          );

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
        } else if (proposal.proposalType === PROPOSAL_TYPES.MINION_UBER_DEL) {
          const action = await UberHausMinionService({
            uberHausMinion: proposal.minionAddress,
            chainID: daochain,
          })('getAppointment')({ proposalId: proposal?.proposalId });
          setShouldFetch(false);
          setMinionDetails(action);
          setLoading(false);
        }
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

  const executeMinion = async () => {
    if (!proposal?.minion) return;

    setLoading(true);
    const args = [proposal.proposalId];
    try {
      const poll = createPoll({ action: 'minionExecuteAction', cachePoll })({
        minionAddress: proposal.minionAddress,
        chainID: daochain,
        proposalId: proposal.proposalId,
        proposalType: proposal?.proposalType,
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
              title: 'Minion action executed.',
            });
            resolvePoll(txHash);
            setShouldFetch(true);
            refreshDao();
          },
        },
      });
      const onTxHash = () => {
        setProposalModal(false);
        setTxInfoModal(true);
      };
      if (proposal.proposalType === PROPOSAL_TYPES.MINION_VANILLA) {
        await MinionService({
          web3: injectedProvider,
          minion: proposal.minionAddress,
          chainID: daochain,
        })('executeAction')({
          args,
          address,
          poll,
          onTxHash,
        });
      } else if (proposal.proposalType === PROPOSAL_TYPES.MINION_SUPERFLUID) {
        await SuperfluidMinionService({
          web3: injectedProvider,
          minion: proposal.minionAddress,
          chainID: daochain,
        })('executeAction')({
          args,
          address,
          poll,
          onTxHash,
        });
      } else if (
        proposal.proposalType === PROPOSAL_TYPES.MINION_UBER_STAKE ||
        proposal.proposalType === PROPOSAL_TYPES.MINION_UBER_RQ
      ) {
        await UberHausMinionService({
          web3: injectedProvider,
          uberHausMinion: proposal.minionAddress,
          chainID: daochain,
        })('executeAction')({
          args,
          address,
          poll,
          onTxHash,
        });
      } else if (proposal.proposalType === PROPOSAL_TYPES.MINION_UBER_DEL) {
        await UberHausMinionService({
          web3: injectedProvider,
          uberHausMinion: proposal.minionAddress,
          chainID: daochain,
        })('executeAppointment')({
          args,
          address,
          poll,
          onTxHash,
        });
      } else {
        console.error('Could not find minion type');
      }
    } catch (err) {
      console.log('error: ', err);
      setLoading(false);
    }
  };


  const isCorrectChain =
    daochain === injectedProvider?.currentProvider?.chainId;

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
          <Button onClick={executeMinion} mb={4} disabled={!isCorrectChain}>
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
      <Button onClick={executeMinion} disabled={!isCorrectChain}>
        Execute Minion
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
