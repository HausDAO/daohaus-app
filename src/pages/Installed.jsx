import React, { useEffect, useMemo, useState } from 'react';
import { Flex, Spinner, Button, InputGroup, Input } from '@chakra-ui/react';
import { useHistory, useParams } from 'react-router';

import { useMetaData } from '../contexts/MetaDataContext';
import { useDao } from '../contexts/DaoContext';
import ListSelectorItem from '../components/ListSelectorItem';
import TextBox from '../components/TextBox';
import List from '../components/list';
import NoListItem from '../components/NoListItem';
import ListSelector from '../components/ListSelector';
import ListItem from '../components/listItem';

import { daoConnectedAndSameChain, isLastItem } from '../utils/general';
import { generateLists } from '../utils/marketplace';
import BoostItemButton from '../components/boostItemButton';
import ListItemButton from '../components/listItemButton';
import { useTX } from '../contexts/TXContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useDaoMember } from '../contexts/DaoMemberContext';
import { useAppModal } from '../hooks/useModals';
import { STEPS } from '../data/boosts';

const dev = process.env.REACT_APP_DEV;

const handleSearch = (list, listID, searchStr) => {
  if (!searchStr) return list;
  if (!list?.length) return [];
  return list.filter(item => {
    if (listID === 'minions') {
      return item?.title.toLowerCase().includes(searchStr);
    }
    return item?.boostContent?.title.toLowerCase().includes(searchStr);
  });
};

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

const InstalledList = ({
  listID,
  lists,
  installBoost,
  openDetails,
  goToSettings,
}) => {
  const { daoid, daochain } = useParams();
  const history = useHistory();
  const { stepperModal } = useAppModal();
  const { hydrateString } = useTX();
  const { address, injectedChain } = useInjectedProvider();
  const { daoMember } = useDaoMember();

  const [searchStr, setSearchStr] = useState(null);

  const canInteract =
    daoConnectedAndSameChain(address, injectedChain?.chainId, daochain) &&
    +daoMember?.shares > 0;

  const currentList = useMemo(() => {
    if (listID && lists) {
      return handleSearch(
        lists?.find(list => list.id === listID).types,
        listID,
        searchStr,
      );
    }
  }, [listID, lists, searchStr]);

  const handleSummon = () => {
    stepperModal(STEPS.SUMMON_ANY);
  };

  const handleMinionSettings = ({ data, id }) => {
    if (data.settings.localUrl) {
      const url = hydrateString({
        string: data.settings.localUrl,
        daoid,
        daochain,
        minionAddress: id,
      });
      history.push(url);
    }
  };

  const renderMinions = () => {
    if (!currentList?.length) {
      return (
        <NoListItem>
          <TextBox>No Minions Installed</TextBox>
        </NoListItem>
      );
    }
    return currentList?.map(minion => {
      return (
        <ListItem
          {...minion}
          key={minion.id}
          menuSection={
            <ListItemButton
              value={minion}
              onClick={handleMinionSettings}
              mainText='Settings'
            />
          }
        />
      );
    });
  };

  const renderBoosts = () => {
    if (!currentList?.length) {
      return (
        <NoListItem>
          <TextBox>No Boosts Installed</TextBox>
        </NoListItem>
      );
    }
    return currentList?.map(boost => (
      <ListItem
        title={boost.boostContent?.title}
        description={boost.boostContent?.description}
        key={boost.id}
        menuSection={
          <BoostItemButton
            boost={{ ...boost, isAvailable: true, isInstalled: true }}
            installBoost={installBoost}
            openDetails={openDetails}
            goToSettings={goToSettings}
          />
        }
      />
    ));
  };

  const handleChange = e => setSearchStr(e.target.value.toLowerCase().trim());
  return (
    <List
      headerSection={
        <Flex
          w='100%'
          justifyContent='space-between'
          flexDir={['column', 'column', 'row']}
        >
          <InputGroup w='250px' mr={6} mb={3}>
            <Input
              onChange={handleChange}
              placeholder={`Search ${listID || 'Installed'}...`}
            />
          </InputGroup>
          {canInteract && (
            <Button
              variant='outline'
              onClick={handleSummon}
              width='fit-content'
            >
              Summon Minion
            </Button>
          )}
        </Flex>
      }
      list={listID === 'minions' ? renderMinions() : renderBoosts()}
    />
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
