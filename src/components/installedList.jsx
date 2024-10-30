import React, { useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Flex, Button, InputGroup, Input } from '@chakra-ui/react';

import { useTX } from '../contexts/TXContext';
import { useAppModal } from '../hooks/useModals';
import useCanInteract from '../hooks/useCanInteract';

import BoostItemButton from './boostItemButton';
import List from './list';
import ListItem from './listItem';
import ListItemButton from './listItemButton';
import NoListItem from './NoListItem';
import TextBox from './TextBox';
import { STEPS } from '../data/boosts';

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

const InstalledList = ({
  listID,
  lists,
  installBoost,
  openDetails,
  goToSettings,
}) => {
  const { canInteract } = useCanInteract({});
  const { daoid, daochain } = useParams();
  const history = useHistory();
  const { stepperModal } = useAppModal();
  const { hydrateString } = useTX();

  const [searchStr, setSearchStr] = useState(null);

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

export default InstalledList;
