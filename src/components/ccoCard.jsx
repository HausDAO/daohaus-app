import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Box, Flex, Progress } from '@chakra-ui/react';
import makeBlockie from 'ethereum-blockies-base64';

import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { themeImagePath } from '../utils/metadata';
import { numberWithCommas } from '../utils/general';
import { supportedChains } from '../utils/chain';
import { CCO_CONSTANTS } from '../utils/cco';

const CcoCard = ({ daoMetaData, isLink }) => {
  const tempFunded = 115005;
  const tempRaiseLeft = 661661;

  return (
    <ContentBox
      mt={5}
      variant='d2'
      style={{ transition: 'all .15s linear' }}
      _hover={isLink && { transform: 'scale(1.01)' }}
    >
      <Box
        as={isLink && Link}
        to={
          isLink &&
          `/dao/${supportedChains[CCO_CONSTANTS.DAOSQUARE_NETWORK].chain_id}/${
            daoMetaData.contractAddress
          }/cco`
        }
      >
        <Flex direction='row' justify='space-between' w='100%'>
          <Flex direction='row' align='center' w='100%'>
            <Avatar
              src={
                daoMetaData?.avatarImg
                  ? themeImagePath(daoMetaData.avatarImg)
                  : makeBlockie(daoMetaData.contractAddress)
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
              {daoMetaData?.name}
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
          <Box>{numberWithCommas(tempFunded)} Funded</Box>
          <Box>
            {numberWithCommas(tempRaiseLeft)}{' '}
            {daoMetaData.boosts.daosquarecco.metadata.contributionTokenSymbol}
            Left
          </Box>
        </Flex>
        <Flex mt={5} direction='row' justify='space-between' w='100%'>
          <Box>
            <TextBox size='xs'>Funding Goal</TextBox>
            <TextBox size='lg' variant='value'>
              {daoMetaData.boosts.daosquarecco.metadata.maxTarget} USDT
            </TextBox>
          </Box>
          <Box>
            <TextBox size='lg' variant='value'>
              {`${daoMetaData.boosts.daosquarecco.metadata.ratio} ${daoMetaData.boosts.daosquarecco.metadata.claimTokenSymbol} = 1 ${daoMetaData.boosts.daosquarecco.metadata.tributeTokenSymbol}`}
            </TextBox>
          </Box>
        </Flex>
      </Box>
    </ContentBox>
  );
};
export default CcoCard;
