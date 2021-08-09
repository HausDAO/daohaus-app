import React, { useState } from 'react';
import { Flex } from '@chakra-ui/layout';

import { useDao } from '../contexts/DaoContext';
import Header from './header';
import Paragraphs from './Paragraphs';

const minionContent = {};

const MinionSummonInput = ({ minionType, content }) => {
  const [hasMinion, setHasMinion] = useState();
  const { daoOverview } = useDao();

  return (
    <Flex>
      <Header />
      <Paragraphs />
    </Flex>
  );
};

export default MinionSummonInput;
