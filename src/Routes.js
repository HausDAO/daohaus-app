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

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/proposals" exact component={Proposals} />
    <Route path="/proposals/:filter" exact component={Proposals} />
    <Route path="/proposal/:id" exact component={Proposal} />
    <Route path="/proposal-new" exact component={ProposalNew} />
    <Route path="/members" exact component={Members} />
    <Route path="/member/:id" exact component={Member} />
    <Route path="/account" exact component={Account} />
    <Route path="/sign-up" exact component={SignUp} />
    <Route path="/sign-in" exact component={SignIn} />
    <Route path="/sign-out" exact component={SignOut} />
    <Route path="/confirm" exact component={Confirm} />
    <Route path="/resend-code" exact component={ResendCode} />
    <Route path="*" component={FourOhFour} />
  </Switch>
);

export default Routes;
