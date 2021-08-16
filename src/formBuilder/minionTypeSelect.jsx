import React, { useMemo, useState } from 'react';
import { Flex } from '@chakra-ui/layout';

import { useParams } from 'react-router';
import { capitalize } from '../utils/general';
import { MINION_TYPES } from '../utils/proposalUtils';
import { MINION_CONTENT, MINION_NETWORKS } from '../data/minions';
import GenericSelect from './genericSelect';
import Paragraphs from './Paragraphs';
import Header from './header';

const betterCapitalize = string => {
  if (!string) return null;
  const words = string.split(' ');
  if (words?.length <= 1) {
    return capitalize(words);
  }
  return words.map(word => capitalize(word)).join(' ');
};
const descrip = [
  'Minions are horrible beings you can summon from the earth.',
  'You can use them sew destruction and peril across the land. Make them do your bidding, bring the world to its knees, etc...',
];
const minions = Object.entries(MINION_TYPES).map(([key, value]) => ({
  id: key,
  name: betterCapitalize(value),
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
      <Header mb={4}>Summon a {currentMinion?.header || 'Minion'}</Header>
      <GenericSelect
        options={eligableMinions}
        placeholder='Select a minion'
        onChange={handleChange}
        mb={6}
        {...props}
      />
      <Paragraphs pars={currentMinion?.info || descrip} />
    </Flex>
  );
};

export default MinionTypeSelect;
