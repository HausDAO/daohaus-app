import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Flex } from '@chakra-ui/layout';

import GenericSelect from './genericSelect';
import Paragraphs from './Paragraphs';
import TextBox from '../components/TextBox';
import { MINIONS } from '../data/minions';
import { MINION_TYPES } from '../utils/proposalUtils';

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
  name: MINIONS[value]?.content?.title,
  value,
}));

const MinionTypeSelect = props => {
  const { daochain } = useParams();
  const [minionType, setMinionType] = useState(null);
  const currentMinion = MINIONS[minionType]?.content;

  const eligableMinions = useMemo(() => {
    if (!minions || !daochain) return;
    return minions?.filter(
      minion =>
        !MINIONS[minion.value]?.deprecated &&
        (MINIONS?.[minion.value]?.networks?.[daochain] ||
          MINIONS?.[minion.value]?.networks === 'all'),
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
