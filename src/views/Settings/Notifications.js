import React, { useEffect } from 'react';
import {
  Flex,
  Stack,
  Icon,
  Switch,
  Box,
  Button,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { VscGear } from 'react-icons/vsc';

import ContentBox from '../../components/Shared/ContentBox';
import TextBox from '../../components/Shared/TextBox';
import { notificationBoostContent } from '../../content/boost-content';
import {
  useDao,
  useModals,
  useNetwork,
  useUser,
  useWeb3Connect,
} from '../../contexts/PokemolContext';
import { useState } from 'react/cjs/react.development';
import { boostPost } from '../../utils/requests';
import GenericModal from '../../components/Modal/GenericModal';
import NotificationsLaunch from '../../components/Settings/NotificationsLaunch';

const Notifications = () => {
  const [dao] = useDao();
  const [web3Connect] = useWeb3Connect();
  const [user] = useUser();
  const [network] = useNetwork();
  const [localMetadata, setLocalMetadata] = useState();
  const [hasChanges, setHasChanges] = useState();
  const [loading, setLoading] = useState();
  const { modals, openModal, closeModals } = useModals();
  const toast = useToast();

  useEffect(() => {
    if (dao?.boosts?.notificationsLevel1?.active) {
      setLocalMetadata(dao.boosts.notificationsLevel1.metadata);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dao]);

  const handleSave = async (newChannelMetadata) => {
    setLoading(true);

    const messageHash = web3Connect.web3.utils.sha3(dao.address);
    const signature = await web3Connect.web3.eth.personal.sign(
      messageHash,
      user.username,
    );

    const metaUpdate = newChannelMetadata
      ? [{ ...localMetadata[0], channelId: newChannelMetadata[0].channelId }]
      : localMetadata;

    console.log('metaUpdate', metaUpdate);

    const updateNotifications = {
      contractAddress: dao.address,
      boostKey: 'notificationsLevel1',
      metadata: metaUpdate,
      network: network.network,
      signature,
    };

    try {
      const updateRes = await boostPost('dao/boost', updateNotifications);
      console.log('updateRes', updateRes);
      setLoading(false);
      setHasChanges(false);
      closeModals();
      toast({
        title: 'Notification Settings Updated',
        position: 'top-right',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.log('update error', err);
      setLoading(false);
      alert('error: forbidden');
    }
  };

  const handleActionChange = (message, e) => {
    if (e.target.checked) {
      setLocalMetadata(
        localMetadata.map((channel) => {
          channel.actions.push(message.id);
          return channel;
        }),
      );
    } else {
      setLocalMetadata(
        localMetadata.map((channel) => {
          channel.actions.splice(channel.actions.indexOf(message.id), 1);
          return channel;
        }),
      );
    }

    setHasChanges(true);
  };

  const handleChannelChange = (channel, e) => {
    // TODO: Need to address adding channels when we allow more than discord
    setLocalMetadata(
      localMetadata.map((channelMeta) => {
        if (channel.name === channelMeta.type) {
          channelMeta.active = e.target.checked;
        }
        return channelMeta;
      }),
    );

    setHasChanges(true);
  };

  const openChannelIdModal = (channel) => {
    console.log('eff', channel);
    openModal('notificationBoostChannelForm');
  };

  const renderAction = (message) => {
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
              onChange={(e) => handleActionChange(message, e)}
              disabled={loading}
            />
          )}
        </Flex>
      </ContentBox>
    );
  };

  const renderChannel = (channel) => {
    const isActive = localMetadata.some(
      (meta) => meta.type === channel.name && meta.active,
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
                onChange={(e) => handleChannelChange(channel, e)}
                disabled={loading}
              />
            </>
          )}
        </Flex>
      </ContentBox>
    );
  };

  return (
    <>
      {localMetadata ? (
        <>
          <Flex justify='space-around' mt='150px'>
            <Box w='45%'>
              <Flex justify='space-between'>
                <TextBox colorScheme='white' size='sm' mb={2}>
                  Messages
                </TextBox>
              </Flex>

              <Stack spacing={6}>
                {notificationBoostContent.actions.map((message) =>
                  renderAction(message),
                )}
              </Stack>
            </Box>
            <Box w='45%'>
              <Flex justify='space-between'>
                <TextBox colorScheme='white' size='sm' mb={2}>
                  Channels
                </TextBox>
              </Flex>

              <Stack spacing={6}>
                {notificationBoostContent.channels.map((channel) =>
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
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Flex>
        </>
      ) : (
        <Flex justify='space-around' mt='150px'>
          <Box w='45%'>
            <Flex justify='space-between'>
              <TextBox colorScheme='white' size='sm' mb={2}>
                Boost not active
              </TextBox>
            </Flex>
          </Box>
        </Flex>
      )}

      <GenericModal
        isOpen={modals.notificationBoostChannelForm}
        closeOnOverlayClick={false}
      >
        <NotificationsLaunch
          handleLaunch={handleSave}
          loading={loading}
          setLoading={setLoading}
          stepOverride='directions2'
        />
      </GenericModal>
    </>
  );
};

export default Notifications;
