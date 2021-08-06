import Icon from '@chakra-ui/icon';
import { Input, InputGroup } from '@chakra-ui/input';
import { Flex } from '@chakra-ui/layout';
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu';
import { Spinner } from '@chakra-ui/spinner';
import React, { useMemo, useState } from 'react';
import { RiArrowDropDownFill } from 'react-icons/ri';
import { Button } from '@chakra-ui/button';
import List from '../components/list';
import ListItem from '../components/listItem';
import ListSelector from '../components/ListSelector';
import GenericSelect from '../components/genericSelect';

import ListSelectorItem from '../components/ListSelectorItem';
import MainViewLayout from '../components/mainViewLayout';
import PlaylistSelector from '../components/playlistSelector';
import SaveButton from '../components/saveButton';
import TextBox from '../components/TextBox';
import { useMetaData } from '../contexts/MetaDataContext';
import { isLastItem } from '../utils/general';
import { titleMaker } from '../utils/proposalUtils';
import { BOOSTS, allBoosts, categories } from '../data/boosts';

const MarketPlaceV0 = () => {
  // const { injectedProvider, address, injectedChain } = useInjectedProvider();
  // const { openFormModal, closeModal } = useFormModal();
  // const { successToast, errorToast } = useOverlay();

  const [loading, setLoading] = useState(false);
  const [categoryID, setID] = useState('all');
  const { daoBoosts = {} } = useMetaData();

  const selectCategory = id => {
    if (!id) return;
    if (id === categoryID) {
      setID(null);
    } else {
      setID(id);
    }
  };

  return (
    <MainViewLayout isDao header='Boosts'>
      <Flex flexDir='column' w='95%'>
        <Flex justifyContent='flex-end' mb={12}>
          <SaveButton size='md' watch={daoBoosts} disabled={loading}>
            SAVE CHANGES {loading && <Spinner ml={3} />}
          </SaveButton>
        </Flex>
        {daoBoosts ? (
          <Flex>
            <CategorySelector
              categoryID={categoryID}
              selectList={selectCategory}
            />
            <BoostsList categoryID={categoryID} />
            {/* 
            
            <PlaylistSelector
              selectCategory={selectCategory}
              addPlaylist={addPlaylist}
              allForms={allForms}
              categoryID={categoryID}
              playlists={playlists}
              deletePlaylist={deletePlaylist}
              editPlaylist={editPlaylist}
            />

            <ProposalList
              playlists={playlists}
              customData={customData}
              categoryID={categoryID}
              allForms={allForms}
            /> */}
          </Flex>
        ) : (
          <Spinner />
        )}
      </Flex>
    </MainViewLayout>
  );
};

const CategorySelector = ({ selectList, categoryID }) => {
  return (
    <ListSelector
      topListItem={
        <ListSelectorItem
          listLabel={{ left: 'All Boosts', right: 10 }}
          isTop
          id='all'
          isSelected={categoryID === 'all'}
          selectList={selectList}
        />
      }
      divider='Categories'
      lists={categories?.map((cat, index) => (
        <ListSelectorItem
          key={cat.id}
          id={cat.id}
          selectList={selectList}
          isSelected={cat.id === categoryID}
          listLabel={{ left: cat.name, right: cat.boosts?.length }}
          isBottom={isLastItem(categories, index)}
        />
      ))}
    />
  );
};

const BoostsList = ({ categoryID }) => {
  const [sortBy, setSort] = useState('Title');
  const currentCategory = useMemo(() => {
    console.log(`categoryID`, categoryID);
    console.log(`categories`, categories);
    if (categoryID && categories) {
      if (categoryID === 'all') {
        return allBoosts;
      }
      return categories.find(cat => cat.id === categoryID);
    }
  }, [categoryID, categories]);
  return (
    <List
      headerSection={
        <>
          <InputGroup w='250px' mr={6}>
            <Input placeholder='Search Boosts' />
          </InputGroup>

          <TextBox p={2}>Sort By:</TextBox>
          <Menu isLazy>
            <MenuButton
              textTransform='uppercase'
              fontFamily='heading'
              fontSize={['sm', null, null, 'md']}
              color='secondary.500'
              _hover={{ color: 'secondary.400' }}
              display='inline-block'
              mr='auto'
            >
              {sortBy}
              <setSort as={RiArrowDropDownFill} color='secondary.500' />
            </MenuButton>
            <MenuList>
              <MenuItem>Title</MenuItem>
            </MenuList>
          </Menu>
          <Menu isLazy>
            <MenuButton
              textTransform='uppercase'
              fontFamily='heading'
              fontSize={['sm', null, null, 'md']}
              color='secondary.500'
              _hover={{ color: 'secondary.400' }}
              display='inline-block'
            >
              Filter
              <Icon as={RiArrowDropDownFill} color='secondary.500' />
            </MenuButton>
            <MenuList>
              <MenuItem>Title</MenuItem>
            </MenuList>
          </Menu>
        </>
      }
      list={currentCategory?.boosts?.map(boost => (
        <ListItem
          {...BOOSTS[boost]}
          key={boost.id}
          menuSection={
            <Button variant='ghost'>
              <TextBox>Details</TextBox>
            </Button>
          }
        />
      ))}
    />
  );
};

export default MarketPlaceV0;
