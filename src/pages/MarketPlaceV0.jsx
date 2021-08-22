import Icon from '@chakra-ui/icon';
import { Input, InputGroup } from '@chakra-ui/input';
import { Flex } from '@chakra-ui/layout';
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu';
import { Spinner } from '@chakra-ui/spinner';
import React, { useEffect, useMemo, useState } from 'react';
import { RiArrowDropDownFill } from 'react-icons/ri';
import { Button } from '@chakra-ui/button';
import { Tabs, Tab, TabList, TabPanel, TabPanels } from '@chakra-ui/tabs';
import List from '../components/list';
import ListItem from '../components/listItem';
import ListSelector from '../components/ListSelector';

import ListSelectorItem from '../components/ListSelectorItem';
import MainViewLayout from '../components/mainViewLayout';
import TextBox from '../components/TextBox';
import { useMetaData } from '../contexts/MetaDataContext';
import { isLastItem } from '../utils/general';
import { BOOSTS, allBoosts, categories } from '../data/boosts';
import { generateLists } from '../utils/marketplace';
import { useFormModal } from '../contexts/OverlayContext';
import { CORE_FORMS } from '../data/forms';
import { useDao } from '../contexts/DaoContext';

const dev = process.env.REACT_APP_DEV;

const MarketPlaceV0 = () => {
  // const { injectedProvider, address, injectedChain } = useInjectedProvider();
  // const { openFormModal, closeModal } = useFormModal();
  // const { successToast, errorToast } = useOverlay();

  return (
    <MainViewLayout isDao header='Boosts'>
      <Tabs isLazy>
        <TabList borderBottom='none' mb={6}>
          <Tab
            px={6}
            color='white'
            _selected={{
              color: 'white',
              borderBottom: '2px solid white',
            }}
            _hover={{
              color: 'white',
              borderBottom: '2px solid rgba(255,255,255,0.3)',
            }}
            borderBottom='2px solid transparent'
          >
            Installed
          </Tab>
          <Tab
            px={6}
            color='white'
            _selected={{
              color: 'white',
              borderBottom: '2px solid white',
            }}
            _hover={{
              color: 'white',
              borderBottom: '2px solid rgba(255,255,255,0.4)',
            }}
            borderBottom='2px solid transparent'
          >
            Market
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Installed />
          </TabPanel>
          <TabPanel>
            <Market />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </MainViewLayout>
  );
};

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

  const openDetails = boost => openFormModal({ boost });

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
            openDetails={openDetails}
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

const BoostsList = ({ categoryID, openDetails }) => {
  const currentCategory = useMemo(() => {
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
      list={currentCategory?.boosts?.map(boostID => {
        const boost = BOOSTS[boostID];
        const handleSteps = () => openDetails(boost);
        return (
          <ListItem
            key={boostID}
            title={boost?.boostContent?.title}
            description={boost?.boostContent?.description}
            menuSection={
              <Button variant='ghost' p={0} onClick={handleSteps}>
                <TextBox>Details</TextBox>
              </Button>
            }
          />
        );
      })}
    />
  );
};

export default MarketPlaceV0;

/// //////////// INSTALLED STUFF

const Installed = () => {
  const { daoMetaData } = useMetaData();
  const { daoOverview } = useDao();
  const [lists, setLists] = useState(null);
  const [listID, setListID] = useState(dev ? 'dev' : 'boosts');

  useEffect(() => {
    if (daoMetaData && daoOverview) {
      const generatedLists = generateLists(daoMetaData, daoOverview, dev);
      setLists(generatedLists);
    }
  }, [daoMetaData, daoOverview, dev]);

  const selectList = id => {
    if (!id) return;
    if (id === listID) {
      setListID(null);
    } else {
      setListID(id);
    }
  };

  return (
    <Flex flexDir='column' w='95%'>
      {daoMetaData && daoOverview ? (
        <Flex>
          {/* <CategorySelector
            categoryID={categoryID}
            selectList={selectCategory}
            allBoosts={allBoosts}
          />
          
          <BoostsList categoryID={categoryID} allBoosts={allBoosts} /> */}
          <ListTypeSelector
            selectList={selectList}
            listID={listID}
            lists={lists}
          />
          <InstalledList listID={listID} lists={lists} />
        </Flex>
      ) : (
        <Spinner />
      )}
    </Flex>
  );
};

const InstalledList = ({ listID, lists }) => {
  const { openFormModal, closeModal } = useFormModal();
  const currentList = useMemo(() => {
    if (listID && lists) {
      return lists?.find(list => list.id === listID);
    }
  }, [listID, lists]);

  const handleClick = () => {
    openFormModal({
      steps: {
        STEP1: {
          start: true,
          type: 'form',
          next: 'STEP2',
          lego: CORE_FORMS.SUMMON_MINION_SELECTOR,
        },
        STEP2: {
          type: 'summoner',
          finish: true,
          isForBoost: false,
        },
      },
    });
  };

  const renderMinions = () =>
    currentList?.types?.map(minion => (
      <ListItem
        {...minion}
        key={minion.id}
        menuSection={
          <Button variant='ghost'>
            <TextBox>Settings</TextBox>
          </Button>
        }
      />
    ));

  const renderBoosts = () =>
    currentList?.types?.map(boost => (
      <ListItem
        title={boost.boostContent.title}
        description={boost.boostContent.description}
        key={boost.id}
        menuSection={
          <Button variant='ghost'>
            <TextBox>Details</TextBox>
          </Button>
        }
      />
    ));

  return (
    <List
      headerSection={
        <Flex w='100%' justifyContent='space-between'>
          <InputGroup w='250px' mr={6}>
            <Input
              placeholder={`Search ${currentList?.name || 'Installed'}...`}
            />
          </InputGroup>
          {listID === 'minion' && (
            <Button variant='outline' onClick={handleClick}>
              Summon Minion
            </Button>
          )}
        </Flex>
      }
      list={listID === 'minion' ? renderMinions() : renderBoosts()}
    />
  );
};

const ListTypeSelector = ({ selectList, listID, lists }) => {
  return (
    <ListSelector
      lists={lists?.map((type, index) => (
        <ListSelectorItem
          key={type.id}
          id={type.id}
          selectList={selectList}
          isSelected={type.id === listID}
          listLabel={{ left: type.name, right: type.types?.length }}
          isBottom={isLastItem(lists, index)}
          isTop={index === 0}
        />
      ))}
    />
  );
};
