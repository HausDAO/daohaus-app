import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Box, Flex, Progress } from '@chakra-ui/react';
import makeBlockie from 'ethereum-blockies-base64';
import { BsEggFill } from 'react-icons/bs';

import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { themeImagePath } from '../utils/metadata';
import { numberWithCommas } from '../utils/general';
import { supportedChains } from '../utils/chain';
import { ccoProgressBarData, CCO_CONSTANTS } from '../utils/cco';

const CcoCard = ({ daoMetaData, isLink, dao, ccoType }) => {
  const raiseLeft =
    Number(daoMetaData.boosts[ccoType].metadata.maxTarget) -
    dao.ccoFundedAmount;
  const canClaim =
    dao?.ccoStatus?.label === 'Funded' && dao?.ccoStatus?.claimOpen;
  const barData = ccoProgressBarData(
    daoMetaData.boosts[ccoType].metadata,
    dao.ccoFundedAmount,
  );

  return (
    <ContentBox
      variant='d2'
      style={{ transition: 'all .15s linear' }}
      _hover={isLink && { transform: 'scale(1.01)' }}
      my={5}
    >
      <Box
        as={isLink && Link}
        color='inherit'
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
          <Box ml={5}>
            <Flex align='center'>
              {canClaim && (
                <BsEggFill style={{ marginRight: '5px', fill: '#F49C32' }} />
              )}
              {dao?.ccoStatus?.label}
            </Flex>
          </Box>
        </Flex>
        <Flex>
          <Progress
            colorScheme='secondary'
            bg='primary.100'
            height='24px'
            value={barData.minBarValue * 100}
            width={`${barData.minBarWidth * 100}%`}
            mt={7}
            mb={3}
            mr={1}
          />
          <Progress
            colorScheme='secondary'
            bg='primary.100'
            height='24px'
            value={barData.maxBarValue * 100}
            width={`${barData.maxBarWidth * 100}%`}
            mt={7}
            mb={3}
          />
        </Flex>

        <Flex direction='row' justify='space-between' w='100%'>
          <Box fontFamily='heading' fontSize='xl'>
            {`${numberWithCommas(dao.ccoFundedAmount)} ${
              daoMetaData.boosts[ccoType].metadata.tributeTokenSymbol
            } Funded`}
          </Box>
          <Box fontFamily='heading' fontSize='xl'>
            {`${numberWithCommas(raiseLeft)} ${
              daoMetaData.boosts[ccoType].metadata.tributeTokenSymbol
            } Left`}
          </Box>
        </Flex>
        <Flex mt={5} direction='row' justify='space-between' w='100%'>
          <Box>
            <TextBox variant='label' size='xs'>
              Funding Goal
            </TextBox>
            <TextBox size='lg' variant='value'>
              {`Min ${daoMetaData.boosts[ccoType].metadata.minTarget} ${daoMetaData.boosts[ccoType].metadata.tributeTokenSymbol} | Max ${daoMetaData.boosts[ccoType].metadata.maxTarget} ${daoMetaData.boosts[ccoType].metadata.tributeTokenSymbol}`}
            </TextBox>
          </Box>
          <Box>
            <TextBox variant='label' size='xs'>
              Rewards
            </TextBox>
            <TextBox size='lg' variant='value'>
              {`${daoMetaData.boosts[ccoType].metadata.ratio} ${daoMetaData.boosts[ccoType].metadata.claimTokenSymbol} = 1 ${daoMetaData.boosts[ccoType].metadata.tributeTokenSymbol}`}
            </TextBox>
          </Box>
        </Flex>
      </Box>
    </ContentBox>
  );
};
export default CcoCard;
