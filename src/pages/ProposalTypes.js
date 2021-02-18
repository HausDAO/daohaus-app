import React, { useEffect, useState } from 'react';
import {
  Flex,
  Stack,
  Switch,
  Box,
  Button,
  Spinner,
  Input,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { boostPost, getTerm } from '../utils/metadata';
import { useOverlay } from '../contexts/OverlayContext';
import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
import { proposalTypesContent } from '../content/boost-content';
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

  const handleSave = async () => {
    setLoading(true);

    try {
      const metaUpdate = localMetadata;
      console.log(metaUpdate);

      const messageHash = injectedProvider.utils.sha3(daoid);
      const signature = await injectedProvider.eth.personal.sign(
        messageHash,
        address,
      );

      const updateNotifications = {
        contractAddress: daoid,
        boostKey: 'proposalTypes',
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
    console.log(proposal.key);
    console.log(e.target.checked);
    const updateData = localMetadata;
    updateData[proposal.key] = {
      active: e.target.checked,
      ...updateData[proposal.key],
    };
    console.log(updateData);
    setLocalMetadata(updateData);
    setHasChanges(true);
  };

  const renderProposalType = (proposal) => {
    const isActive = localMetadata[proposal.key].active === true;
    console.log(isActive);
    console.log(Object.keys(localMetadata[proposal.key]));
    return (
      <ContentBox as={Flex} justify='space-between' key={proposal.label}>
        <TextBox size='sm'>{proposal.label}</TextBox>
        <Flex align='center'>
          {proposal.comingSoon ? (
            <TextBox size='xs'>Coming Soon</TextBox>
          ) : (
            <Switch
              id={proposal.key}
              colorScheme='blue'
              value={localMetadata[proposal.key].active === true}
              onChange={(e) => handleChange(proposal, e)}
              disabled={loading}
            />
          )}
        </Flex>
        {isActive &&
          proposal.options?.length &&
          proposal.options.map((option) => {
            console.log(
              Object.keys(localMetadata[proposal.key]).includes(option.id),
            );

            Object.keys(localMetadata[proposal.key]).includes(option.id) && (
              <Flex mt={3} key={`${proposal.key}-${option.id}`}>
                <Input
                  type={option.type}
                  // id={option.id}
                  defaultValue={localMetadata[proposal.key][option.id]}
                />
              </Flex>
            );
          })}
      </ContentBox>
    );
  };

  return (
    <MainViewLayout
      header={`${getTerm(customTerms, 'proposal')} ${getTerm(
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
                  {getTerm(customTerms, 'proposal')} Types
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
