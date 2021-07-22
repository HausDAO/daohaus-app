import React, { useState } from 'react';
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
  Icon,
} from '@chakra-ui/react';

import { rgba } from 'polished';
import { VscGear } from 'react-icons/vsc';
import { Link as RouterLink, useParams } from 'react-router-dom';

import { useOverlay } from '../contexts/OverlayContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import TextBox from '../components/TextBox';

import { FORM, COMMON_FORMS, PLAYLISTS } from '../data/forms';

const ProposalSelector = () => {
  const {
    proposalSelector,
    setProposalSelector,
    displayFormModal,
  } = useOverlay();
  const { theme } = useCustomTheme();

  const [currentPlaylist, setCurrentPlaylists] = useState(COMMON_FORMS);

  const handleClose = () => {
    setProposalSelector(false);
    setCurrentPlaylists(COMMON_FORMS);
  };

  const selectProposal = id => {
    if (!currentPlaylist) return;
    const selectedForm = FORM[id];
    handleClose();
    displayFormModal(selectedForm);
  };

  const selectPlaylist = value => {
    if (!value) return;
    setCurrentPlaylists(PLAYLISTS.find(list => list.value === value));
  };

  return (
    <Modal isOpen={proposalSelector} onClose={handleClose} isCentered>
      <ModalOverlay bgColor={rgba(theme.colors.background[500], 0.8)} />
      <ModalContent
        rounded='lg'
        bg='blackAlpha.600'
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
        <PlaylistSelect
          sets={PLAYLISTS}
          selectPlaylist={selectPlaylist}
          handleClose={handleClose}
        />
        <ModalCloseButton color='white' />
        <ModalBody
          flexDirection='column'
          display='flex'
          maxH='650px'
          overflowY='auto'
        >
          {currentPlaylist?.forms?.map(form => (
            <ProposalOption
              form={form}
              key={form.id}
              selectProposal={selectProposal}
            />
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProposalSelector;

const PlaylistSelect = ({ sets, selectPlaylist, handleClose }) => {
  const { daochain, daoid } = useParams();
  const handleChange = e => {
    if (!e?.target?.value) return;
    const { value } = e.target;
    selectPlaylist(value);
  };
  return (
    <Flex>
      <Select
        mb={8}
        ml={4}
        width='60%'
        onChange={handleChange}
        fontFamily='accessory'
      >
        {sets.map(set => (
          <option key={set.value} value={set.value}>
            {set.name}
          </option>
        ))}
      </Select>
      <RouterLink
        to={`/dao/${daochain}/${daoid}/settings/proposals`}
        onClick={handleClose}
      >
        <TextBox variant='body' color='secondary.500'>
          Manage
        </TextBox>
      </RouterLink>
    </Flex>
  );
};

const ProposalOption = ({ form, selectProposal }) => {
  const { title, description, id } = form;
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
            {title}
          </TextBox>
          <Box fontFamily='body' size='sm' mb={6} color='whiteAlpha.800'>
            {description}
          </Box>
        </Box>
      </Flex>
      <Divider mb={6} />
    </>
  );
};
