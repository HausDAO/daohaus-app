import React from 'react';
import { Box } from '@chakra-ui/react';
import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { numberWithCommas } from '../utils/general';

const DaosquareCcoOverall = ({ totals }) => {
  return (
    <>
      <Box fontSize='xl' mb={5}>
        Overall Stats
      </Box>
      <ContentBox variant='d2'>
        <TextBox size='xs' variant='label'>
          Funded
        </TextBox>
        <TextBox size='lg' variant='value' mb={7}>
          {numberWithCommas(totals.funded)} USDT
        </TextBox>

        <TextBox size='xs' variant='label'>
          Projects Funded
        </TextBox>
        <TextBox size='lg' variant='value'>
          {totals.projects}
        </TextBox>
      </ContentBox>
    </>
  );
};
export default DaosquareCcoOverall;
