import React from 'react';
import { Box } from '@chakra-ui/react';
import ContentBox from './ContentBox';
import TextBox from './TextBox';

const DaosquareCcoOverall = ({ totals }) => {
  return (
    <>
      <Box fontSize='xl' mb={5}>Overall Stats</Box>
      <ContentBox>
        <TextBox size='xs'>Raised</TextBox>
        <TextBox size='lg' variant='value'>
          {totals.raised}
          {' '}
          USDT
        </TextBox>

        <TextBox size='xs'>Funded</TextBox>
        <TextBox size='lg' variant='value'>
          {totals.funded}
          {' '}
          USDT
        </TextBox>

        <TextBox size='xs'>Projects Funded</TextBox>
        <TextBox size='lg' variant='value'>
          {totals.projects}
        </TextBox>
      </ContentBox>

    </>
  );
};
export default DaosquareCcoOverall;
