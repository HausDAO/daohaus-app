import React, { useContext } from 'react';
import queryString from 'query-string';

import { Link } from 'react-router-dom';
import { DaoServiceContext } from '../../contexts/Store';
import BottomNav from '../../components/shared/BottomNav';

const Success = ({ location }) => {
  const [daoService] = useContext(DaoServiceContext);
  const action = queryString.parse(location.search).action;

  return (
    <>
      <div className="Block" style={{ textAlign: 'center' }}>
        <div className="Pad">
          <h2>Success 🤩</h2>
          {action ? (
            <p>
              Your proposal hase been {action} on chain. The update will show in
              the proposal details soon.
            </p>
          ) : (
            <p>
              Your proposal hase been submitted on chain. It will show up in the
              proposal list soon.
            </p>
          )}

          <Link to={`/dao/${daoService.daoAddress}/proposals`}>
            All Proposals
          </Link>
        </div>
      </div>
      <BottomNav />
    </>
  );
};

export default Success;
