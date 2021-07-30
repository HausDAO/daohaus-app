import React, { useMemo, useState } from 'react';

import {
  Box,
  Icon,
  Flex,
  Button,
  MenuList,
  Menu,
  MenuItem,
  MenuButton,
  Spinner,
  Input,
  InputGroup,
} from '@chakra-ui/react';
import { VscGear } from 'react-icons/vsc';
import { FiTrash2 } from 'react-icons/fi';

import { RiMore2Line, RiStarFill } from 'react-icons/ri';
import { HiPencil, HiRefresh } from 'react-icons/hi';
import ContentBox from '../components/ContentBox';
import MainViewLayout from '../components/mainViewLayout';
import TextBox from '../components/TextBox';
import { CORE_FORMS, FORM } from '../data/forms';

import { useConfirmation, useFormModal } from '../contexts/OverlayContext';

import { useMetaData } from '../contexts/MetaDataContext';
import { areAnyFields } from '../utils/general';

const handleSearch = (formsArr, str) => {
  if (!str) return formsArr;
  if (!formsArr?.length) return [];
  return formsArr.filter(formId =>
    FORM[formId].title.toLowerCase().includes(str),
  );
};

const ProposalTypes = () => {
  const { daoProposals } = useMetaData();

  const { playlists, allForms = {}, customData } = daoProposals || {};
  const [selectedList, setSelectedList] = useState('all');

  const selectList = id => {
    if (!id) return;
    if (id === selectedList) {
      setSelectedList(null);
    } else {
      setSelectedList(id);
    }
  };

  return (
    <MainViewLayout isDao header='Proposal Types'>
      <Flex flexDir='column' w='95%'>
        <Flex justifyContent='flex-end' mb={9}>
          <Button size='lg'>SAVE CHANGES</Button>
        </Flex>
        {daoProposals ? (
          <Flex>
            <PlaylistSelector
              allForms={allForms}
              playlists={playlists}
              selectedList={selectedList}
              selectList={selectList}
            />
            <ProposalList
              allForms={allForms}
              forms={selectedList?.forms}
              playlists={playlists}
              customData={customData}
              selectedList={selectedList}
              // toggleFavorite={toggleFavorite}
            />
          </Flex>
        ) : (
          <Spinner />
        )}
      </Flex>
    </MainViewLayout>
  );
};

export default ProposalTypes;

const PlaylistSelector = ({
  allForms,
  playlists,
  selectedList,
  selectList,
}) => {
  const { openFormModal, closeModal } = useFormModal();
  const { openConfirmation } = useConfirmation();
  const { dispatchPropConfig } = useMetaData();

  const handleEditPlaylist = id => {
    openFormModal({
      lego: CORE_FORMS.EDIT_PLAYLIST,
      onSubmit: ({ values }) => {
        const name = values?.title;
        if (name && id) {
          dispatchPropConfig({ action: 'EDIT_PLAYLIST', id, name });
          closeModal();
        }
      },
    });
  };

  const handleDeletePlaylist = id => {
    const playlist = playlists.find(list => list.id === id);
    openConfirmation({
      title: 'Delete Playlist',
      header: `Are you sure you want to delete ${playlist?.name}?`,
      onSubmit() {
        dispatchPropConfig({ action: 'DELETE_PLAYLIST', id });
        closeModal();
      },
    });
  };

  const handleAddPlaylist = () => {
    openFormModal({
      lego: CORE_FORMS.ADD_PLAYLIST,
      onSubmit: ({ values }) => {
        dispatchPropConfig({ action: 'ADD_PLAYLIST', name: values.title });
        closeModal();
      },
    });
  };

  return (
    <Flex
      minW='250px'
      maxW='400px'
      w='100%'
      height='fit-content'
      flexDir='column'
      mr={12}
    >
      <Flex justifyContent='flex-end' mb={4}>
        <Button variant='ghost' onClick={handleAddPlaylist}>
          <TextBox mr={2} color='secondary.400'>
            New Playlist
          </TextBox>
        </Button>
      </Flex>
      <ContentBox p='0' border='none' mb={6} w='100%'>
        <Flex flexDir='column'>
          <PlaylistItem
            {...allForms}
            selectList={selectList}
            isSelected={selectedList === 'all'}
            isMutable={false}
          />
          <TextBox ml={6} my={6}>
            Playlists
          </TextBox>
          {playlists?.map(list => (
            <PlaylistItem
              key={list.id}
              {...list}
              isMutable
              isSelected={selectedList === list.id}
              selectList={selectList}
              handleEditPlaylist={handleEditPlaylist}
              handleDeletePlaylist={handleDeletePlaylist}
            />
          ))}
        </Flex>
      </ContentBox>
    </Flex>
  );
};

const PlaylistItem = ({
  name,
  forms,
  id,
  isMutable,
  isSelected,
  selectList,
  handleEditPlaylist,
  handleDeletePlaylist,
}) => {
  const displayActions = isSelected && isMutable;
  const handleClick = () => {
    selectList(id);
  };
  const handleClickEdit = e => {
    e.stopPropagation();
    handleEditPlaylist(id);
  };
  const handleClickDelete = e => {
    e.stopPropagation();
    handleDeletePlaylist(id);
  };

  return (
    <Flex
      position='relative'
      p={6}
      flexDir='column'
      onClick={handleClick}
      transition='.2s all'
    >
      <Box
        position='absolute'
        top='0'
        right='0'
        left='0'
        bottom='0'
        zIndex='0'
        opacity='0.7'
        bg={isSelected ? 'primary.600' : 'transparent'}
        _hover={{ bg: 'primary.600' }}
      />
      <Flex
        justifyContent='space-between'
        mb={displayActions ? 2 : 0}
        zIndex='10'
        pointerEvents='none'
      >
        <TextBox textTransform='none' size='lg'>
          {name}
        </TextBox>
        <TextBox size='lg'>{forms?.length}</TextBox>
      </Flex>
      {displayActions && (
        <Flex zIndex='10'>
          <Icon
            as={VscGear}
            color='secondary.400'
            w='20px'
            h='20px'
            mr={4}
            cursor='pointer'
            onClick={handleClickEdit}
          />
          <Icon
            as={FiTrash2}
            color='secondary.400'
            w='20px'
            h='20px'
            cursor='pointer'
            onClick={handleClickDelete}
          />
        </Flex>
      )}
    </Flex>
  );
};

const ProposalList = ({
  playlists,
  toggleFavorite,
  customData,
  selectedList,
  allForms,
}) => {
  const { openFormModal, closeModal } = useFormModal();
  const { dispatchPropConfig } = useMetaData();

  const [searchStr, setSearchStr] = useState(null);

  const forms = useMemo(() => {
    if (!playlists || !selectedList) return [];
    if (selectedList === 'all') {
      return handleSearch(allForms.forms, searchStr);
    }
    return handleSearch(
      playlists.find(list => list.id === selectedList)?.forms,
      searchStr,
    );
  }, [selectedList, playlists, searchStr]);

  const handleEditProposal = formId => {
    openFormModal({
      lego: CORE_FORMS.EDIT_PROPOSAL,
      onSubmit: ({ values }) => {
        dispatchPropConfig({
          action: 'EDIT_PROPOSAL',
          title: values.title,
          description: values.description,
          formId,
        });
        closeModal();
      },
    });
  };
  const handleRestoreProposal = formId => {
    openFormModal({
      lego: CORE_FORMS.EDIT_PROPOSAL,
      onSubmit: () => {
        dispatchPropConfig({ action: 'EDIT_PROPOSAL', formId });
        closeModal();
      },
    });
  };

  const handleTogglePlaylist = (formId, listId, isListed) => {
    dispatchPropConfig({ action: 'TOGGLE_PLAYLIST', listId, formId, isListed });
  };

  const handleTypeSearch = e => {
    setSearchStr(e.target.value.toLowerCase());
  };

  return (
    <Flex flexDir='column' w='100%'>
      <Flex mb={4}>
        <TextBox p={2} mr='auto'>
          Proposals
        </TextBox>

        <InputGroup w='200px'>
          <Input onChange={handleTypeSearch} placeholder='Search Proposals' />
        </InputGroup>
      </Flex>
      {forms?.map(formId => (
        <ProposalListItem
          {...FORM[formId]}
          key={formId}
          customFormData={customData?.[formId]}
          toggleFavorite={toggleFavorite}
          handleEditProposal={handleEditProposal}
          handleRestoreProposal={handleRestoreProposal}
          handleTogglePlaylist={handleTogglePlaylist}
          playlists={playlists}
        />
      ))}
    </Flex>
  );
};

const ProposalListItem = ({
  title,
  id,
  description,
  customFormData,
  handleEditProposal,
  handleRestoreProposal,
  handleTogglePlaylist,
  playlists,
}) => {
  const hasBeenEdited = useMemo(
    () => customFormData && areAnyFields('truthy', customFormData),
    [customFormData],
  );

  return (
    <ContentBox mb={4}>
      <Flex justifyContent='space-between'>
        {/* <Image h='70px' minW='70px' mb={6} /> */}
        <Box>
          <TextBox mb={2}>{customFormData?.title || title}</TextBox>
          <Box fontFamily='body' size='sm' color='whiteAlpha.800'>
            {customFormData?.description || description}
          </Box>
        </Box>
        <Flex flexDir='column' justifyContent='space-between'>
          <ProposalMenuList
            handleEditProposal={handleEditProposal}
            handleRestoreProposal={handleRestoreProposal}
            handleTogglePlaylist={handleTogglePlaylist}
            playlists={playlists}
            formId={id}
            hasBeenEdited={hasBeenEdited}
          />
          {hasBeenEdited && (
            <TextBox variant='body' size='xs' opacity={0.6} fontStyle='italic'>
              edited
            </TextBox>
          )}
        </Flex>
      </Flex>
    </ContentBox>
  );
};
const ProposalMenuList = ({
  handleEditProposal,
  handleRestoreProposal,
  handleTogglePlaylist,
  formId,
  playlists,
  hasBeenEdited,
}) => {
  const formCentricPlaylistData = useMemo(() => {
    if (playlists) {
      return playlists?.map(list => ({
        ...list,
        isListed: list.forms.some(form => form === formId),
      }));
    }
  }, [playlists]);
  const isOnAnyList = useMemo(() => {
    if (formCentricPlaylistData) {
      const result = formCentricPlaylistData?.some(list => list.isListed);
      return result;
    }
  }, [formCentricPlaylistData]);

  const handleClickEdit = () => handleEditProposal(formId);
  const handleClickReset = () => handleRestoreProposal(formId);
  const handleClickToggle = e => {
    if (!e?.target?.value) return;
    const selectedList = formCentricPlaylistData.find(
      list => list.id === e.target.value,
    );
    handleTogglePlaylist(formId, selectedList.id, selectedList.isListed);
  };
  return (
    <Flex justifyContent='flex-end'>
      {isOnAnyList && (
        <Icon as={RiStarFill} color='white' w='20px' h='20px' mr={2} mt={1} />
      )}
      <Menu isLazy>
        <MenuButton alignItems='start'>
          <Icon
            as={RiMore2Line}
            color='white'
            w='20px'
            h='20px'
            cursor='pointer'
          />
        </MenuButton>
        <MenuList p={4}>
          <MenuItem
            onClick={handleClickEdit}
            icon={<Icon w='20px' h='20px' as={HiPencil} />}
          >
            Edit Proposal Details
          </MenuItem>
          <MenuItem
            onClick={handleClickReset}
            isDisabled={!hasBeenEdited}
            icon={<Icon w='20px' h='20px' as={HiRefresh} />}
          >
            Reset Proposal Details
          </MenuItem>
          <TextBox size='xs' p={3}>
            Add/Remove From Playlist
          </TextBox>
          {formCentricPlaylistData?.map(list => (
            <MenuItem
              key={list.id}
              icon={list.isListed ? <RiStarFill /> : <RiStarFill opacity={0} />}
              onClick={handleClickToggle}
              value={list.id}
            >
              {list.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Flex>
  );
};
