import React from 'react';
import { Text } from '@chakra-ui/core';

import { useTheme } from '../../contexts/PokemolContext';
import ActivityFeedList from '../ActivityFeed/ActivityFeedList';

const DaoActivityFeed = ({ dao }) => {
  const [theme] = useTheme();
  // const [activities, setActivities] = useState([]);
  const proposalActivities = [
    {
      id: 1,
      molochAddress: dao.address,
      proposalId: 1,
      proposalType: 'funding',
      daoTitle: 'QuickDao',
      yesVotes: 5,
      noVotes: 3,
      activityFeed: {
        message: 'new proposal',
      },
    },
  ];

  // useEffect(() => {
  //   if (proposals) {
  //     const proposalActivities = proposals.map((proposal) => {
  //       return { ...proposal, daoTitle: dao.title };
  //     });

  //     setActivities(
  //       proposalActivities.sort((a, b) => +b.createdAt - +a.createdAt),
  //     );
  //   }
  // }, [proposals]);

  return (
    <>
      <Text
        mt={6}
        ml={6}
        textTransform='uppercase'
        fontSize='sm'
        fontFamily={theme.fonts.heading}
      >
        Activity Feed
      </Text>
      <ActivityFeedList activities={proposalActivities} />
    </>
  );
};

export default DaoActivityFeed;
