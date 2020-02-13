import React, { useContext, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { GET_PROPOSALS, GET_PROPOSALS_LEGACY } from '../../utils/Queries';
import { GET_PROPOSALS_V2 } from '../../utils/QueriesV2';

import ProposalFilter from '../../components/proposal/ProposalFilter';
import ErrorMessage from '../../components/shared/ErrorMessage';
import BottomNav from '../../components/shared/BottomNav';
import Loading from '../../components/shared/Loading';
import {
  CurrentWalletContext,
  DaoServiceContext,
  DaoDataContext,
} from '../../contexts/Store';
import StateModals from '../../components/shared/StateModals';

const Proposals = ({ match, history }) => {
  const [currentWallet] = useContext(CurrentWalletContext);
  const [daoService] = useContext(DaoServiceContext);
  const [daoData] = useContext(DaoDataContext);

  let proposalQuery, options;

  if (daoData.isLegacy || daoData.version === 2) {
    proposalQuery = daoData.isLegacy ? GET_PROPOSALS_LEGACY : GET_PROPOSALS_V2;
    options = {
      client: daoData.altClient,
      variables: daoData.isLegacy
        ? {}
        : { contractAddr: daoService.daoAddress.toLowerCase() },
      pollInterval: 20000,
    };
  } else {
    // if (daoData.version === 2) {
    //   console.log('v2 querying', daoData.altClient);
    //   proposalQuery = GET_PROPOSALS_V2;
    //   console.log('proposalQuery', proposalQuery);
    //   options = {
    //     client: daoData.altClient,
    //     variables: {
    //       contractAddr: daoService.daoAddress.toLowerCase(),
    //     },
    //     pollInterval: 20000,
    //   };
    // } else {
    proposalQuery = GET_PROPOSALS;
    options = {
      variables: { contractAddr: daoService.daoAddress.toLowerCase() },
      pollInterval: 20000,
    };
    // }
  }

  const { loading, error, data, fetchMore } = useQuery(proposalQuery, options);

  console.log('data', data);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  fetchMore({
    variables: { skip: data.proposals.length },
    updateQuery: (prev, { fetchMoreResult }) => {
      if (!fetchMoreResult) return;
      return Object.assign({}, prev, {
        proposals: [...prev.proposals, ...fetchMoreResult.proposals],
      });
    },
  });

  return (
    <Fragment>
      <StateModals />

      <div className="View">
        <div className="Row Pad">
          <h3>Proposals</h3>
          {currentWallet.shares ? (
            <div>
              <p>
                <Link
                  to={`/dao/${daoService.daoAddress}/proposal-new`}
                  className="Bold"
                >
                  <svg
                    className="IconLeft"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path fill="none" d="M0 0h24v24H0V0z" />
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                  New Proposal
                </Link>
              </p>
            </div>
          ) : null}
        </div>
        <ProposalFilter
          proposals={data.proposals}
          filter={match.params.filter || 'na'}
          history={history}
        />
      </div>
      <BottomNav />
    </Fragment>
  );
};

export default Proposals;
