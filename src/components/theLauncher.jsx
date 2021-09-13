import React, { useState } from 'react';
import { Flex } from '@chakra-ui/layout';
import { BsCheckCircle } from 'react-icons/bs';
import { Button } from '@chakra-ui/button';
import { Spinner } from '@chakra-ui/spinner';

import FormBuilder from '../formBuilder/formBuilder';
import Header from '../formBuilder/header';

import ProgressIndicator from './progressIndicator';

const TheLauncher = props => {
  const { goToNext, next, lego, boostContent } = props;

  const [menuState, setMenuState] = useState('summon');

  const handleNext = () => goToNext();
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

  if (
    menuState === 'summon' ||
    menuState === 'summoned' ||
    menuState === 'summoning'
  ) {
    return (
      <Flex flexDirection='column'>
        <Header>{boostContent.title}</Header>

        {menuState === 'summon' && (
          <FormBuilder {...lego} lifeCycleFns={lifeCycleFns} ctaText='Deploy' />
        )}
        {menuState === 'summoning' && (
          <ProgressIndicator prepend={<Spinner mr={3} />} text='Deploying...' />
        )}
        {menuState === 'summoned' && (
          <ProgressIndicator icon={BsCheckCircle} text='Contract Deployed!' />
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
      </Flex>
    );
  }

  return null;
};

export default TheLauncher;
