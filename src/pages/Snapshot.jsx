import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { RiAddFill } from 'react-icons/ri';
import { Flex, Stack, Button, Link, Spinner } from '@chakra-ui/react';

import { useOverlay } from '../contexts/OverlayContext';
import BoostNotActive from '../components/boostNotActive';
import MainViewLayout from '../components/mainViewLayout';
import SnapshotCard from '../components/snapshotCard';
import TextBox from '../components/TextBox';
import { getSnapshotProposals } from '../utils/theGraph';

const Snapshot = ({ isMember, daoMetaData }) => {
  const { daoid, daochain } = useParams();
  const [loading, setLoading] = useState(true);
  const [snapshots, setSnapshots] = useState({});
  const { errorToast } = useOverlay();

  useEffect(() => {
    const getSnaphots = async () => {
      try {
        const localSnapshots = await getSnapshotProposals(
          // daoMetaData?.boosts?.snapshot.metadata.space,
          daoMetaData?.boosts?.SNAPSHOT.metadata.space,
        );
        setSnapshots(localSnapshots.proposals);
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
      // 'snapshot' in daoMetaData?.boosts &&
      // daoMetaData?.boosts?.snapshot.active
      'SNAPSHOT' in daoMetaData?.boosts &&
      daoMetaData?.boosts?.SNAPSHOT.active
    ) {
      getSnaphots();
    }
  }, [daoMetaData?.boosts]);

  const newSnapshotButton = isMember && (
    <Flex>
      <Button
        as={Link}
        href={`https://snapshot.org/#/${daoMetaData?.boosts?.SNAPSHOT?.metadata?.space}/create`}
        rightIcon={<RiAddFill />}
        isExternal
        mr={10}
      >
        New Snapshot
      </Button>

      <Button
        as={RouterLink}
        to={`/dao/${daochain}/${daoid}/boost/snapshot/settings`}
      >
        Boost Settings
      </Button>
    </Flex>
  );

  return (
    <MainViewLayout
      header='Snapshots'
      headerEl={Object.keys(snapshots).length > 0 && newSnapshotButton}
      isDao
    >
      <Flex as={Stack} direction='column' spacing={4} w='100%'>
        {!loading ? (
          // daoMetaData && 'snapshot' in daoMetaData?.boosts ? (
          daoMetaData && 'SNAPSHOT' in daoMetaData?.boosts ? (
            Object.keys(snapshots).length > 0 ? (
              Object.values(snapshots)
                .slice(0, 10)
                .map(snapshot => (
                  <SnapshotCard
                    key={snapshot.id}
                    snapshotId={snapshot.od}
                    snapshot={snapshot}
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
