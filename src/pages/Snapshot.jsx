import React, { useEffect, useState } from 'react';
import { RiAddFill } from 'react-icons/ri';
import { Flex, Stack, Button, Link, Spinner, Input } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useOverlay } from '../contexts/OverlayContext';
import BoostNotActive from '../components/boostNotActive';
import MainViewLayout from '../components/mainViewLayout';
import SnapshotCard from '../components/snapshotCard';
import TextBox from '../components/TextBox';
import { getSnapshotProposals } from '../utils/requests';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { boostPost } from '../utils/metadata';

const Snapshot = ({ isMember, daoMetaData, refetchMetaData }) => {
  const [loading, setLoading] = useState(true);
  const [snapshots, setSnapshots] = useState({});
  const { errorToast, successToast } = useOverlay();
  const { injectedProvider, injectedChain, address } = useInjectedProvider();
  const { daoid } = useParams();
  const [localMetadata, setLocalMetadata] = useState();
  const [spaceName, setSpaceName] = useState('');

  useEffect(() => {
    console.log('Space');
    console.log(daoMetaData?.boosts?.SNAPSHOT.metadata.space);
    const getSnaphots = async () => {
      try {
        const localSnapshots = await getSnapshotProposals(
          // daoMetaData?.boosts?.snapshot.metadata.space,
          daoMetaData?.boosts?.SNAPSHOT.metadata.space,
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
      // 'snapshot' in daoMetaData?.boosts &&
      // daoMetaData?.boosts?.snapshot.active
      'SNAPSHOT' in daoMetaData?.boosts &&
      daoMetaData?.boosts?.SNAPSHOT.active
    ) {
      getSnaphots();
    }
  }, [daoMetaData?.boosts]);

  useEffect(() => {
    if (daoMetaData?.boosts?.SNAPSHOT?.active) {
      setLocalMetadata(daoMetaData.boosts.SNAPSHOT.metadata);
      setSpaceName(daoMetaData.boosts.SNAPSHOT.metadata.space);
    }
  }, [daoMetaData]);

  const onChange = e => {
    setSpaceName(e.target.value);
  };

  const handleSave = async () => {
    // Has to be a valid id
    setLoading(true);
    getSpace;
    try {
      const messageHash = injectedProvider.utils.sha3(daoid);
      const signature = await injectedProvider.eth.personal.sign(
        messageHash,
        address,
      );

      const updatedBoost = {
        contractAddress: daoid,
        boostKey: 'SNAPSHOt',
        metadata: localMetadata,
        network: injectedChain.network,
        signature,
      };

      const updateRes = await boostPost('dao/boost', updatedBoost);
      console.log('updateRes', updateRes);
      setLoading(false);
      refetchMetaData();
      successToast({
        title: 'Snapshot Settings Updated',
        description: 'You DAOd it!',
      });
    } catch (err) {
      console.log('update error', err);
      setLoading(false);
      errorToast({
        title: 'Something went wrong',
        description: 'Are you an active member of this DAO?',
      });
    }
  };

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
      <Flex justify='flex-start' align='center'>
        <Input
          maxW='15rem'
          mr='1rem'
          key={name}
          id={name}
          name={name}
          onChange={onChange}
          defaultValue={spaceName}
        />
        <Button mr='2.5%' onClick={() => handleSave()}>
          Save Changes
        </Button>
      </Flex>

      <Flex as={Stack} direction='column' spacing={4} w='100%'>
        {!loading ? (
          // daoMetaData && 'snapshot' in daoMetaData?.boosts ? (
          daoMetaData && 'SNAPSHOT' in daoMetaData?.boosts ? (
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
