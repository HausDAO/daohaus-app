import React, { useMemo, useState } from 'react';
import { RiArrowDropDownFill } from 'react-icons/ri';
import { useParams } from 'react-router-dom';
import {
  Flex,
  Spinner,
  Input,
  InputGroup,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';

import { useMetaData } from '../contexts/MetaDataContext';
import BoostItemButton from '../components/boostItemButton';
import ListSelectorItem from '../components/ListSelectorItem';
import List from '../components/list';
import ListItem from '../components/listItem';
import ListSelector from '../components/ListSelector';
import NoListItem from '../components/NoListItem';
import TextBox from '../components/TextBox';
import { BOOSTS, allBoosts, categories } from '../data/boosts';
import { isLastItem } from '../utils/general';

const checkAvailable = (boostData, daochain) =>
  boostData.networks === 'all' || boostData.networks[daochain];

const checkBoostInstalled = (boostData, daoMetaData) =>
  daoMetaData.boosts[boostData.id];

const handleSearch = data => {
  const { boostsKeyArray, searchStr } = data;
  if (!searchStr) return data;
  if (!boostsKeyArray?.length) return [];
  return {
    ...data,
    boostsKeyArray: boostsKeyArray.filter(boostID =>
      BOOSTS[boostID].boostContent.title.toLowerCase().includes(searchStr),
    ),
  };
};
const handleDaoRelation = data => {
  const { boostsKeyArray, daochain, daoMetaData } = data;
  return {
    ...data,
    boostsArray: boostsKeyArray.map(boostKey => {
      const boostData = BOOSTS[boostKey];
      return {
        ...BOOSTS[boostKey],
        isAvailable: checkAvailable(boostData, daochain),
        isDeprecated: boostData.deprecated,
        isInstalled: checkBoostInstalled(boostData, daoMetaData),
      };
    }),
  };
};
const handleSort = ({ boostsArray, sortBy }) => {
  if (sortBy === 'SKIP') {
    return boostsArray;
  }
  if (sortBy === 'Available') {
    return boostsArray.sort((boostA, boostB) => {
      if (boostA.isAvailable && boostB.isAvailable) {
        if (
          boostA.boostContent.title.toUpperCase() >
          boostB.boostContent.title.toUpperCase()
        ) {
          return 1;
        }
        if (
          boostA.boostContent.title.toUpperCase() <
          boostB.boostContent.title.toUpperCase()
        ) {
          return -1;
        }
        return 0;
      }
      if (!boostA.isAvailable && boostB.isAvailable) {
        return 1;
      }
      return -1;
    });
  }
  if (sortBy === 'Title (A-Z)') {
    const sorted = boostsArray.sort((boostA, boostB) =>
      boostA.boostContent.title.toUpperCase() >
      boostB.boostContent.title.toUpperCase()
        ? 1
        : -1,
    );
    return sorted;
  }
};

const processBoosts = data => {
  const { daoMetaData, boostsKeyArray, daochain, sortBy } = data;
  if (!Array.isArray(boostsKeyArray) || !daoMetaData || !daochain || !sortBy)
    return;
  return handleSort(handleDaoRelation(handleSearch(data)));
};

const generateNoListMsg = (selectedListID, searchStr) => {
  if (selectedListID && !searchStr) return 'No Proposals Added';
  if (selectedListID && searchStr)
    return `Could not find proposal with title ${searchStr}`;
  if (!selectedListID) return 'Select a Playlist';
  return 'Not Found';
};

const Market = ({ installBoost, openDetails, goToSettings }) => {
  const { daoMetaData } = useMetaData();
  const [categoryID, setID] = useState('all');

  const selectCategory = id => {
    if (!id) return;
    if (id === categoryID) {
      setID(null);
    } else {
      setID(id);
    }
  };

  return (
    <Flex flexDir='column'>
      {daoMetaData ? (
        <Flex flexDir={['column', 'column', 'row']}>
          <CategorySelector
            categoryID={categoryID}
            selectList={selectCategory}
            allBoosts={allBoosts}
          />
          <BoostsList
            categoryID={categoryID}
            allBoosts={allBoosts}
            installBoost={installBoost}
            openDetails={openDetails}
            goToSettings={goToSettings}
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

const BoostsList = ({
  categoryID,
  openDetails,
  goToSettings,
  allBoosts,
  installBoost,
}) => {
  const { daoMetaData } = useMetaData();
  const { daochain } = useParams();

  const [searchStr, setSearchStr] = useState(null);
  const [sortBy, setSortBy] = useState('Available');

  const currentCategory = useMemo(() => {
    if (!categoryID || !categories || !daoMetaData) return;
    if (categoryID === 'all') {
      return processBoosts({
        daochain,
        boostsKeyArray: allBoosts.boosts,
        searchStr,
        daoMetaData,
        sortBy,
      });
    }
    return processBoosts({
      daochain,
      boostsKeyArray: categories.find(cat => cat.id === categoryID)?.boosts,
      searchStr,
      daoMetaData,
      sortBy,
    });
  }, [categoryID, categories, searchStr, daoMetaData, sortBy]);

  const handleTypeSearch = e =>
    setSearchStr(e.target.value.toLowerCase().trim());
  const handleSetSort = e => setSortBy(e.target.value);

  return (
    <List
      headerSection={
        <Flex flexDir={['column', 'column', 'row']}>
          <InputGroup w='250px' mr={6} mb={2}>
            <Input placeholder='Search Boosts' onChange={handleTypeSearch} />
          </InputGroup>
          <Flex alignItems='center'>
            <TextBox mr='2' size='sm'>
              Sort By:
            </TextBox>
            <Menu value={sortBy}>
              <MenuButton
                textTransform='uppercase'
                fontFamily='heading'
                fontSize='sm'
                color='secondary.500'
                _hover={{ color: 'secondary.400' }}
                display='inline-block'
              >
                {sortBy}
                <Icon as={RiArrowDropDownFill} color='secondary.500' />
              </MenuButton>
              <MenuList>
                <MenuItem value='Available' onClick={handleSetSort}>
                  Available
                </MenuItem>
                <MenuItem value='Title (A-Z)' onClick={handleSetSort}>
                  Title (A-Z)
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      }
      list={
        currentCategory?.length > 0 ? (
          currentCategory.map(boost => {
            return (
              <ListItem
                key={boost.id}
                title={boost?.boostContent?.title}
                description={boost?.boostContent?.description}
                menuSection={
                  <BoostItemButton
                    boost={boost}
                    installBoost={installBoost}
                    goToSettings={goToSettings}
                    openDetails={openDetails}
                  />
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
