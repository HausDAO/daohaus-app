import React, { useMemo, useState } from 'react';
import {
  Flex,
  Spinner,
  Input,
  InputGroup,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { RiArrowDropDownFill } from 'react-icons/ri';

import { useParams } from 'react-router';
import { useFormModal } from '../contexts/OverlayContext';
import { useMetaData } from '../contexts/MetaDataContext';
import ListSelectorItem from '../components/ListSelectorItem';
import List from '../components/list';
import ListSelector from '../components/ListSelector';
import ListItem from '../components/listItem';
import TextBox from '../components/TextBox';
import NoListItem from '../components/NoListItem';

import { isLastItem } from '../utils/general';
import { BOOSTS, allBoosts, categories } from '../data/boosts';
import { validate } from '../utils/validation';

const handleSearch = (boostsArr, str) => {
  if (!str) return boostsArr;
  if (!boostsArr?.length) return [];
  return boostsArr.filter(boostID =>
    BOOSTS[boostID].boostContent.title.toLowerCase().includes(str),
  );
};
const generateNoListMsg = (selectedListID, searchStr) => {
  if (selectedListID && !searchStr) return 'No Proposals Added';
  if (selectedListID && searchStr)
    return `Could not find proposal with title ${searchStr}`;
  if (!selectedListID) return 'Select a Playlist';
  return 'Not Found';
};
const getActionText = (boost, isAvailable, installed) => {
  if (!boost) return 'Not Found';
  if (!isAvailable) return 'Details';
  if (!installed) return 'Install';
  return 'Settings';
};
// const getHelperText = (boost, isAvailable, price, installed) => {
//   if (!boost) return;
//   if (!isAvailable) return 'Details';
//   if (!installed) return 'Install';
//   return 'Settings';
// };

const Market = () => {
  const { daoBoosts = {} } = useMetaData();
  const { openFormModal } = useFormModal();

  const [categoryID, setID] = useState('all');

  const selectCategory = id => {
    if (!id) return;
    if (id === categoryID) {
      setID(null);
    } else {
      setID(id);
    }
  };

  const installBoost = boost => openFormModal({ boost });

  // there is no daoBoosts
  // so playlists can't update on existing boosts
  console.log('daoBoosts', daoBoosts, allBoosts);

  return (
    <Flex flexDir='column' w='95%'>
      {daoBoosts ? (
        <Flex>
          <CategorySelector
            categoryID={categoryID}
            selectList={selectCategory}
            allBoosts={allBoosts}
          />
          <BoostsList
            categoryID={categoryID}
            allBoosts={allBoosts}
            installBoost={installBoost}
          />
        </Flex>
      ) : (
        <Spinner />
      )}
    </Flex>
  );
};

const CategorySelector = ({ selectList, categoryID, allBoosts }) => {
  return (
    <ListSelector
      topListItem={
        <ListSelectorItem
          listLabel={{
            left: 'All Boosts',
            right: allBoosts?.boosts?.length || 0,
          }}
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

const BoostsList = ({ categoryID, installBoost }) => {
  const [searchStr, setSearchStr] = useState(null);
  const { daochain } = useParams();

  const currentCategory = useMemo(() => {
    if (categoryID && categories) {
      if (categoryID === 'all') {
        return handleSearch(allBoosts.boosts, searchStr);
      }
      return handleSearch(
        categories.find(cat => cat.id === categoryID)?.boosts,
        searchStr,
      );
    }
  }, [categoryID, categories, searchStr]);

  const handleTypeSearch = e =>
    setSearchStr(e.target.value.toLowerCase().trim());

  return (
    <List
      headerSection={
        <>
          <InputGroup w='250px' mr={6}>
            <Input placeholder='Search Boosts' onChange={handleTypeSearch} />
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
            >
              Available
              <Icon as={RiArrowDropDownFill} color='secondary.500' />
            </MenuButton>
            <MenuList>
              <MenuItem>Title</MenuItem>
            </MenuList>
          </Menu>
        </>
      }
      list={
        currentCategory?.length > 0 ? (
          currentCategory.map(boostID => {
            const boost = BOOSTS[boostID];
            const handleInstall = () => installBoost(boost);
            const isAvailable =
              boost.networks === 'all' ||
              validate.address(boost.networks[daochain]);
            return (
              <ListItem
                key={boostID}
                title={boost?.boostContent?.title}
                description={boost?.boostContent?.description}
                menuSection={
                  <Button variant='ghost' p={0} onClick={handleInstall}>
                    <TextBox>{getActionText(boost, isAvailable)}</TextBox>
                  </Button>
                }
              />
            );
          })
        ) : (
          <NoListItem>
            <TextBox>{generateNoListMsg(categoryID, searchStr)}</TextBox>
          </NoListItem>
        )
      }
    />
  );
};

export default Market;
