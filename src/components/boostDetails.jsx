import React, { useState } from 'react';
import { BsArrowReturnRight } from 'react-icons/bs';
import { Button } from '@chakra-ui/button';
import Icon from '@chakra-ui/icon';
import { Box, Divider, Flex, Link } from '@chakra-ui/layout';
import { RiExternalLinkLine } from 'react-icons/ri';

import { useParams } from 'react-router-dom';
import { useFormModal, useOverlay } from '../contexts/OverlayContext';

import MemberIndicator from './memberIndicator';
import TextIndicator from './textIndicator';
import TextBox from './TextBox';
import { handleRestorePlaylist } from '../utils/metadata';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useMetaData } from '../contexts/MetaDataContext';
import { chainByID } from '../utils/chain';
import { hasPlaylist } from '../utils/playlists';

const BoostDetails = ({
  boostContent = {},
  goToNext,
  next,
  userSteps,
  isAvailable,
  secondaryBtn,
  playlist,
}) => {
  const { closeModal } = useFormModal();
  const {
    publisher = {},
    version,
    pars = [],
    externalLinks = [],
    header,
    title,
  } = boostContent;
  const { name, daoData } = publisher;

  const [loading, setLoading] = useState(false);
  const { successToast, errorToast } = useOverlay();
  const { daochain } = useParams();
  const { address, injectedProvider } = useInjectedProvider();
  const { daoMetaData, daoProposals, refetchMetaData } = useMetaData();

  const handleNext = () => {
    if (next && goToNext) {
      goToNext(next);
    } else {
      closeModal();
    }
  };

  const restorePlaylist = {
    text: 'Restore Playlist',
    fn: async () => {
      setLoading(true);
      await handleRestorePlaylist({
        playlist,
        injectedProvider,
        meta: daoMetaData,
        address,
        network: chainByID(daochain).network,
        proposalConfig: daoProposals,
        onSuccess: () => {
          successToast({
            title: 'Playlist Restored',
          });
          setLoading(false);
          refetchMetaData();
        },
        onError: error => {
          console.log(`errorMsg`, error.message);
          errorToast({
            title: 'Error Restoring Playlist',
            description: error.message,
          });
          setLoading(false);
        },
      });
    },
  };
  const daoHasPlaylist = hasPlaylist(daoMetaData, playlist);
  const canRestore = !userSteps;
  const secondBtn = canRestore ? restorePlaylist : secondaryBtn;
  return (
    <Flex flexDirection='column'>
      <TextBox mb={6} size='lg'>
        {header || title}
      </TextBox>
      <Flex justifyContent='space-between' flexWrap='wrap'>
        <MemberIndicator
          link={`/dao/${daoData?.network}/${daoData?.address}`}
          label='Publisher'
          name={name}
          layoutProps={{ mb: '6' }}
          address={daoData?.address}
          shouldFetchProfile={false}
          onClick={closeModal}
        />
        <TextIndicator
          label='Network'
          value={isAvailable ? 'Available' : 'Not Available'}
          size='sm'
          mb={3}
        />
        <TextIndicator
          label='Version'
          value={version}
          size='sm'
          mb={3}
          numString
        />
      </Flex>
      <Flex flexDirection='column'>
        {pars?.length > 0 && (
          <Box mb={3}>
            {pars.map((par, index) => (
              <TextBox
                variant='body'
                mb={3}
                size='sm'
                key={`boostDetailsPar-${index}`}
              >
                {par}
              </TextBox>
            ))}
          </Box>
        )}
        {externalLinks?.length > 0 && (
          <Box mb={6}>
            {externalLinks.map(link => (
              <Box key={link.href} mb={3}>
                <Link href={link.href} isExternal>
                  <Flex>
                    <TextBox type='body' size='xs' color='secondary.400' mr={2}>
                      {link.label}
                    </TextBox>
                    <Icon as={RiExternalLinkLine} name='external link' />
                  </Flex>
                </Link>
              </Box>
            ))}
          </Box>
        )}
      </Flex>
      {userSteps?.length > 0 && (
        <UserStepIndicator userSteps={userSteps} label='Install Steps' />
      )}
      <Box>
        <Flex alignItems='flex-end' flexDir='column'>
          <Flex>
            {isAvailable && playlist && (
              <Button
                type='button'
                variant='outline'
                onClick={secondBtn.fn}
                mr={4}
                isLoading={loading}
                loadingText='Restoring...'
                disabled={daoHasPlaylist}
              >
                {secondBtn.text}
              </Button>
            )}

            <Button
              onClick={handleNext}
              loadingText='Submitting'
              isLoading={loading}
            >
              {goToNext && next ? 'Next >' : 'Close'}
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

const UserStepIndicator = ({ userSteps, label }) => {
  return (
    <>
      <Divider mb={4} />
      <Flex mb={4} flexDir='column'>
        <TextBox size='sm' mb={2}>
          {label}
        </TextBox>
        {userSteps?.map(({ stepLabel }) => (
          <Flex key={stepLabel} mb={2}>
            <Icon
              as={BsArrowReturnRight}
              h='20px'
              w='20px'
              // transform='translateY(1px)'
              mr={2}
            />
            <TextBox size='sm' variant='body'>
              {stepLabel}
            </TextBox>
          </Flex>
        ))}
      </Flex>
    </>
  );
};

export default BoostDetails;
