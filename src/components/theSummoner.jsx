import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RiExternalLinkLine } from 'react-icons/ri';
import { Box, Divider, Flex, Link } from '@chakra-ui/layout';
import Icon from '@chakra-ui/icon';
import { Button } from '@chakra-ui/button';

import { useDao } from '../contexts/DaoContext';
import FormBuilder from '../formBuilder/formBuilder';
import TextBox from './TextBox';

import { ignoreAwaitStep } from '../utils/formBuilder';
import { MINIONS } from '../data/minions';
import { minionFromDaoOverview } from '../utils/general';

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
  const {
    parentForm,
    goToNext,
    minionData,
    secondaryBtn,
    next,
    handleThen,
    currentStep,
    updateFormSteps,
  } = props;

  const { daoOverview } = useDao();
  const { daoid, daochain } = useParams();

  const [existingMinions, setExistingMinions] = useState([]);
  const [menuState, setMenuState] = useState(
    minionData?.minionType ? null : 'summon',
  );

  const minionType = minionData?.minionType || parentForm.watch('minionType');
  const summonData = MINIONS[minionType];

  useEffect(() => {
    if (summonData.addSummonSteps) {
      updateFormSteps(summonData.addSummonSteps);
    }
  }, [minionType]);

  useEffect(() => {
    if (daoOverview && minionType && !menuState) {
      const minionsOfType = minionFromDaoOverview({
        searchBy: 'type',
        daoOverview,
        searchParam: minionType,
        crossChain: false,
      });
      if (minionsOfType?.length) {
        setExistingMinions(minionsOfType);
        setMenuState('displayExisting');
      } else {
        setMenuState('summon');
      }
    }
  }, [minionType, daoOverview, menuState]);

  const handleNext = () => goToNext(ignoreAwaitStep(next));
  const switchToSummon = () => setMenuState('summon');

  if (menuState === 'displayExisting') {
    return (
      <Flex flexDirection='column'>
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
          <Flex>
            <Button
              type='button'
              variant='outline'
              onClick={secondaryBtn.fn}
              mr={4}
            >
              {secondaryBtn.text}
            </Button>
            <Button onClick={handleNext}>{'Next >'}</Button>
          </Flex>
        </Flex>
      </Flex>
    );
  }
  if (menuState === 'summon') {
    return (
      <Flex flexDirection='column'>
        <Box mb={4}>
          <MinionNotFound minionType={minionType} />
        </Box>
        <FormBuilder
          {...summonData.summonForm}
          secondaryBtn={secondaryBtn}
          ctaText={currentStep?.ctaText || next?.ctaText || 'Next >'}
          handleThen={handleThen}
          next={next}
          goToNext={goToNext}
          parentForm={parentForm}
        />
        {!summonData?.summonForm && <TextBox>Error: Form not found</TextBox>}
      </Flex>
    );
  }

  return null;
};

export default TheSummoner;
