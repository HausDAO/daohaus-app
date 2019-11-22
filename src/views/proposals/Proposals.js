import React, { useContext, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';

import { GET_PROPOSALS_QUERY } from '../../utils/ProposalService';
import ProposalFilter from '../../components/proposal/ProposalFilter';
import ErrorMessage from '../../components/shared/ErrorMessage';
import BottomNav from '../../components/shared/BottomNav';
import Loading from '../../components/shared/Loading';
import { CurrentWalletContext } from '../../contexts/Store';
import StateModals from '../../components/shared/StateModals';

const Proposals = ({ match, history }) => {
  const [currentWallet] = useContext(CurrentWalletContext);

  return (
    <Fragment>
      <StateModals />

      <Query query={GET_PROPOSALS_QUERY} pollInterval={20000}>
        {({ loading, error, data }) => {
          if (loading) return <Loading />;
          if (error) return <ErrorMessage message={error} />;

          return (
            <div className="View">
              <div className="Row Pad">
                <h3>Proposals</h3>
                {currentWallet.shares ? (
                  <div>
                    <p>
                      <Link to="/proposal-new" className="Bold">
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
          );
        }}
      </Query>
      <BottomNav />
    </Fragment>
  );
};

export default Proposals;
