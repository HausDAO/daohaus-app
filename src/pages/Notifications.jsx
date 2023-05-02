import React from 'react';

import MainViewLayout from '../components/mainViewLayout';
import DisableNotice from '../components/disableNotice';

const Notifications = () => {
  return (
    <MainViewLayout header='Notifications' isDao>
      <DisableNotice subhead='Contact us to in the DAOhaus discord server to turn off the bot' />
    </MainViewLayout>
  );
};

export default Notifications;
