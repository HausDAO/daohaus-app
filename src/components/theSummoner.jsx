import React, { useEffect, useState } from 'react';
import { Flex } from '@chakra-ui/layout';

import { useDao } from '../contexts/DaoContext';
import Header from '../formBuilder/header';
import Paragraphs from '../formBuilder/Paragraphs';
import TextBox from './TextBox';
import GenericInput from '../formBuilder/genericInput';
import { MINION_TYPES } from '../utils/proposalUtils';

const generateMinionText = ({ minionType }) => {
  return { headerText: `Summon a ${minionType}` };
};

const minionFromDaoOverview = ({ searchBy, daoOverview, searchParam }) => {
  console.log(`daoOverview`, daoOverview);
  console.log(`searchBy`, searchBy);
  console.log(`searchParam`, searchParam);
  if (!daoOverview || !searchBy || !searchParam) return;
  if (searchBy === 'type')
    return daoOverview.minions?.filter(
      minion => minion.minionType === searchParam,
    );
  if (searchBy === 'name')
    return daoOverview.minions.find(minion => minion.details === searchParam);
};

const TheSummoner = props => {
  const [minions, setMinions] = useState([]);
  const { daoOverview } = useDao();
  const {
    minionType,
    contentForMinion,
    contentForNoMinion,
    localForm,
    setCondition,
  } = props;

  const header = minions?.length
    ? contentForMinion.header
    : contentForNoMinion.header;

  useEffect(() => {
    if (daoOverview) {
      console.log(`props`, props);
      const minionsOfType = minionFromDaoOverview({
        searchBy: 'type',
        daoOverview,
        searchParam: minionType,
      });
      if (minionsOfType?.length) {
        setMinions(minionsOfType);
        setCondition('hasSummoned');
      }
    }
  }, [minionType, daoOverview]);

  return (
    <Flex flexDirection='column'>
      <TextBox>{minionType}</TextBox>
      <Header headerText={header} />

      {/* <Paragraphs />  */}
    </Flex>
  );
};

export default TheSummoner;
