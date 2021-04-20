import React, { useEffect, useState } from 'react';
import {
  Flex, Stack, Button, Link, Spinner,
} from '@chakra-ui/react';
import { RiAddFill } from 'react-icons/ri';
import MainViewLayout from '../components/mainViewLayout';
import SnapshotCard from '../components/snapshotCard';
import { getSnapshotProposals } from '../utils/requests';
import BoostNotActive from '../components/boostNotActive';

const Snapshot = ({ isMember, daoMetaData }) => {
  const [loading, setLoading] = useState(true);
  const [snapshots, setSnapshots] = useState({});

  useEffect(() => {
    const getSnaphots = async () => {
      const localSnapshots = await getSnapshotProposals(daoMetaData?.boosts?.snapshot.metadata.space);
      setSnapshots(localSnapshots);
      setLoading(false);
    };
    if (daoMetaData && 'snapshot' in daoMetaData?.boosts && daoMetaData?.boosts?.snapshot.active) {
      getSnaphots();
    }
  }, [daoMetaData?.boosts]);

  const newSnapshotButton = isMember && (
    <Button
      as={Link}
      href={`https://snapshot.org/#/${daoMetaData?.boosts?.snapshot?.metadata?.space}/create`}
      rightIcon={<RiAddFill />}
      isExternal
    >
      New Snapshot
    </Button>
  );

  return (
    <MainViewLayout header='Snapshots' headerEl={Object.keys(snapshots).length > 0 && newSnapshotButton} isDao>
      <Flex as={Stack} direction='column' spacing={4}>
        {!loading ? (
          Object.keys(snapshots).length > 0
            ? Object.keys(snapshots).map((snapshot) => (
              <SnapshotCard
                key={snapshots[snapshot].sig}
                snapshotId={snapshot}
                snapshot={snapshots[snapshot]}
              />
            )) : (
              <BoostNotActive />
            )) : (
              <Spinner size='xl' />
        )}
      </Flex>
    </MainViewLayout>
  );
};

export default Snapshot;
