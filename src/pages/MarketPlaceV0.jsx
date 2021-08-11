import Icon from '@chakra-ui/icon';
import { Input, InputGroup } from '@chakra-ui/input';
import { Flex } from '@chakra-ui/layout';
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu';
import { Spinner } from '@chakra-ui/spinner';
import React, { useEffect, useMemo, useState } from 'react';
import { RiArrowDropDownFill } from 'react-icons/ri';
import { Button } from '@chakra-ui/button';
import { Tabs, Tab, TabList, TabPanel, TabPanels } from '@chakra-ui/tabs';
import { list } from '@chakra-ui/styled-system';
import List from '../components/list';
import ListItem from '../components/listItem';
import ListSelector from '../components/ListSelector';

import ListSelectorItem from '../components/ListSelectorItem';
import MainViewLayout from '../components/mainViewLayout';
import TextBox from '../components/TextBox';
import { useMetaData } from '../contexts/MetaDataContext';
import { isFirstItem, isLastItem } from '../utils/general';
import { BOOSTS, allBoosts, categories } from '../data/boosts';
import { generateLists } from '../utils/marketplace';
import { useFormModal } from '../contexts/OverlayContext';
import { FORM } from '../data/forms';
import { PUBLISHERS } from '../data/publishers';
import { TX } from '../data/contractTX';
import TheSummoner from '../components/theSummoner';
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

  const openDetails = () => {
    openFormModal({
      title: 'Boost Marketplace',
      steps: {
        STEP1: {
          start: true,
          type: 'details',
          content: {
            header: "'Nerd Mode' Dev Suite",
            publisher: PUBLISHERS.DAOHAUS,
            version: '1.00',
            pars: [
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.',
              'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc.',
            ],
            externalLinks: [
              { href: 'https://daohaus.club/', label: 'DAOhaus' },
              {
                href: 'https://www.webfx.com/tools/lorem-ipsum-generator/',
                label: 'Lorem Ipsum generator',
              },
            ],
          },
          next: 'STEP2',
        },
        STEP2: {
          prependBody: <TextBox variant='body'>This is a description</TextBox>,
          type: 'form',
          lego: FORM.NEW_VANILLA_MINION,
          next: {
            hasNotSummoned: {
              tx: TX.SUMMON_MINION_VANILLA,
              then: { goTo: 'Step3' },
            },
            hasMinion: { goTo: 'Step3' },
          },
        },
        STEP3: {
          start: true,
          type: 'form',
          lego: FORM.TOKEN,
          next: 'FINAL',
        },
      },
    });
  };
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
      list={currentCategory?.boosts?.map(boost => (
        <ListItem
          {...BOOSTS[boost]}
          key={boost}
          menuSection={
            <Button variant='ghost' p={0} onClick={openDetails}>
              <TextBox>Details</TextBox>
            </Button>
          }
        />
      ))}
    />
  );
};

export default MarketPlaceV0;

/// //////////// INSTALLED STUFF

const Installed = () => {
  const { daoMetaData } = useMetaData();
  const { daoOverview } = useDao();
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = useState(null);
  const [listID, setListID] = useState(null);

  useEffect(() => {
    if (daoMetaData && daoOverview) {
      const generatedLists = generateLists(daoMetaData, daoOverview, dev);
      console.log(`generatedLists`, generatedLists);
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
      {daoMetaData ? (
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
  const currentList = useMemo(() => {
    if (listID && lists) {
      return lists?.find(list => list.id === listID);
    }
  }, [listID, lists]);

  return (
    <List
      headerSection={
        <InputGroup w='250px' mr={6}>
          <Input
            placeholder={`Search ${currentList?.name || 'Installed'}...`}
          />
        </InputGroup>
      }
      list={currentList?.types?.map(boost => (
        <ListItem
          {...boost}
          key={boost.id}
          menuSection={
            listID === 'minion' ? (
              <Button variant='ghost'>
                <TextBox>Minion Page</TextBox>
              </Button>
            ) : (
              <Button variant='ghost'>
                <TextBox>Details</TextBox>
              </Button>
            )
          }
        />
      ))}
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
          isTop={dev || isFirstItem(lists, index)}
        />
      ))}
    />
  );
};
