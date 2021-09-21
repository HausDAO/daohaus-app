import React, { useState } from 'react';
import { Flex } from '@chakra-ui/layout';
import { BsCheckCircle } from 'react-icons/bs';
import { Button } from '@chakra-ui/button';
import { Spinner } from '@chakra-ui/spinner';

import FormBuilder from '../formBuilder/formBuilder';

import ProgressIndicator from './progressIndicator';

const TheLauncher = props => {
  const { goToNext, next, form } = props;

  const [menuState, setMenuState] = useState('summon');

  return <FormBuilder {...form} ctaText='Deploy' />;

  /* {menuState === 'summon' && (
          <FormBuilder {...form} lifeCycleFns={lifeCycleFns} ctaText='Deploy' />
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
        )} */
};

export default TheLauncher;
