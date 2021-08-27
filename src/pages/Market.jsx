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
import BoostDetails from '../components/boostDetails';

const checkAvailable = (boostData, daochain) =>
  boostData.networks === 'all' ||
  validate.address(boostData.networks[daochain]);

const checkBoostInstalled = (boostData, daoMetaData) =>
  daoMetaData.boosts[boostData.id || boostData.oldId];

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

const Market = () => {
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
    <Flex flexDir='column' w='95%'>
      {daoMetaData ? (
        <Flex>
          <CategorySelector
            categoryID={categoryID}
            selectList={selectCategory}
            allBoosts={allBoosts}
          />
          <BoostsList categoryID={categoryID} allBoosts={allBoosts} />
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

const BoostsList = ({ categoryID }) => {
  const { openFormModal } = useFormModal();
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
    const boostList = categories.find(cat => cat.id === categoryID)?.boosts;
    return processBoosts({
      daochain,
      boostsKeyArray: boostList,
      searchStr,
      daoMetaData,
      sortBy,
    });
  }, [categoryID, categories, searchStr, daoMetaData, sortBy]);

  const handleTypeSearch = e =>
    setSearchStr(e.target.value.toLowerCase().trim());
  const installBoost = boost => openFormModal({ boost });
  const openDetails = boost => {
    openFormModal({
      body: (
        <BoostDetails
          content={boost.boostContent}
          isAvailable={boost.isAvailable}
        />
      ),
    });
  };
  //  For boosts that require non-minion settings.
  const goToSettings = () => {};
  const handleSetSort = e => {
    setSortBy(e.target.value);
  };
  return (
    <List
      headerSection={
        <>
          <InputGroup w='250px' mr={6}>
            <Input placeholder='Search Boosts' onChange={handleTypeSearch} />
          </InputGroup>
          <TextBox p={2}>Sort By:</TextBox>
          <Menu value={sortBy}>
            <MenuButton
              textTransform='uppercase'
              fontFamily='heading'
              fontSize={['sm', null, null, 'md']}
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
        </>
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
                // helperText={getHelperText(boost)}
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

const BoostItemButton = ({
  boost,
  openDetails,
  installBoost,
  goToSettings,
}) => {
  const cost = boost?.cost?.toUpperCase();
  if (!boost.isAvailable) {
    const handleClick = () => openDetails(boost);
    return (
      <Flex flexDir='column' alignItems='flex-end'>
        <Button variant='ghost' p={0} onClick={handleClick}>
          <TextBox color='secondary.500'>Details</TextBox>
        </Button>
        <TextBox
          variant='body'
          mt={3}
          opacity='0.8'
          size='sm'
          fontStyle='italic'
        >
          Unavailable on network - {cost}
        </TextBox>
      </Flex>
    );
  }
  if (!boost.isInstalled) {
    const handleClick = () => installBoost(boost);
    return (
      <Flex flexDir='column' alignItems='flex-end'>
        <Button variant='ghost' onClick={handleClick} p={0}>
          <TextBox color='secondary.500'>Install</TextBox>
        </Button>
        <TextBox variant='body' mt={3} opacity='0.8' size='sm'>
          {cost}
        </TextBox>
      </Flex>
    );
  }
  if (boost.isInstalled) {
    const handleClick = () => {
      if (boost.settings === 'none') {
        openDetails(boost);
      } else {
        goToSettings();
      }
    };
    return (
      <Flex flexDir='column' alignItems='flex-end'>
        <Button variant='ghost' p={0} onClick={handleClick} color='red'>
          <TextBox color='secondary.500'>
            {boost.settings === 'none' ? 'Details' : 'Settings'}
          </TextBox>
        </Button>
        <TextBox
          variant='body'
          mt={3}
          opacity='0.8'
          fontStyle='italic'
          size='sm'
        >
          installed
        </TextBox>
      </Flex>
    );
  }
  return null;
};
