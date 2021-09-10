import React, { useMemo, useState } from 'react';
import { Flex } from '@chakra-ui/layout';

import { useParams } from 'react-router';
import { MINION_TYPES } from '../utils/proposalUtils';
import { MINION_CONTENT, MINION_NETWORKS } from '../data/minions';
import GenericSelect from './genericSelect';
import Paragraphs from './Paragraphs';
import Header from './header';
import TextBox from '../components/TextBox';

const noneSelected = {
  title: 'Minion',
  description: 'Choose and summon a minion for your DAO',
  info: [
    'Minions are smart contracts that allow your DAO to interact with other smart contracts.',
    'Some minions are generic, meaning that they can be used for many boosts (add-ons), while others are specialized to work within a single protocol.',
  ],
};

const minions = Object.entries(MINION_TYPES).map(([key, value]) => ({
  id: key,
  name: MINION_CONTENT[value].title,
  value,
}));

const MinionTypeSelect = props => {
  const { daochain } = useParams();
  const [minionType, setMinionType] = useState(null);
  const currentMinion = MINION_CONTENT[minionType];

  const eligableMinions = useMemo(() => {
    if (!minions || !daochain) return;
    return minions?.filter(
      minion =>
        MINION_NETWORKS?.[minion.value]?.[daochain] ||
        MINION_NETWORKS?.[minion.value] === 'all',
    );
  }, [minions, daochain]);

  const handleChange = e => {
    const { value } = e?.target;
    if (value) {
      setMinionType(value);
    } else {
      setMinionType(null);
    }
  };

  return (
    <Flex flexDir='column'>
      <Header mb={4}>
        Summon a {currentMinion?.title || noneSelected.title}
      </Header>
      <TextBox variant='body' size='sm' mb={4}>
        {currentMinion?.description || noneSelected.description}
      </TextBox>
      <GenericSelect
        options={eligableMinions}
        placeholder='Select a minion'
        onChange={handleChange}
        mb={6}
        {...props}
      />
      <Paragraphs pars={currentMinion?.info || noneSelected.info} />
    </Flex>
  );
};

export default MinionTypeSelect;
