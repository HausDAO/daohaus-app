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

const Routes = (props) => {
  const {isValid} = props;
  console.log('isValid', isValid);
  
  return (
  <Switch>
    {isValid ? (
      <>
    <Route path="/:dao/" exact component={Home} />
    <Route path="/:dao/proposals" exact component={Proposals} />
    <Route path="/:dao/proposals/:filter" exact component={Proposals} />
    <Route path="/:dao/proposal/:id" exact component={Proposal} />
    <Route path="/:dao/proposal-new" exact component={ProposalNew} />
    <Route path="/:dao/members" exact component={Members} />
    <Route path="/:dao/member/:id" exact component={Member} />
    <Route path="/:dao/account" exact component={Account} />
    <Route path="/:dao/sign-up" exact component={SignUp} />
    <Route path="/:dao/sign-in" exact component={SignIn} />
    <Route path="/:dao/sign-out" exact component={SignOut} />
    <Route path="/:dao/confirm" exact component={Confirm} />
    <Route path="/:dao/resend-code" exact component={ResendCode} />
    {/* <Route path="*" component={FourOhFour} /> */}
    </>
    ) : (
      <Route path="*" component={FourOhFour} />

    )}
  </Switch>
)
};

const DaoRoute = (props) => {
  const { component, path } = props;
  //This can pull from the store/daoContext to see if whitelisted
  console.log('path from dao route:', path);
  
  const isValidDao = true;

  return (
    <>
      {isValidDao ? (
        <Route path={path} component={component} />
      ) : (
        <Route path="*" component={FourOhFour} />
      )}
    </>
  );
};

export default Routes;
