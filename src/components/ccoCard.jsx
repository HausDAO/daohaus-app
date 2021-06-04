import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Box, Flex, Progress } from '@chakra-ui/react';
import makeBlockie from 'ethereum-blockies-base64';
import { BsEggFill } from 'react-icons/bs';

import ContentBox from './ContentBox';
import { PROPOSALS_LIST } from '../graphQL/proposal-queries';
import { getDateTime, themeImagePath } from '../utils/metadata';
import { numberWithCommas } from '../utils/general';
import { supportedChains } from '../utils/chain';
import { ccoProgressBarData, CCO_CONSTANTS } from '../utils/cco';
import { graphFetchAll } from '../utils/theGraph';
import { ccoDaoResolver } from '../utils/resolvers';

const CcoCard = ({
  daoMetaData,
  isLink,
  dao,
  ccoType,
  fundedDaoTotals,
  setFundedDaoTotals,
}) => {
  const [cardData, setCardData] = useState({
    raiseLeft:
      Number(daoMetaData.boosts[ccoType].metadata.maxTarget) -
      dao.ccoFundedAmount,
    canClaim: dao?.ccoStatus?.label === 'Funded' && dao?.ccoStatus?.claimOpen,
    barData: ccoProgressBarData(
      daoMetaData.boosts[ccoType].metadata,
      dao.ccoFundedAmount,
    ),
    fundedAmount: dao.ccoFundedAmount,
  });

  useEffect(() => {
    const getProposals = async () => {
      const proposalData = await graphFetchAll({
        endpoint: supportedChains[CCO_CONSTANTS.DAOSQUARE_NETWORK].subgraph_url,
        query: PROPOSALS_LIST,
        subfield: 'proposals',
        variables: {
          contractAddr: dao.id,
        },
      });

      const date = await getDateTime();
      const now = Number(date.seconds);
      const hydratedDao = ccoDaoResolver(dao, now, ccoType, proposalData);

      setCardData({
        raiseLeft:
          Number(daoMetaData.boosts[ccoType].metadata.maxTarget) -
          hydratedDao.ccoFundedAmount,
        canClaim:
          hydratedDao?.ccoStatus?.label === 'Funded' &&
          hydratedDao?.ccoStatus?.claimOpen,
        barData: ccoProgressBarData(
          daoMetaData.boosts[ccoType].metadata,
          hydratedDao.ccoFundedAmount,
        ),
        fundedAmount: hydratedDao.ccoFundedAmount,
      });

      if (hydratedDao?.ccoStatus?.label === 'Funded') {
        setFundedDaoTotals({
          ...fundedDaoTotals,
          [dao.id]: hydratedDao.ccoFundedAmount,
        });
      }
    };
    if (isLink) {
      getProposals();
    }
  }, [isLink]);

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
              fontWeight={900}
              fontFamily='body'
              lineHeight='1.125'
            >
              {daoMetaData?.name}
            </Box>
          </Flex>
          <Box
            ml={5}
            fontWeight={500}
            fontFamily='heading'
            letterSpacing='0.1em'
          >
            <Flex align='center'>
              {cardData.canClaim && (
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
            value={cardData.barData.minBarValue * 100}
            width={`${cardData.barData.minBarWidth * 100}%`}
            mt={7}
            mb={3}
            mr={1}
          />
          <Progress
            colorScheme='secondary'
            bg='primary.100'
            height='24px'
            value={cardData.barData.maxBarValue * 100}
            width={`${cardData.barData.maxBarWidth * 100}%`}
            mt={7}
            mb={3}
          />
        </Flex>

        <Flex direction='row' justify='space-between' w='100%'>
          <Box fontFamily='heading' fontSize='xl' letterSpacing='0.1em'>
            {`${numberWithCommas(cardData.fundedAmount.toFixed(0))} ${
              daoMetaData.boosts[ccoType].metadata.tributeTokenSymbol
            } Funded`}
          </Box>
          <Box fontFamily='heading' fontSize='xl' letterSpacing='0.1em'>
            {`${numberWithCommas(cardData.raiseLeft.toFixed(0))} ${
              daoMetaData.boosts[ccoType].metadata.tributeTokenSymbol
            } Left`}
          </Box>
        </Flex>
        <Flex mt={5} direction='row' justify='space-between' w='100%'>
          <Box>
            <Box
              fontSize='xs'
              fontFamily='body'
              color='#919191'
              textTransform='uppercase'
            >
              Funding Goal
            </Box>
            <Box fontSize='lg' fontFamily='body' color='#353535'>
              <Box as='span' color='#919191'>
                Min{' '}
              </Box>
              {`${daoMetaData.boosts[ccoType].metadata.minTarget} ${daoMetaData.boosts[ccoType].metadata.tributeTokenSymbol}`}
              <Box as='span' color='#919191'>
                {' '}
                | Max{' '}
              </Box>
              {`${daoMetaData.boosts[ccoType].metadata.maxTarget} ${daoMetaData.boosts[ccoType].metadata.tributeTokenSymbol}`}
            </Box>
          </Box>
          <Box>
            <Box
              fontSize='xs'
              fontFamily='body'
              color='#919191'
              textTransform='uppercase'
            >
              Rewards
            </Box>
            <Box fontSize='lg' fontFamily='body'>
              {`${daoMetaData.boosts[ccoType].metadata.ratio} ${daoMetaData.boosts[ccoType].metadata.claimTokenSymbol} = 1 ${daoMetaData.boosts[ccoType].metadata.tributeTokenSymbol}`}
            </Box>
          </Box>
        </Flex>
      </Box>
    </ContentBox>
  );
};
export default CcoCard;
