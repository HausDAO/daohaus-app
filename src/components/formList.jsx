import React, { useMemo, useState } from 'react';
import { HiPencil, HiRefresh } from 'react-icons/hi';
import { RiMore2Line, RiStarFill } from 'react-icons/ri';
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

import { useMetaData } from '../contexts/MetaDataContext';
import { useAppModal } from '../hooks/useModals';
import List from './list';
import ListItem from './listItem';
import NoListItem from './NoListItem';
import TextBox from './TextBox';
import { FORM } from '../data/formLegos/forms';
import { areAnyFields } from '../utils/general';
import deepEqual from 'deep-eql';

const handleSearch = (formsArr, str) => {
  if (!str) return formsArr;
  if (!formsArr?.length) return [];
  return formsArr.filter(formId =>
    FORM[formId].title.toLowerCase().includes(str),
  );
};

const FormList = ({
  playlists,
  customData,
  selectedListID,
  allForms,
  devList,
  selectList,
}) => {
  const { formModal, closeModal } = useAppModal();
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

  const handleEditProposal = formId => {
    const form = FORM[formId];
    const defaultValues = { ...form, name: form.title };

    return formModal({
      ...FORM.EDIT_PROPOSAL,
      defaultValues,
      onSubmit: ({ values }) => {
        if (!deepEqual(values, defaultValues)) {
          dispatchPropConfig({
            action: 'EDIT_PROPOSAL',
            title: values.title,
            description: values.description,
            formId,
          });
        }
        closeModal();
      },
    });
  };
  const handleRestoreProposal = formId =>
    dispatchPropConfig({ action: 'RESTORE_PROPOSAL', formId });

  const handleTogglePlaylist = (formId, listId, isListed) =>
    dispatchPropConfig({ action: 'TOGGLE_PLAYLIST', listId, formId, isListed });

  const handleTypeSearch = e => setSearchStr(e.target.value.toLowerCase());
  const handlePreview = form => formModal(form);
  const handleSwitchToProposals = () => selectList('all');

  const generateNoListUI = (selectedListID, searchStr) => {
    if (selectedListID && !searchStr)
      return (
        <Flex
          flexDir='column'
          justifyContent='center'
          alignItems='center'
          h='100%'
          w='100%'
        >
          <TextBox mb={3}>No Proposals Added </TextBox>
          <TextBox variant='body' textAlign='center'>
            Go to the{' '}
            <Button
              variant='ghost'
              p={0}
              h='fit-content'
              transform='translateY(-1px)'
              color='secondary.400'
              onClick={handleSwitchToProposals}
            >
              Proposals
            </Button>{' '}
            list and star proposals you think should be here.
          </TextBox>
        </Flex>
      );
    if (selectedListID && !!searchStr)
      return (
        <TextBox>Could not find proposal with title ${searchStr}`</TextBox>
      );
    if (!selectedListID) return <TextBox>Select a Playlist</TextBox>;
    return 'Not Found';
  };
  return (
    <List
      headerSection={
        <Flex
          w='100%'
          flexDir={['column', 'column', 'row']}
          justifyContent='space-between'
          alignItems='flex-start'
        >
          <TextBox mr={2} mb={3}>
            Proposals
          </TextBox>
          <InputGroup w='200px'>
            <Input onChange={handleTypeSearch} placeholder='Search Proposals' />
          </InputGroup>
        </Flex>
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
                    {form?.dev && selectedListID === 'dev' ? (
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
          <NoListItem>{generateNoListUI(selectedListID, searchStr)}</NoListItem>
        )
      }
    />
  );
};

export default FormList;

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
