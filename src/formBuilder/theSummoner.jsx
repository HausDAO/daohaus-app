import React, { useState } from 'react';
import { Flex } from '@chakra-ui/layout';

import { useDao } from '../contexts/DaoContext';
import Header from './header';
import Paragraphs from './Paragraphs';
import TextBox from '../components/TextBox';

const generateMinionText = ({ minionType }) => {
  return { headerText: `Summon a ${minionType}` };
};

const TheSummoner = ({ minionType, hasMinionContent, noMinionContent }) => {
  const [hasMinion, setHasMinion] = useState();
  const { daoOverview } = useDao();

  return (
    <Flex>
      <TextBox>Fuck</TextBox>
      {/* <Header />
      <Paragraphs /> */}
    </Flex>
  );
};

export default TheSummoner;
