import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { ethToWei } from '@netgum/utils'; // returns BN

import { GET_PROPOSAL_QUERY } from '../../utils/Queries';
import ProposalDetail from '../../components/proposal/ProposalDetail';
import ErrorMessage from '../../components/shared/ErrorMessage';
import Loading from '../../components/shared/Loading';
import Web3Service from '../../utils/Web3Service';
import BcProcessorService from '../../utils/BcProcessorService';

import {
  LoaderContext,
  CurrentWalletContext,
  CurrentUserContext,
  DaoContext,
} from '../../contexts/Store';

const Proposal = (props) => {
  const id = props.match.params.id;
  const [txLoading, setTxLoading] = useContext(LoaderContext);
  const [currentUser] = useContext(CurrentUserContext);
  const [currentWallet] = useContext(CurrentWalletContext);

  const [daoService] = useContext(DaoContext);
  const web3Service = new Web3Service();
  const bcprocessor = new BcProcessorService();

  const { loading, error, data } = useQuery(GET_PROPOSAL_QUERY, {
    variables: { id: `${daoService.contractAddr.toLowerCase()}-${id}` },
  });

  const processProposal = (id) => {
    const sdk = currentUser.sdk;
    const bnZed = ethToWei(0);

    setTxLoading(true);
    daoService
      .processProposal(
        currentUser.attributes['custom:account_address'],
        id,
        true,
      )
      .then((data) => {
        sdk
          .estimateAccountTransaction(daoService.contractAddr, bnZed, data)
          .then((estimated) => {
            if (ethToWei(currentWallet.eth).lt(estimated.totalCost)) {
              alert(
                `you need more gas, at least: ${web3Service.fromWei(
                  estimated.totalCost.toString(),
                )}`,
              );

              return false;
            }
            sdk
              .submitAccountTransaction(estimated)
              .then((hash) => {
                bcprocessor.setTx(
                  hash,
                  currentUser.attributes['custom:account_address'],
                  `Proccess proposal. id: ${id}`,
                  true,
                );

                setTxLoading(false);
                props.history.push(`/dao/${daoService.contractAddr}/proposals`);
              })
              .catch((err) => {
                console.log('catch', err);
                setTxLoading(false);
              });
          })
          .catch((err) => {
            setTxLoading(false);
            alert('Something went wrong, must process in order submitted');
            console.log(err);
          });
      });
  };

  const submitVote = (proposal, vote) => {
    const sdk = currentUser.sdk;
    const bnZed = ethToWei(0);

    if (
      proposal.votes.some(
        (_vote) =>
          _vote.memberAddress.toLowerCase() ===
          currentWallet.addrByBelegateKey.toLowerCase(),
      )
    ) {
      return false;
    }

    if (currentWallet.shares && proposal.status === 'VotingPeriod') {
      setTxLoading(true);
      daoService
        .submitVote(
          currentUser.attributes['custom:account_address'],
          proposal.id.split('-')[1],
          vote,
          true,
        )
        .then((data) => {
          sdk
            .estimateAccountTransaction(daoService.contractAddr, bnZed, data)
            .then((estimated) => {
              if (ethToWei(currentWallet.eth).lt(estimated.totalCost)) {
                alert(
                  `you need more gas, at least: ${web3Service.fromWei(
                    estimated.totalCost.toString(),
                  )}`,
                );

                return false;
              }
              sdk
                .submitAccountTransaction(estimated)
                .then((hash) => {
                  bcprocessor.setTx(
                    hash,
                    currentUser.attributes['custom:account_address'],
                    `Submit ${vote === 1 ? 'yes' : 'no'} vote on proposal ${
                      proposal.id.split('-')[1]
                    }`,
                    true,
                  );

                  setTxLoading(false);
                })
                .catch((err) => {
                  console.log('catch', err);
                  setTxLoading(false);
                });
            })
            .catch(console.error);
        });
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
