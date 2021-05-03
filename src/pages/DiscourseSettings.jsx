import React, { useEffect, useState } from 'react';
import {
  Flex,
  Stack,
  Icon,
  Switch,
  Box,
  Button,
  Spinner,
  useToast,
  Link,
  Text,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { boostPost } from '../utils/metadata';
import { useOverlay } from '../contexts/OverlayContext';
import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
import MainViewLayout from '../components/mainViewLayout';

const DiscourseSettings = ({ daoMetaData, refetchMetaData }) => {
  const { injectedProvider, injectedChain, address } = useInjectedProvider();
  const { daoid } = useParams();
  const { successToast, errorToast } = useOverlay();
  const toast = useToast();
  const [localMetadata, setLocalMetadata] = useState();
  const [hasChanges, setHasChanges] = useState();
  const [loading, setLoading] = useState();

  useEffect(() => {
    if (daoMetaData?.boosts?.discourse?.active) {
      setLocalMetadata(daoMetaData.boosts.discourse.metadata);
    }
  }, [daoMetaData]);

  const handleSave = async () => {
    setLoading(true);

    try {
      const messageHash = injectedProvider.utils.sha3(daoid);
      const signature = await injectedProvider.eth.personal.sign(
        messageHash,
        address,
      );

      const updatedBoost = {
        contractAddress: daoid,
        boostKey: 'discourse',
        metadata: localMetadata,
        network: injectedChain.network,
        signature,
      };

      const updateRes = await boostPost('dao/boost', updatedBoost);
      console.log('updateRes', updateRes);
      setLoading(false);
      setHasChanges(false);
      refetchMetaData();
      successToast({
        title: 'Discourse Settings Updated',
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

  const handleActionChange = e => {
    setLocalMetadata(prevState => {
      return {
        ...prevState,
        autoProposal: e.target.checked,
      };
    });

    setHasChanges(true);
  };

  const copiedToast = () => {
    toast({
      title: 'Copied Address',
      position: 'top-right',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <MainViewLayout header='Discourse Forum Settings' isDao>
      {localMetadata ? (
        <>
          <Flex justify='space-around' mt='150px'>
            <Box w='35%'>
              <TextBox color='white' size='sm' mb={8}>
                Discourse Forum URL
              </TextBox>
              <CopyToClipboard
                text={`https://forum.daohaus.club/c/${localMetadata.slug}/${localMetadata.categoryId}`}
                onCopy={copiedToast}
              >
                <>
                  <Link
                    href={`https://forum.daohaus.club/c/${localMetadata.slug}/${localMetadata.categoryId}`}
                    target='_blank'
                    rel='noreferrer noopener'
                  >
                    {`https://forum.daohaus.club/c/${localMetadata.slug}/${localMetadata.categoryId}`}
                  </Link>
                  <Icon
                    as={FaCopy}
                    color='secondary.300'
                    ml={2}
                    _hover={{ cursor: 'pointer' }}
                  />
                </>
              </CopyToClipboard>
              <Text fontSize='md' mt={6}>
                DAO members can visit the forum, signup and start discussing all
                the topics.
              </Text>
            </Box>
            <Box w='55%'>
              <Stack spacing={6}>
                <TextBox color='white' size='sm' mb={2}>
                  Settings
                </TextBox>
                <Text fontSize='md' mt={6}>
                  You can always manually add a topic from the proposal detail
                  page.
                </Text>
                <ContentBox as={Flex} justify='space-between'>
                  <TextBox fontSize='md'>
                    Create forum topics on proposal submission
                  </TextBox>
                  <Flex align='center'>
                    <Switch
                      id='autoProposal'
                      colorScheme='green'
                      isChecked={localMetadata.autoProposal}
                      onChange={e => handleActionChange(e)}
                      disabled={loading}
                    />
                  </Flex>
                </ContentBox>
              </Stack>
            </Box>
          </Flex>
          <Flex justify='flex-end' align='center' w='100%' mt={5}>
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

export default DiscourseSettings;
