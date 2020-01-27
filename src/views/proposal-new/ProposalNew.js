import React, { useContext } from 'react';

import { CurrentUserContext } from '../../contexts/Store';
import ProposalForm from '../../components/proposal/ProposalForm';

const ProposalNew = () => {
  const [currentUser] = useContext(CurrentUserContext);

  const user = currentUser;
  return (
    <div>
      {user ? (
        <div>
          <h1 className="Pad">New Proposal</h1>
          <ProposalForm />
        </div>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
};

export default ProposalNew;
