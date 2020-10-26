import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { Link } from 'react-router-dom';

import { formatCreatedAt } from '../../utils/Helpers';

const ActivityCard = ({ activity }) => {
  return (
    <div>
      <Link to={`/dao/${activity.molochAddress}`}>
        <div>
          <div
            style={{
              backgroundImage: `url("${makeBlockie(activity.molochAddress)}")`,
            }}
          >
            <p>{activity.daoTitle.substr(0, 1)}</p>
          </div>
          <p>{activity.daoTitle}</p>
        </div>

        {activity.proposalId ? (
          <>
            <h6>{`${activity.activityFeed.message} ${activity.proposalType}`}</h6>
            <h3>{activity.title}</h3>
            <p>{activity.description}</p>
          </>
        ) : (
          <>
            <h6>Rage Quit on {formatCreatedAt(activity.createdAt)}</h6>
            <p>Shares: {activity.shares}</p>
            <p>Loot: {activity.loot}</p>
            <p>memberAddress: {activity.memberAddress}</p>
          </>
        )}
      </Link>
    </div>
  );
};

export default ActivityCard;
