import { Box, Flex } from '@chakra-ui/layout';
import { v4 as uuid } from 'uuid';

import React from 'react';

import TextBox from '../components/TextBox';

const Paragraphs = props => {
  const { pars } = props;
  console.log(pars);
  return (
    <Flex flexDirection='column'>
      {pars?.length > 0 && (
        <Box mb={3}>
          {pars.map(par => (
            <TextBox key={uuid()} variant='body' mb={3} size='sm'>
              {par}
            </TextBox>
          ))}
        </Box>
      )}
    </Flex>
  );
};

export default Paragraphs;
