import React, { useContext } from 'react';

import { CurrentUserContext } from '../../contexts/Store';
import ProposalForm from '../../components/proposal/ProposalForm';
import { FormContainer } from '../../App.styles';

const ProposalNew = () => {
  const [currentUser] = useContext(CurrentUserContext);

  return (
    <>
      {currentUser ? (
        <FormContainer>
          <h1>New Proposal</h1>
          <ProposalForm />
        </FormContainer>
      ) : (
        <FormContainer>
          <p>:/ You need to sign in.</p>
        </FormContainer>
      )}
    </>
  );
};

export default ProposalNew;
