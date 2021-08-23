import React, { useMemo, useState } from 'react';

import {
  Icon,
  Flex,
  MenuList,
  Menu,
  MenuItem,
  MenuButton,
  Input,
  InputGroup,
  Button,
} from '@chakra-ui/react';

import { RiMore2Line, RiStarFill } from 'react-icons/ri';
import { HiPencil, HiRefresh } from 'react-icons/hi';
import TextBox from './TextBox';
import { CORE_FORMS, FORM } from '../data/forms';

import { useFormModal } from '../contexts/OverlayContext';

import { useMetaData } from '../contexts/MetaDataContext';
import { areAnyFields } from '../utils/general';
import List from './list';
import ListItem from './listItem';
import NoListItem from './NoListItem';

const handleSearch = (formsArr, str) => {
  if (!str) return formsArr;
  if (!formsArr?.length) return [];
  return formsArr.filter(formId =>
    FORM[formId].title.toLowerCase().includes(str),
  );
};

const generateNoListMsg = (selectedListID, searchStr) => {
  if (selectedListID && !searchStr) return 'No Proposals Added';
  if (selectedListID && !!searchStr)
    return `Could not find proposal with title ${searchStr}`;
  if (!selectedListID) return 'Select a Playlist';
  return 'Not Found';
};

const ProposalList = ({
  playlists,
  customData,
  selectedListID,
  allForms,
  devList,
}) => {
  const { openFormModal, closeModal } = useFormModal();
  const { dispatchPropConfig } = useMetaData();

  const [searchStr, setSearchStr] = useState(null);

  const proposalList = useMemo(() => {
    if (!playlists || !selectedListID || !allForms) return [];
    if (selectedListID === 'all')
      return handleSearch(allForms.forms, searchStr);
    if (selectedListID === 'dev') return handleSearch(devList.forms, searchStr);
    return handleSearch(
      playlists.find(list => list.id === selectedListID)?.forms,
      searchStr,
    );
  }, [selectedListID, playlists, allForms, searchStr]);

  const handleEditProposal = formId =>
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

  const handleRestoreProposal = formId =>
    dispatchPropConfig({ action: 'RESTORE_PROPOSAL', formId });

  const handleTogglePlaylist = (formId, listId, isListed) =>
    dispatchPropConfig({ action: 'TOGGLE_PLAYLIST', listId, formId, isListed });

  const handleTypeSearch = e => setSearchStr(e.target.value.toLowerCase());
  const handlePreview = form =>
    openFormModal({
      lego: form,
    });

  return (
    <List
      headerSection={
        <>
          <TextBox p={2} mr='auto'>
            Proposals
          </TextBox>
          <InputGroup w='200px'>
            <Input onChange={handleTypeSearch} placeholder='Search Proposals' />
          </InputGroup>
        </>
      }
      list={
        proposalList?.length > 0 ? (
          proposalList.map(proposalID => {
            const customFormData = customData?.[proposalID];
            const hasBeenEdited =
              customFormData && areAnyFields('truthy', customFormData);
            const form = FORM?.[proposalID];

            return (
              <ListItem
                {...form}
                customFormData={customFormData}
                hasBeenEdited={hasBeenEdited}
                key={proposalID}
                menuSection={
                  <Flex flexDir='column' justifyContent='space-between'>
                    {form?.dev ? (
                      <DevMenu form={form} handlePreview={handlePreview} />
                    ) : (
                      <ProposalMenuList
                        formId={proposalID}
                        playlists={playlists}
                        hasBeenEdited={hasBeenEdited}
                        handleTogglePlaylist={handleTogglePlaylist}
                        handleEditProposal={handleEditProposal}
                        handleRestoreProposal={handleRestoreProposal}
                      />
                    )}
                  </Flex>
                }
                helperText={hasBeenEdited && 'edited'}
              />
            );
          })
        ) : (
          <NoListItem>
            <TextBox>{generateNoListMsg(selectedListID, searchStr)}</TextBox>
          </NoListItem>
        )
      }
    />
  );
};

export default ProposalList;

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

const DevMenu = ({ form, handlePreview }) => {
  const handleClick = () => {
    handlePreview(form);
  };
  return (
    <Button variant='ghost' onClick={handleClick}>
      Preview
    </Button>
  );
};
