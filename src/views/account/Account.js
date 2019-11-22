import React from 'react';
import UserWallet from '../../components/account/UserWallet';
import BottomNav from '../../components/shared/BottomNav';

const Account = ({ history }) => (
  <div className="View">
    <UserWallet history={history} />
    <BottomNav />
  </div>
);

export default Account;
