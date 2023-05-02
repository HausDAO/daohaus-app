import React, { useEffect, useState } from 'react';
import { Flex, Button, FormLabel } from '@chakra-ui/react';
import { useParams, Link } from 'react-router-dom';
import TextBox from '../components/TextBox';

import MainViewLayout from '../components/mainViewLayout';

const SnapshotSettings = ({ daoMetaData }) => {
  const { daoid, daochain } = useParams();
  const [spaceName, setSpaceName] = useState('');

  useEffect(() => {
    if (daoMetaData?.boosts?.SNAPSHOT?.active) {
      setSpaceName(daoMetaData.boosts.SNAPSHOT.metadata.space);
    }
  }, [daoMetaData]);

  const snapshotButton = (
    <Button as={Link} to={`/dao/${daochain}/${daoid}/boost/snapshot`}>
      View Snapshot Proposals
    </Button>
  );

  return (
    <MainViewLayout header='Snapshots' isDao headerEl={snapshotButton}>
      <TextBox mb={5}>Editing Settings</TextBox>
      <Flex justify='flex-start' align='center'>
        <TextBox as={FormLabel} size='xs' position='relative'>
          Snapshot Space ID: {spaceName}
        </TextBox>
      </Flex>
    </MainViewLayout>
  );
};

export default SnapshotSettings;
