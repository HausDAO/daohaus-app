import React from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar, Box, Flex, Progress,
} from '@chakra-ui/react';
import makeBlockie from 'ethereum-blockies-base64';

import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { themeImagePath } from '../utils/metadata';
import { numberWithCommas } from '../utils/general';
import { supportedChains } from '../utils/chain';
import { CCO_CONSTANTS } from '../utils/cco';

const DaosquareCcoCard = ({ dao }) => {
  console.log('dao', dao);

  const tempFunded = 115005;
  const tempRaiseLeft = 661661;
  const tempContributionTokenSymbol = 'xDai';

  return (
    <ContentBox
      mt={5}
      style={{ transition: 'all .15s linear' }}
      _hover={{ transform: 'scale(1.05)' }}
    >
      <Link to={`/dao/${supportedChains[CCO_CONSTANTS.DAOSQUARE_NETWORK].chain_id}/${dao.id}/cco`}>

        <Flex direction='row' justify='space-between' w='100%'>
          <Flex direction='row' align='center' w='100%'>
            <Avatar
              src={
            dao.meta?.avatarImg
              ? themeImagePath(dao.meta.avatarImg)
              : makeBlockie(dao.id)
          }
              mr='10px'
              bg='primary'
            />
            <Box
              fontSize='xl'
              fontWeight={300}
              fontFamily='heading'
              lineHeight='1.125'
            >
              {dao.meta?.name}
            </Box>
          </Flex>
          <Box ml={5}>Active</Box>
        </Flex>
        <Progress
          colorScheme='secondary'
          height='24px'
          value={100}
          mt={7}
          mb={3}
        />
        <Flex direction='row' justify='space-between' w='100%'>
          <Box>
            {numberWithCommas(tempFunded)}
            {' '}
            Funded
          </Box>
          <Box>
            {numberWithCommas(tempRaiseLeft)}
            {' '}
            {/* {dao.meta.boosts.daosquarecco.metadata.contributionTokenSymbol} */}
            {tempContributionTokenSymbol}
            {' '}
            Left
          </Box>
        </Flex>
        <Flex mt={5} direction='row' justify='space-between' w='100%'>
          <Box>
            <TextBox size='xs'>Funding Goal</TextBox>
            <TextBox size='lg' variant='value'>
              {dao.meta.boosts.daosquarecco.metadata.maxTarget}
              {' '}
              USDT
            </TextBox>
          </Box>
          <Box>
            <TextBox size='lg' variant='value'>
              1
              {' '}
              {dao.meta.boosts.daosquarecco.metadata.claimTokenSymbol}
              {' '}
              =
              {' '}
              {dao.meta.boosts.daosquarecco.metadata.ratio}
              {' '}
              {/* {dao.meta.boosts.daosquarecco.metadata.contributionTokenSymbol} */}
              {tempContributionTokenSymbol}
            </TextBox>
          </Box>
        </Flex>
      </Link>
    </ContentBox>
  );
};
export default DaosquareCcoCard;
