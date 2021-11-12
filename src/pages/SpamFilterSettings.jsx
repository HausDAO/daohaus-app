import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Flex, Box, Text } from '@chakra-ui/react';

import MainViewLayout from '../components/mainViewLayout';
import useBoost from '../hooks/useBoost';
import { getReadableBalance } from '../utils/tokenValue';

const SpamFilterSettings = ({ daoMetaData, daoOverview }) => {
  const { daoid, daochain } = useParams();
  const { isActive, isLaunched } = useBoost();

  return (
    <MainViewLayout header='Spam Filter' isDao>
      {isLaunched('SPAM_FILTER') && daoOverview && (
        <Flex direction='column' justify='flex-start' fontSize='lg'>
          <Flex mt={5}>
            Proposal list spam filter is{' '}
            {isActive('SPAM_FILTER') ? (
              <Text color='green' fontWeight='700' ml={2}>
                ON
              </Text>
            ) : (
              'OFF'
            )}
          </Flex>

          <Box mt={5}>
            {`When on, proposals without a minimum tribute of ${getReadableBalance(
              {
                balance:
                  daoMetaData.boosts.SPAM_FILTER.metadata.paymentRequested,
                decimals: daoOverview.depositToken.decimals,
              },
            )} ${
              daoOverview.depositToken.symbol
            } will be filtered out of the proposal list. You can see those on the spam filter page.`}
          </Box>

          <Box mt={5}>
            {`The new proposal button is hidden  ${
              daoMetaData.boosts.SPAM_FILTER.metadata.membersOnly
                ? 'HIDDEN'
                : 'NOT HIDDEN'
            } for members`}
          </Box>

          <Box mt={5}>edit settings</Box>

          {isActive('SPAM_FILTER') && (
            <Box mt={5}>
              <Link to={`/dao/${daochain}/${daoid}/proposals/spam`}>
                View spam page
              </Link>
            </Box>
          )}
        </Flex>
      )}
    </MainViewLayout>
  );
};

export default SpamFilterSettings;
