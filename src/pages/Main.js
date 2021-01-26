import React from 'react';

import NewsFeed from '../components/newsFeed';
import NetworkList from '../components/networkList';

const Main = () => {
  return (
    <div>
      <NetworkList />
      <NewsFeed />
    </div>
  );
};

export default Main;
