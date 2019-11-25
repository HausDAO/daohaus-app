import React, { Fragment, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';

import { ethToWei } from '@netgum/utils'; // returns BN

import { GET_PROPOSAL_QUERY } from '../../utils/ProposalService';
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
          .estimateAccountTransaction(
            daoService.contract.options.address,
            bnZed,
            data,
          )
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
                props.history.push('/proposals');
              })
              .catch((err) => {
                console.log('catch', err);
                setTxLoading(false);
              });
          })
          .catch(console.error);
      });
  };

  const submitVote = (proposal, vote) => {
    const sdk = currentUser.sdk;
    const bnZed = ethToWei(0);

    if (currentWallet.shares) {
      setTxLoading(true);
      daoService
        .submitVote(
          currentUser.attributes['custom:account_address'],
          proposal.id,
          vote,
          true,
        )
        .then((data) => {
          sdk
            .estimateAccountTransaction(
              daoService.contract.options.address,
              bnZed,
              data,
            )
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
                      proposal.id
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

  return (
    <Query
      query={GET_PROPOSAL_QUERY}
      variables={{ id: `${daoService.contract.options.address.toLowerCase()}-${id}` }}
      
    >
      {({ loading, error, data }) => {
        if (loading) return <Loading />;
        if (error) return <ErrorMessage message={error} />;
        console.log('data', data, `${daoService.contract.options.address.toLowerCase()}-${id}`);
        
        return (
          <Fragment>
            {txLoading && <Loading />}
            <ProposalDetail
              submitVote={submitVote}
              processProposal={processProposal}
              proposal={data.proposal}
            />
          </Fragment>
        );
      }}
    </Query>
  );
};

export default withRouter(Proposal);
