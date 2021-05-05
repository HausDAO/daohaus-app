import React, { useEffect, useState } from 'react';
import {
  Flex,
  Stack,
  Switch,
  Box,
  Button,
  Spinner,
  Input,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { BiArrowBack } from 'react-icons/bi';
import { RiQuestionLine } from 'react-icons/ri';
import { useParams, Link as RouterLink } from 'react-router-dom';
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
  const { daochain, daoid } = useParams();
  const { customTerms } = useMetaData();
  const { setGenericModal, successToast, errorToast } = useOverlay();
  const [localMetadata, setLocalMetadata] = useState();
  const [hasChanges, setHasChanges] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState(null);

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
    const updateData = {
      ...localMetadata,
      [proposal.key]: {
        ...localMetadata[proposal.key],
        active: e.target.checked,
      },
    };
    setLocalMetadata(updateData);
    setHasChanges(true);
  };

  const handleOptionChange = (key, option, e) => {
    if (option?.validation(e.target.value)) {
      setLocalMetadata({
        ...localMetadata,
        [key]: {
          ...localMetadata[key],
          [option.id]: e.target.value,
        },
      });
      setHasChanges(true);
      setError(null);
    } else {
      setError({ error: option.validationText });
    }
  };

  const renderProposalType = proposal => {
    const isActive =
      proposal.key in localMetadata
        ? localMetadata[proposal.key].active === true
        : false;
    return (
      <ContentBox key={proposal.label}>
        <Flex justify='space-between'>
          <TextBox size='sm'>{proposal.label}</TextBox>
          <Flex align='center'>
            {proposal.comingSoon ? (
              <TextBox size='xs'>Coming Soon</TextBox>
            ) : (
              <Switch
                id={proposal.key}
                colorScheme='blue'
                isChecked={isActive}
                onChange={e => handleChange(proposal, e)}
                isDisabled={
                  loading ||
                  (!proposal.default && !(proposal?.key in daoMetaData.boosts))
                }
              />
            )}
          </Flex>
        </Flex>
        {isActive &&
          proposal.options?.length &&
          proposal.options.map(option => {
            return localMetadata?.[proposal.key][option.id] ? (
              <Flex
                mt={3}
                key={`${proposal.key}-${option.id}`}
                justify='space-around'
                align='center'
                wrap='wrap'
              >
                <Flex align='center'>
                  <TextBox size='xs'>{option.label}</TextBox>
                  {option.validationText ? (
                    <Tooltip
                      hasArrow
                      shouldWrapChildren
                      placement='top'
                      label={option.validationText}
                    >
                      <Icon ml={2} as={RiQuestionLine} color='whiteAlpha.800' />
                    </Tooltip>
                  ) : null}
                </Flex>

                <Box maxW='50%'>
                  <Input
                    type={option.type}
                    id={option.id}
                    defaultValue={
                      localMetadata[proposal.key][option.id] ||
                      option?.default ||
                      0
                    }
                    border={error ? '1px solid red' : '1px solid white'}
                    textAlign='right'
                    onChange={e => handleOptionChange(proposal.key, option, e)}
                  />
                  {error ? (
                    <Box mt={2} fontSize='sm' color='red'>
                      {option.validationText}
                    </Box>
                  ) : null}
                </Box>
              </Flex>
            ) : null;
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
      isDao
    >
      {localMetadata ? (
        <>
          <Flex justify='space-between' align='center' w='100%'>
            <Flex
              as={RouterLink}
              to={`/dao/${daochain}/${daoid}/settings`}
              align='center'
            >
              <Icon as={BiArrowBack} color='secondary.500' mr={2} />
              Back
            </Flex>
            <Flex align='center'>
              {loading ? <Spinner mr={4} /> : null}
              <Button
                mx='2.5%'
                disabled={!hasChanges || loading}
                onClick={() => handleSave()}
              >
                Save Changes
              </Button>
            </Flex>
          </Flex>
          <Flex justify='space-around' mt='100px'>
            <Box w={['90%', '80%', '60%', '45%']}>
              <Flex justify='space-between'>
                <TextBox color='white' size='sm' mb={2}>
                  {`${getTerm(customTerms, 'proposal')} Types`}
                </TextBox>
              </Flex>

              <Stack spacing={6}>
                {proposalTypesContent.map(proposal =>
                  renderProposalType(proposal),
                )}
              </Stack>
            </Box>
          </Flex>
        </>
      ) : (
        <Flex justify='space-around' mt='150px'>
          <Box w='45%'>
            <Flex justify='space-between'>
              <TextBox color='whiteAlpha.900' size='sm' mb={2}>
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
