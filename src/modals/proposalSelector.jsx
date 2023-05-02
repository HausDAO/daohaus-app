import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  Box,
  Flex,
  Select,
  Divider,
} from '@chakra-ui/react';
import { rgba } from 'polished';

import { useCustomTheme } from '../contexts/CustomThemeContext';
import { useMetaData } from '../contexts/MetaDataContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useAppModal } from '../hooks/useModals';
import TextBox from '../components/TextBox';
import { FORM } from '../data/formLegos/forms';
import { CARD_BG } from '../themes/theme';
import { defaultProposals } from '../data/playlists';

const ProposalSelector = () => {
  const { daoProposals } = useMetaData();
  const { proposalSelector, setProposalSelector } = useOverlay();
  const { formModal } = useAppModal();
  const { theme } = useCustomTheme();
  const [allPlaylists, setAllPlaylists] = useState();

  const { playlists, customData } = daoProposals || {};

  const [currentPlaylist, setCurrentPlaylist] = useState(null);

  useEffect(() => {
    if (playlists) {
      setCurrentPlaylist(playlists?.[0]);
      setAllPlaylists([...playlists, defaultProposals]);
    }
  }, [playlists]);

  const handleClose = () => {
    setProposalSelector(false);
    setCurrentPlaylist(playlists?.[0]);
  };

  const selectProposal = id => {
    if (!currentPlaylist) return;

    handleClose();
    formModal(FORM[id]);
    // openFormModal({ lego: selectedForm });
  };

  const selectPlaylist = id => {
    if (!id || !allPlaylists) return;
    setCurrentPlaylist(allPlaylists.find(list => list.id === id));
  };

  return (
    <Modal isOpen={proposalSelector} onClose={handleClose} isCentered>
      <ModalOverlay bgColor={rgba(theme.colors.background[500], 0.8)} />
      <ModalContent
        rounded='lg'
        bg={CARD_BG}
        borderWidth='1px'
        borderColor='whiteAlpha.200'
        maxWidth='700px'
        py={3}
        px={9}
      >
        <ModalHeader pb={0}>
          <Flex justify='space-between' align='center' w='90%'>
            <TextBox
              fontFamily='heading'
              textTransform='uppercase'
              fontSize='md'
              fontWeight={700}
              mb={6}
              color='white'
            >
              What would you like to do?
            </TextBox>
          </Flex>
        </ModalHeader>
        <ModalBody
          flexDirection='column'
          display='flex'
          maxH='650px'
          overflowY='auto'
        >
          <PlaylistSelect
            playlists={allPlaylists}
            selectPlaylist={selectPlaylist}
            handleClose={handleClose}
          />
          <ModalCloseButton color='white' />
          {currentPlaylist?.forms?.map(formId => (
            <ProposalOption
              form={FORM[formId]}
              customFormData={customData?.[formId]}
              key={formId}
              selectProposal={selectProposal}
            />
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProposalSelector;

const PlaylistSelect = ({ playlists, selectPlaylist }) => {
  const handleChange = e => {
    if (!e?.target?.value) return;
    selectPlaylist(e.target.value);
  };

  return (
    <Flex alignItems='top' flexDir={['column', 'column', 'row']} mb='6'>
      <Select
        width={['100%', '100%', '60%']}
        onChange={handleChange}
        fontFamily='accessory'
        mr='4'
        mb='2'
      >
        {playlists?.map(list => (
          <option key={list.id} value={list.id}>
            {list.name}
          </option>
        ))}
      </Select>
    </Flex>
  );
};

const ProposalOption = ({ form, selectProposal, customFormData }) => {
  const { title, description, id } = form || {};
  const handleClick = () => selectProposal(id);
  return (
    <>
      <Flex onClick={handleClick} cursor='pointer'>
        {/* <Image h='70px' minW='70px' mb={6} /> */}
        <Box w='100%'>
          <TextBox
            fontFamily='heading'
            textTransform='uppercase'
            fontSize='md'
            fontWeight={700}
            mb={2}
            color='white'
          >
            {customFormData?.title || title}
          </TextBox>
          <Box fontFamily='body' size='sm' mb={6} color='whiteAlpha.800'>
            {customFormData?.description || description}
          </Box>
        </Box>
      </Flex>
      <Divider mb={6} />
    </>
  );
};
