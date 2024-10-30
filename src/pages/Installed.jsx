import React, { useEffect, useState } from 'react';
import { Flex, Spinner } from '@chakra-ui/react';

import { useDao } from '../contexts/DaoContext';
import { useMetaData } from '../contexts/MetaDataContext';
import ListSelector from '../components/ListSelector';
import ListSelectorItem from '../components/ListSelectorItem';
import { isLastItem } from '../utils/general';
import { generateLists } from '../utils/marketplace';
import InstalledList from '../components/installedList';

const dev = process.env.REACT_APP_DEV;

const Installed = ({ installBoost, openDetails, goToSettings }) => {
  const { daoMetaData } = useMetaData();
  const { daoOverview } = useDao();
  const [lists, setLists] = useState(null);
  const [listID, setListID] = useState(null);

  useEffect(() => {
    if (daoMetaData && daoOverview) {
      const generatedLists = generateLists(daoMetaData, daoOverview, dev);
      setLists(generatedLists);
      if (generatedLists[0].id === 'dev' && dev) {
        setListID('dev');
      } else {
        setListID('boosts');
      }
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
        <Flex flexDir={['column', 'column', 'row']}>
          <ListTypeSelector
            selectList={selectList}
            listID={listID}
            lists={lists}
          />
          <InstalledList
            listID={listID}
            lists={lists}
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

const ListTypeSelector = ({ selectList, listID, lists }) => {
  return (
    <ListSelector
      divider='categories'
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
