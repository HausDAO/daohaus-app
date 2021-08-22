import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Box, Divider, Flex, Link } from '@chakra-ui/layout';
import { BsCheckCircle } from 'react-icons/bs';
import { RiExternalLinkLine } from 'react-icons/ri';
import Icon from '@chakra-ui/icon';
import { Button } from '@chakra-ui/button';
import { Spinner } from '@chakra-ui/spinner';

import { useDao } from '../contexts/DaoContext';
import FormBuilder from '../formBuilder/formBuilder';
import Header from '../formBuilder/header';
import TextBox from './TextBox';

import { SUMMON_DATA } from '../data/minions';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import { capitalizeWords } from '../utils/general';
import ProgressIndicator from './progressIndicator';

const minionFromDaoOverview = ({ searchBy, daoOverview, searchParam }) => {
  if (!daoOverview || !searchBy || !searchParam) return;
  if (searchBy === 'type')
    return daoOverview.minions?.filter(
      minion => minion.minionType === searchParam,
    );
  if (searchBy === 'name')
    return daoOverview.minions.find(minion => minion.details === searchParam);
};

const MinionFound = props => {
  const { minionType = 'minion' } = props;
  return (
    <TextBox variant='body' size='sm'>
      The DAO already has a {minionType}. You may choose to skip this step or
      summon another.{' '}
      <Link
        href='https://daohaus.club/docs/users/minion-faq'
        color='secondary.400'
        isExternal
      >
        Learn more about minions here.
      </Link>
    </TextBox>
  );
};

const MinionNotFound = ({ minionType = 'Minion' }) => {
  return (
    <TextBox variant='body' size='sm'>
      This boost is dependent on a {minionType} contract. Use the form below to
      summon a new minion.{' '}
      <Link
        href='https://daohaus.club/docs/users/minion-faq'
        isExternal
        color='secondary.400'
      >
        Learn more about minions here.
      </Link>
    </TextBox>
  );
};

const TheSummoner = props => {
  const { localForm, goToNext, minionData, next } = props;
  const { daoOverview } = useDao();
  const { daoid, daochain } = useParams();

  const [existingMinions, setExistingMinions] = useState([]);
  const [menuState, setMenuState] = useState(
    minionData?.minionType ? null : 'summon',
  );

  const minionType = minionData?.minionType || localForm.watch('minionType');
  const summonData = SUMMON_DATA[minionType];

  useEffect(() => {
    if (daoOverview && minionType && !menuState) {
      const minionsOfType = minionFromDaoOverview({
        searchBy: 'type',
        daoOverview,
        searchParam: minionType,
      });
      if (minionsOfType?.length) {
        console.log(minionsOfType);
        setExistingMinions(minionsOfType);
        setMenuState('displayExisting');
      } else {
        setMenuState('summon');
      }
    }
  }, [minionType, daoOverview, menuState]);

  const handleNext = () => goToNext();
  const switchToSummon = () => setMenuState('summon');
  const lifeCycleFns = {
    beforeTx() {
      setMenuState('summoning');
    },
    onPollSuccess() {
      setMenuState('summoned');
    },
    onCatch() {
      setMenuState('summon');
    },
  };

  if (menuState === 'displayExisting') {
    return (
      <Flex flexDirection='column'>
        <Header>{minionType}</Header>
        <MinionFound minionType={minionType} />
        <Flex flexDir='column' mb={4}>
          <Flex w='100%' mt={6} mb={4}>
            <TextBox size='sm' w='40%'>
              minion name
            </TextBox>
            <TextBox size='sm'>type</TextBox>
          </Flex>

          {existingMinions?.map(minion => (
            <Box key={minion.minionAddress}>
              <Flex mb={2}>
                <TextBox variant='body' w='40%' mr={2}>
                  {minion.details}
                  <Link
                    to={`/${daochain}/${daoid}/vaults/minion/${minion.minionAddress}`}
                    isExternal
                    transform='translateY(-1px)'
                    ml={2}
                  >
                    <Icon
                      as={RiExternalLinkLine}
                      transform='translateY(-2px)'
                    />
                  </Link>
                </TextBox>
                <TextBox variant='body'>{minion.minionType}</TextBox>
              </Flex>
              <Divider mb={2} />
            </Box>
          ))}
        </Flex>
        <Button
          w='fit-content'
          variant='outline'
          onClick={switchToSummon}
          value='summon'
        >
          Summon Another
        </Button>
        <Flex mt={6} justifyContent='flex-end'>
          <Button onClick={handleNext}>{'Next >'}</Button>
        </Flex>
      </Flex>
    );
  }
  if (
    menuState === 'summon' ||
    menuState === 'summoned' ||
    menuState === 'summoning'
  ) {
    return (
      <Flex flexDirection='column'>
        <Header>{minionType}</Header>
        <Box mb={4}>
          <MinionNotFound minionType={minionType} />
        </Box>
        {summonData?.summonForm && menuState === 'summon' && (
          <FormBuilder
            {...summonData.summonForm}
            lifeCycleFns={lifeCycleFns}
            ctaText='Deploy'
          />
        )}
        {menuState === 'summoning' && (
          <ProgressIndicator prepend={<Spinner mr={3} />} text='Deploying...' />
        )}
        {menuState === 'summoned' && (
          <ProgressIndicator icon={BsCheckCircle} text='Minion Deployed!' />
        )}
        {menuState !== 'summon' && (
          <Flex mt={6} justifyContent='flex-end'>
            {menuState === 'summoning' && (
              <Button disabled>Deploying...</Button>
            )}
            {menuState === 'summoned' && (
              <Button onClick={handleNext}>
                {next === 'DONE' ? 'Finish' : 'Next >'}
              </Button>
            )}
          </Flex>
        )}
        {!summonData?.summonForm && <TextBox>Error: Form not found</TextBox>}
      </Flex>
    );
  }

  return null;
};

export default TheSummoner;
