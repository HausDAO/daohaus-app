import React, { Component } from 'react';
import ProposalForm from '../../components/proposal/ProposalForm';
import { Auth } from 'aws-amplify';

class ProposalNew extends Component {
  state = {
    user: null,
  };

  async componentDidMount() {
    const user = await Auth.currentAuthenticatedUser();

    this.setState({ user });
  }

  render() {
    const user = this.state.user;
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
  }
}

export default ProposalNew;
