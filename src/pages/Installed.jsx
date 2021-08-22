import React, { useEffect, useMemo, useState } from 'react';
import { Flex, Spinner, Input, InputGroup, Button } from '@chakra-ui/react';

import { useMetaData } from '../contexts/MetaDataContext';
import { useFormModal } from '../contexts/OverlayContext';
import { useDao } from '../contexts/DaoContext';
import ListSelectorItem from '../components/ListSelectorItem';
import TextBox from '../components/TextBox';
import List from '../components/list';
import ListSelector from '../components/ListSelector';
import ListItem from '../components/listItem';

import { isLastItem } from '../utils/general';
import { generateLists } from '../utils/marketplace';
import { CORE_FORMS } from '../data/forms';

const dev = process.env.REACT_APP_DEV;

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
  const { openFormModal } = useFormModal();
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

export default Installed;
