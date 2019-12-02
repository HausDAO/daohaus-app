import React, { useContext, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import { GET_PROPOSALS_QUERY } from '../../utils/ProposalService';
import ProposalFilter from '../../components/proposal/ProposalFilter';
import ErrorMessage from '../../components/shared/ErrorMessage';
import BottomNav from '../../components/shared/BottomNav';
import Loading from '../../components/shared/Loading';
import { CurrentWalletContext, DaoContext } from '../../contexts/Store';
import StateModals from '../../components/shared/StateModals';

const Proposals = ({ match, history }) => {
  const [currentWallet] = useContext(CurrentWalletContext);
  const [daoService] = useContext(DaoContext);

  const { loading, error, data } = useQuery(GET_PROPOSALS_QUERY, {
    variables: { contractAddr: daoService.contractAddr.toLowerCase() },
    pollInterval: 20000,
  });

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

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
                  to={`/dao/${daoService.contractAddr}/proposal-new`}
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
