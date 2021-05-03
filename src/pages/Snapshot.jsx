import React, { useEffect, useState } from 'react';
import { Flex, Stack, Button, Link, Spinner } from '@chakra-ui/react';
import { RiAddFill } from 'react-icons/ri';
import MainViewLayout from '../components/mainViewLayout';
import SnapshotCard from '../components/snapshotCard';
import { getSnapshotProposals } from '../utils/requests';
import BoostNotActive from '../components/boostNotActive';
import TextBox from '../components/TextBox';
import { useOverlay } from '../contexts/OverlayContext';

const Snapshot = ({ isMember, daoMetaData }) => {
  const [loading, setLoading] = useState(true);
  const [snapshots, setSnapshots] = useState({});
  const { errorToast } = useOverlay();

  useEffect(() => {
    const getSnaphots = async () => {
      try {
        const localSnapshots = await getSnapshotProposals(
          daoMetaData?.boosts?.snapshot.metadata.space,
        );
        setSnapshots(localSnapshots);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        errorToast({
          title: 'Fetching snapshot proposals failed.',
        });
      }
    };
    if (
      daoMetaData &&
      'snapshot' in daoMetaData?.boosts &&
      daoMetaData?.boosts?.snapshot.active
    ) {
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
    <MainViewLayout
      header='Snapshots'
      headerEl={Object.keys(snapshots).length > 0 && newSnapshotButton}
      isDao
    >
      <Flex as={Stack} direction='column' spacing={4} w='100%'>
        {!loading ? (
          daoMetaData && 'snapshot' in daoMetaData?.boosts ? (
            Object.keys(snapshots).length > 0 ? (
              Object.keys(snapshots)
                .slice(0, 10)
                .map(snapshot => (
                  <SnapshotCard
                    key={snapshots[snapshot].sig}
                    snapshotId={snapshot}
                    snapshot={snapshots[snapshot]}
                  />
                ))
            ) : (
              <Flex mt='100px' w='100%' justify='center'>
                <TextBox variant='value' size='lg'>
                  No Proposals Found. Get started by creating your first
                  snapshot!
                </TextBox>
              </Flex>
            )
          ) : (
            <BoostNotActive />
          )
        ) : (
          <Spinner size='xl' />
        )}
      </Flex>
    </MainViewLayout>
  );
};

export default Snapshot;
