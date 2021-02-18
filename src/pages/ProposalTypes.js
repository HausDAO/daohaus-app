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
import { boostPost, getCopy } from '../utils/metadata';
import { useOverlay } from '../contexts/OverlayContext';
import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
import { proposalTypesContent } from '../content/boost-content';
import GenericModal from '../modals/genericModal';
import NotificationsLaunch from '../components/notificationsLaunch';
import MainViewLayout from '../components/mainViewLayout';
import { useMetaData } from '../contexts/MetaDataContext';

const ProposalTypes = ({ daoMetaData, refetchMetaData }) => {
  const { injectedProvider, injectedChain, address } = useInjectedProvider();
  const { daoid } = useParams();
  const { customTerms } = useMetaData();
  const { setGenericModal, successToast, errorToast } = useOverlay();
  const [localMetadata, setLocalMetadata] = useState();
  const [hasChanges, setHasChanges] = useState();
  const [loading, setLoading] = useState();

  useEffect(() => {
    if (daoMetaData?.boosts?.proposalTypes?.active) {
      setLocalMetadata(daoMetaData.boosts.proposalTypes.metadata);
    }
  }, [daoMetaData]);

  const handleSave = async (newChannelMetadata) => {
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

  const handleChange = (proposal, e) => {
    if (e.target.checked) {
      setLocalMetadata({
        ...localMetadata,
        [proposal.key]: { active: true },
      });
    } else {
      setLocalMetadata(
        localMetadata.map((channel) => {
          channel.actions.splice(channel.actions.indexOf(proposal.id), 1);
          return channel;
        }),
      );
    }

    setHasChanges(true);
  };

  const renderProposalType = (proposal) => {
    const isActive =
      Object.keys(localMetadata).includes(proposal.key) &&
      localMetadata[proposal.key].active === true;

    return (
      <ContentBox as={Flex} justify='space-between' key={proposal.label}>
        <TextBox size='sm'>{proposal.label}</TextBox>
        <Flex align='center'>
          {proposal.comingSoon ? (
            <TextBox size='xs'>Coming Soon</TextBox>
          ) : (
            <Switch
              id={proposal.id}
              colorScheme='green'
              isChecked={isActive}
              onChange={(e) => handleChange(proposal, e)}
              disabled={loading}
            />
          )}
        </Flex>
      </ContentBox>
    );
  };

  return (
    <MainViewLayout
      header={`${getCopy(customTerms, 'proposal')} ${getCopy(
        customTerms,
        'settings',
      )}`}
      isDao={true}
    >
      {localMetadata ? (
        <>
          <Flex justify='space-around' mt='150px'>
            <Box w='45%'>
              <Flex justify='space-between'>
                <TextBox colorScheme='white' size='sm' mb={2}>
                  Proposal Types
                </TextBox>
              </Flex>

              <Stack spacing={6}>
                {proposalTypesContent.map((proposal) =>
                  renderProposalType(proposal),
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
              <TextBox colorScheme='white' size='sm' mb={2}>
                Boost not active
              </TextBox>
            </Flex>
          </Box>
        </Flex>
      )}
    </MainViewLayout>
  );
};

export default ProposalTypes;
