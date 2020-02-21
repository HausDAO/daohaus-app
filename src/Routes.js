import React from 'react';
import { Switch, Route } from 'react-router-dom';
import FourOhFour from './views/404/404';
import Home from './views/home/Home';
import Proposals from './views/proposals/Proposals';
import Proposal from './views/proposal/Proposal';
import ProposalNew from './views/proposal-new/ProposalNew';
import Members from './views/members/Members';
import Member from './views/member/Member';
import Account from './views/account/Account';
import SignUp from './views/auth/SignUp';
import SignIn from './views/auth/SignIn';
import Confirm from './views/auth/Confirm';
import SignOut from './views/auth/SignOut';
import ResendCode from './views/auth/ResendCode';
import InvalidRoute from './views/invalidRoute/InvalidRoute';
import ProposalEngine from './views/proposal-new-v2/ProposalEngine';
import NewMemberForm from './components/proposal-v2/NewMemberForm';
import FundingForm from './components/proposal-v2/FundingForm';

const Routes = (props) => {
  const { isValid } = props;

  return (
    <>
      {isValid ? (
        <Switch>
          <Route
            path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/"
            exact
            component={Home}
          />
          <Route
            path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/proposals"
            exact
            component={Proposals}
          />
          <Route
            path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/proposals/:filter"
            exact
            component={Proposals}
          />
          <Route
            path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/proposal/:id"
            exact
            component={Proposal}
          />
          <Route
            path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/proposal-new"
            exact
            component={ProposalNew}
          />
          <Route
            path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/proposal-engine"
            exact
            component={ProposalEngine}
          />
          <Route
            path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/proposal-member"
            exact
            component={NewMemberForm}
          />
          <Route
            path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/proposal-funding"
            exact
            component={FundingForm}
          />
          <Route
            path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/members"
            exact
            component={Members}
          />
          <Route
            path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/member/:id"
            exact
            component={Member}
          />
          <Route
            path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/account"
            exact
            component={Account}
          />
          <Route
            path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/sign-up"
            exact
            component={SignUp}
          />
          <Route
            path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/sign-in"
            exact
            component={SignIn}
          />
          <Route
            path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/sign-out"
            exact
            component={SignOut}
          />
          <Route
            path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/confirm"
            exact
            component={Confirm}
          />
          <Route
            path="/dao/:dao(\b0x[0-9a-f]{10,40}\b)/resend-code"
            exact
            component={ResendCode}
          />
          <Route path="*" component={FourOhFour} />
        </Switch>
      ) : (
        <Switch>
          <Route path="*" component={InvalidRoute} />
        </Switch>
      )}
    </>
  );
};

export default Routes;
