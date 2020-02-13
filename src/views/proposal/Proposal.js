import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { ethToWei } from '@netgum/utils'; // returns BN

import { GET_PROPOSAL } from '../../utils/Queries';
import ProposalDetail from '../../components/proposal/ProposalDetail';
import ErrorMessage from '../../components/shared/ErrorMessage';
import Loading from '../../components/shared/Loading';
// import Web3Service from '../../utils/Web3Service';
// import { BcProcessorService } from '../../utils/BcProcessorService';

import {
  LoaderContext,
  CurrentWalletContext,
  // CurrentUserContext,
  DaoServiceContext,
  DaoDataContext,
} from '../../contexts/Store';

const Proposal = (props) => {
  const id = props.match.params.id;
  const [txLoading, setTxLoading] = useContext(LoaderContext);
  const [currentWallet] = useContext(CurrentWalletContext);
  const [daoService] = useContext(DaoServiceContext);
  const [daoData] = useContext(DaoDataContext);

  let options;

  if (daoData.isLegacy) {
    options = {
      client: daoData.altClient,
      variables: { id },
    };
  } else {
    options = {
      variables: { id: `${daoService.daoAddress.toLowerCase()}-${id}` },
    };
  }

  const { loading, error, data } = useQuery(GET_PROPOSAL, options);

  const processProposal = async (id) => {
    setTxLoading(true);
    try {
      await daoService.mcDao.processProposal(id, ethToWei(currentWallet.eth));
      props.history.push(`/dao/${daoService.daoAddress}/proposals`);
    } catch (e) {
      console.error(`Error processing proposal: ${e.toString()}`);
    } finally {
      setTxLoading(false);
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
