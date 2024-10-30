import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Flex, Badge } from '@chakra-ui/layout';

import { useCustomTheme } from '../contexts/CustomThemeContext';
import useBoost from '../hooks/useBoost';

const SpamFilterListNotification = () => {
  const { theme } = useCustomTheme();
  const { daoid, daochain } = useParams();
  const { isActive } = useBoost();

  return (
    <Flex
      wrap='wrap'
      position='relative'
      justifyContent='space-between'
      border={`2px ${theme.colors.secondary[500]} solid`}
      borderRadius='md'
      p={3}
      my={5}
    >
      <Box mr='3'>
        Spam filter is
        <Badge ml={2} variant='solid' colorScheme='green'>
          On
        </Badge>
      </Box>
      <Flex position='relative' justifyContent='space-between'>
        {isActive('SPAM_FILTER') && (
          <Box mr={5}>
            <Link to={`/dao/${daochain}/${daoid}/proposals/spam`}>
              Filtered Proposals
            </Link>
          </Box>
        )}
        <Box>
          <Link to={`/dao/${daochain}/${daoid}/settings/spam`} ml={5}>
            View Boost Settings
          </Link>
        </Box>
      </Flex>
    </Flex>
  );
};

export default SpamFilterListNotification;
