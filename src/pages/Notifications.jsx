import React, { useEffect, useState } from 'react';
import {
  Flex,
  Stack,
  Icon,
  Switch,
  Box,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { VscGear } from 'react-icons/vsc';
import { useParams } from 'react-router-dom';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { boostPost } from '../utils/metadata';
import { useOverlay } from '../contexts/OverlayContext';
import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
import { notificationBoostContent } from '../content/boost-content';
import GenericModal from '../modals/genericModal';
import NotificationsLaunch from '../components/notificationsLaunch';
import MainViewLayout from '../components/mainViewLayout';

const Notifications = ({ daoMetaData, refetchMetaData }) => {
  const { injectedProvider, injectedChain, address } = useInjectedProvider();
  const { daoid } = useParams();
  const { setGenericModal, successToast, errorToast } = useOverlay();
  const [localMetadata, setLocalMetadata] = useState();
  const [hasChanges, setHasChanges] = useState();
  const [loading, setLoading] = useState();

  useEffect(() => {
    if (daoMetaData?.boosts?.notificationsLevel1?.active) {
      setLocalMetadata(daoMetaData.boosts.notificationsLevel1.metadata);
    }
  }, [daoMetaData]);

  const handleSave = async newChannelMetadata => {
    setLoading(true);

    try {
      const messageHash = injectedProvider.utils.sha3(daoid);
      const signature = await injectedProvider.eth.personal.sign(
        messageHash,
        address,
      );

      const metaUpdate = newChannelMetadata
        ? [{ ...localMetadata[0], channelId: newChannelMetadata[0].channelId }]
        : localMetadata;

      const updateNotifications = {
        contractAddress: daoid,
        boostKey: 'notificationsLevel1',
        metadata: metaUpdate,
        network: injectedChain.network,
        signature,
      };

      const updateRes = await boostPost('dao/boost', updateNotifications);
      console.log('updateRes', updateRes);
      setLoading(false);
      setHasChanges(false);
      setGenericModal({});
      refetchMetaData();
      successToast({
        title: 'Notification Settings Updated',
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

  const handleActionChange = (message, e) => {
    if (e.target.checked) {
      setLocalMetadata(
        localMetadata.map(channel => {
          channel.actions.push(message.id);
          return channel;
        }),
      );
    } else {
      setLocalMetadata(
        localMetadata.map(channel => {
          channel.actions.splice(channel.actions.indexOf(message.id), 1);
          return channel;
        }),
      );
    }

    setHasChanges(true);
  };

  const handleChannelChange = (channel, e) => {
    setLocalMetadata(
      localMetadata.map(channelMeta => {
        if (channel.name === channelMeta.type) {
          channelMeta.active = e.target.checked;
        }
        return channelMeta;
      }),
    );

    setHasChanges(true);
  };

  const openChannelIdModal = channel => {
    setGenericModal({ [`notificationBoostChannelForm-${channel.name}`]: true });
  };

  const renderAction = message => {
    const isActive = localMetadata[0].actions.includes(message.id);

    return (
      <ContentBox as={Flex} justify='space-between' key={message.label}>
        <TextBox size='sm'>{message.label}</TextBox>
        <Flex align='center'>
          {message.comingSoon ? (
            <TextBox size='xs'>Coming Soon</TextBox>
          ) : (
            <Switch
              id={message.id}
              colorScheme='green'
              isChecked={isActive}
              onChange={e => handleActionChange(message, e)}
              disabled={loading}
            />
          )}
        </Flex>
      </ContentBox>
    );
  };

  const renderChannel = channel => {
    const isActive = localMetadata.some(
      meta => meta.type === channel.name && meta.active,
    );

    return (
      <ContentBox as={Flex} justify='space-between' key={channel.name}>
        <TextBox size='sm'>{channel.name}</TextBox>
        <Flex align='center'>
          {channel.comingSoon ? (
            <TextBox size='xs'>Coming Soon</TextBox>
          ) : (
            <>
              <Icon
                as={VscGear}
                color='secondary.500'
                w='25px'
                h='25px'
                mr={3}
                onClick={() => openChannelIdModal(channel)}
                _hover={{ cursor: 'pointer' }}
              />
              <Switch
                id={channel.id}
                colorScheme='green'
                isChecked={isActive}
                onChange={e => handleChannelChange(channel, e)}
                disabled={loading}
              />
            </>
          )}
        </Flex>
        <GenericModal
          modalId={`notificationBoostChannelForm-${channel.name}`}
          closeOnOverlayClick={false}
        >
          <NotificationsLaunch
            handleLaunch={handleSave}
            loading={loading}
            setLoading={setLoading}
            stepOverride='directions2'
          />
        </GenericModal>
      </ContentBox>
    );
  };

  return (
    <MainViewLayout header='Notifications' isDao>
      {localMetadata ? (
        <>
          <Flex justify='space-around' mt='150px'>
            <Box w='45%'>
              <Flex justify='space-between'>
                <TextBox color='white' size='sm' mb={2}>
                  Messages
                </TextBox>
              </Flex>

              <Stack spacing={6}>
                {notificationBoostContent.actions.map(message =>
                  renderAction(message),
                )}
              </Stack>
            </Box>
            <Box w='45%'>
              <Flex justify='space-between'>
                <TextBox color='white' size='sm' mb={2}>
                  Channels
                </TextBox>
              </Flex>

              <Stack spacing={6}>
                {notificationBoostContent.channels.map(channel =>
                  renderChannel(channel),
                )}
              </Stack>
            </Box>
          </Flex>
          <Flex justify='flex-end' align='center' w='100%'>
            {loading ? <Spinner /> : null}
            <Button
              mr='2.5%'
              disabled={!hasChanges || loading}
              onClick={() => handleSave()}
            >
              Save Changes
            </Button>
          </Flex>
        </>
      ) : (
        <Flex justify='space-around' mt='150px'>
          <Box w='45%'>
            <Flex justify='space-between'>
              <TextBox color='white' size='sm' mb={2}>
                Boost not active
              </TextBox>
            </Flex>
          </Box>
        </Flex>
      )}
    </MainViewLayout>
  );
};

export default Notifications;
