import React from 'react';
import { Box } from '@chakra-ui/react';
import ContentBox from './ContentBox';
import { numberWithCommas } from '../utils/general';

const DaosquareCcoOverall = ({ totals }) => {
  return (
    <>
      <Box fontSize='xl' mb={5}>
        Overall Stats
      </Box>
      <ContentBox variant='d2'>
        <Box fontSize='xs' fontFamily='body' color='#919191'>
          Funded
        </Box>
        <Box
          fontSize='lg'
          fontFamily='heading'
          letterSpacing='0.1em'
          color='#353535'
          mb={7}
        >
          {numberWithCommas(totals.funded)} xDAI
        </Box>

        <Box fontSize='xs' fontFamily='body' color='#919191'>
          Projects Funded
        </Box>
        <Box
          fontSize='lg'
          fontFamily='heading'
          letterSpacing='0.1em'
          color='#353535'
        >
          {totals.projects}
        </Box>
      </ContentBox>
    </>
  );
};
export default DaosquareCcoOverall;
