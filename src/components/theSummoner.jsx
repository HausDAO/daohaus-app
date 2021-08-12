import React, { useEffect, useState } from 'react';
import { Flex, Link } from '@chakra-ui/layout';

import { useDao } from '../contexts/DaoContext';
import TextBox from './TextBox';

const minionFromDaoOverview = ({ searchBy, daoOverview, searchParam }) => {
  if (!daoOverview || !searchBy || !searchParam) return;
  if (searchBy === 'type')
    return daoOverview.minions?.filter(
      minion => minion.minionType === searchParam,
    );
  if (searchBy === 'name')
    return daoOverview.minions.find(minion => minion.details === searchParam);
};

const MinionNotFound = ({ minionType = 'Minion' }) => (
  <TextBox variant='body' size='sm'>
    This boost is dependent on a {minionType} contract. The following minions
    can be selected or a new one can be created.
    <Link
      href='https://daohaus.club/docs/users/minion-faq'
      color='secondary.400'
      isExternal
    >
      Learn more about minions here.
    </Link>
  </TextBox>
);

const MinionFound = ({ minionType = 'Minion' }) => (
  <TextBox variant='body' size='sm'>
    This boost is dependent on a {minionType} contract. Use the form below to
    summon a new minion.{' '}
    <Link
      href='https://daohaus.club/docs/users/minion-faq'
      color='secondary.400'
    >
      Learn more about minions here.
    </Link>
  </TextBox>
);

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

  useEffect(() => {
    if (daoOverview) {
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
      {/* <Header headerText={header} /> */}
      <Flex justifyContent='space-between' flexWrap='wrap' />
      {minions?.length < 0 ? <MinionNotFound /> : <MinionFound />}
      {/* <Paragraphs />  */}
    </Flex>
  );
};

export default TheSummoner;
