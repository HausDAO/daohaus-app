import React, { useEffect, useState } from 'react';
import { Flex, Stack, Button, Link } from '@chakra-ui/react';
import { RiAddFill } from 'react-icons/ri';
import MainViewLayout from '../components/mainViewLayout';
import SnapshotCard from '../components/snapshotCard';
import { getSnapshotProposals } from '../utils/requests';

const Snapshot = ({ isMember }) => {
  const [snapshots, setSnapshots] = useState({});
  // get space from boost metadata
  const space = 'raid-guild';

  useEffect(() => {
    const getSnaphots = async () => {
      const localSnapshots = await getSnapshotProposals(space);
      setSnapshots(localSnapshots);
    };
    getSnaphots();
  }, []);

  const newSnapshotButton = isMember && (
    <Button
      as={Link}
      href={`https://snapshot.org/#/${space}/create`}
      rightIcon={<RiAddFill />}
      isExternal
    >
      New Snapshot
    </Button>
  );

  return (
    <MainViewLayout header='Snapshots' headerEl={newSnapshotButton} isDao>
      <Flex as={Stack} direction='column' spacing={4}>
        {Object.keys(snapshots).length > 0 &&
          Object.keys(snapshots).map((snapshot) => (
            <SnapshotCard
              key={snapshots[snapshot].sig}
              snapshotId={snapshot}
              snapshot={snapshots[snapshot]}
            />
          ))}
      </Flex>
    </MainViewLayout>
  );
};

export default Snapshot;
