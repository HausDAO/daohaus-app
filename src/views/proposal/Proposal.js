import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { GET_PROPOSAL } from '../../utils/Queries';
import ProposalDetail from '../../components/proposal/ProposalDetail';
import ErrorMessage from '../../components/shared/ErrorMessage';
import Loading from '../../components/shared/Loading';

import {
  LoaderContext,
  CurrentWalletContext,
  DaoServiceContext,
  CurrentUserContext,
} from '../../contexts/Store';

const Proposal = (props) => {
  const id = props.match.params.id;
  const [txLoading, setTxLoading] = useContext(LoaderContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
  const [daoService] = useContext(DaoServiceContext);

  const txCallBack = (txHash, name) => {
    if (currentUser?.txProcessor) {
      currentUser.txProcessor.setTx(
        txHash,
        currentUser.username,
        name,
        true,
        false,
      );
      currentUser.txProcessor.pendingCount += 1;
      setCurrentUser({ ...currentUser });
    }
  };

  const { loading, error, data, refetch } = useQuery(GET_PROPOSAL, {
    variables: { id: `${daoService.daoAddress.toLowerCase()}-proposal-${id}` },
  });

  const processProposal = async (proposal) => {
    setTxLoading(true);
    try {
      if (proposal.whitelist) {
        await daoService.mcDao.processWhitelistProposal(
          proposal.proposalIndex,
          txCallBack,
        );
      } else if (proposal.guildkick) {
        console.log('guildkick process');

        await daoService.mcDao.processGuildKickProposal(
          proposal.proposalIndex,
          txCallBack,
        );
      } else {
        await daoService.mcDao.processProposal(
          proposal.proposalIndex,
          txCallBack,
        );
      }
    } catch (e) {
      console.error(`Error processing proposal: ${e.toString()}`);
    } finally {
      console.log('finally');
      refetch();
      setTxLoading(false);
      props.history.push(
        `/dao/${daoService.daoAddress}/success?action=processed`,
      );
    }
  };

  const submitVote = async (proposal, vote) => {
    if (!currentWallet.shares) {
      alert(`You must have valid DAO shares to vote.`);
      return;
    }
    setTxLoading(true);
    try {
      await daoService.mcDao.submitVote(
        proposal.proposalIndex,
        vote,
        txCallBack,
      );
    } catch (e) {
      console.error(`Error processing proposal: ${e.toString()}`);
    } finally {
      refetch();
      setTxLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      {txLoading ? (
        <Loading />
      ) : (
        <ProposalDetail
          submitVote={submitVote}
          processProposal={processProposal}
          proposal={data.proposal}
        />
      )}
    </>
  );
};

export default withRouter(Proposal);
