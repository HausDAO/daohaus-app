import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import WrongNetworkToolTip from './wrongNetworkToolTip';
import { getTerm } from '../utils/metadata';
import Web3SignIn from './web3SignIn';
import DaosquareHeader from './daoSquareHeader';

const PageHeader = ({ isDao, isDaosquare, header, headerEl, customTerms }) => {
  return (
    <Flex direction='row' justify='space-between' p={6}>
      <Flex
        direction='row'
        justify={['space-between', null, null, 'flex-start']}
        align='center'
        w={['100%', null, null, 'auto']}
      >
        {isDaosquare ? (
          <Box
            fontSize={['lg', null, null, 'xl']}
            fontFamily='heading'
            fontWeight={700}
            mr={0}
            w='100%'
          >
            {customTerms ? getTerm(customTerms, header) : header}
          </Box>
        ) : (
          <Box
            fontSize={['lg', null, null, '3xl']}
            fontFamily='heading'
            fontWeight={700}
            mr={10}
          >
            {customTerms ? getTerm(customTerms, header) : header}
          </Box>
        )}
        {headerEl}
        {isDaosquare && <DaosquareHeader />}
      </Flex>
      <Flex
        direction='row'
        justify='flex-end'
        align='center'
        d={['none', null, null, 'flex']}
      >
        {isDao && <WrongNetworkToolTip />}
        <Web3SignIn isDao={isDao} />
      </Flex>
    </Flex>
  );
};
export default PageHeader;
