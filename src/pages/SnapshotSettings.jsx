import React, { useCallback, useEffect, useState } from 'react';
import { Flex, Button, Input, FormLabel, Icon } from '@chakra-ui/react';
import { useParams, Link } from 'react-router-dom';
import { RiInformationLine } from 'react-icons/ri';
import TextBox from '../components/TextBox';
import { ToolTipWrapper } from '../staticElements/wrappers';

import { useOverlay } from '../contexts/OverlayContext';
import MainViewLayout from '../components/mainViewLayout';
import { getSnapshotSpaces } from '../utils/theGraph';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { boostPost } from '../utils/metadata';

const SnapshotSettings = ({ daoMetaData, refetchMetaData }) => {
  const [loading, setLoading] = useState(false);
  const { errorToast, successToast } = useOverlay();
  const { injectedProvider, injectedChain, address } = useInjectedProvider();
  const { daoid, daochain } = useParams();
  const [localMetadata, setLocalMetadata] = useState();
  const [spaceName, setSpaceName] = useState('');

  useEffect(() => {
    if (daoMetaData?.boosts?.SNAPSHOT?.active) {
      setLocalMetadata(daoMetaData.boosts.SNAPSHOT.metadata);
      setSpaceName(daoMetaData.boosts.SNAPSHOT.metadata.space);
    }
  }, [daoMetaData]);

  const onChange = e => {
    setSpaceName(e.target.value);
  };

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      const messageHash = injectedProvider.utils.sha3(daoid);
      const signature = await injectedProvider.eth.personal.sign(
        messageHash,
        address,
      );
      const space = await getSnapshotSpaces(spaceName);
      if (!space.space?.id) {
        errorToast({
          title: 'No space found!',
          description: "Please use the .eth name found in your space's url!",
        });
        setLoading(false);
        return;
      }

      const updatedBoost = {
        contractAddress: daoid,
        boostKey: 'SNAPSHOT',
        metadata: { ...localMetadata, space: spaceName },
        network: injectedChain.network,
        signature,
      };

      await boostPost('dao/boost', updatedBoost);
      setLoading(false);
      refetchMetaData();
      successToast({
        title: 'Snapshot Settings Updated',
        description: 'You DAOd it!',
      });
    } catch (err) {
      setLoading(false);
      errorToast({
        title: 'Something went wrong',
        description: 'Are you an active member of this DAO?',
      });
    }
  }, [spaceName]);

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
          Snapshot Space ID
        </TextBox>
        <ToolTipWrapper
          tooltip
          tooltipText={{
            body:
              'The space id is the .eth name found in the url or your space.',
          }}
          placement='right'
          layoutProps={{
            transform: 'translateY(-4px)',
            display: 'inline-block',
          }}
        >
          <Icon as={RiInformationLine} ml={2} />
        </ToolTipWrapper>
      </Flex>
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
        <Button mr='2.5%' isLoading={loading} onClick={() => handleSave()}>
          Save Changes
        </Button>
      </Flex>
    </MainViewLayout>
  );
};

export default SnapshotSettings;
