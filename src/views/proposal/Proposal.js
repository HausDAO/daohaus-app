import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { ethToWei } from '@netgum/utils'; // returns BN

import { GET_PROPOSAL_SUPER } from '../../utils/QueriesSuper';
import ProposalDetail from '../../components/proposal/ProposalDetail';
import ErrorMessage from '../../components/shared/ErrorMessage';
import Loading from '../../components/shared/Loading';

import {
  LoaderContext,
  CurrentWalletContext,
  DaoServiceContext,
} from '../../contexts/Store';

const Proposal = (props) => {
  const id = props.match.params.id;
  const [txLoading, setTxLoading] = useContext(LoaderContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [daoService] = useContext(DaoServiceContext);

  const { loading, error, data } = useQuery(GET_PROPOSAL_SUPER, {
    variables: { id: `${daoService.daoAddress.toLowerCase()}-proposal-${id}` },
  });

  const processProposal = async (proposal) => {
    setTxLoading(true);
    try {
      if (proposal.whitelist) {
        await daoService.mcDao.processWhitelistProposal(proposal.proposalIndex);
      } else if (proposal.guildkick) {
        console.log('guildkick process');

        await daoService.mcDao.processGuildKickProposal(proposal.proposalIndex);
      } else {
        await daoService.mcDao.processProposal(proposal.proposalIndex);
      }
    } catch (e) {
      console.error(`Error processing proposal: ${e.toString()}`);
    } finally {
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
        ethToWei(currentWallet.eth),
      );
    } catch (e) {
      console.error(`Error processing proposal: ${e.toString()}`);
    } finally {
      setTxLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      {txLoading && <Loading />}
      <ProposalDetail
        submitVote={submitVote}
        processProposal={processProposal}
        proposal={data.proposal}
      />
    </>
  );
};

export default withRouter(Proposal);
