import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Button, Flex } from '@chakra-ui/react';

import { useCustomTheme } from '../contexts/CustomThemeContext';
import ContentBox from './ContentBox';
import { banners } from '../utils/poap-helpers';

const OverviewBanner = ({ bannerType }) => {
  const { daochain, daoid } = useParams();
  const { theme } = useCustomTheme();
  const bannerData = banners[bannerType];

  return (
    <ContentBox
      mt={6}
      w='100%'
      style={{ background: theme.colors.primary[500] }}
    >
      <Flex align='center' justify='space-between'>
        <Box fontSize='lg' fontWeight={700} fontFamily='heading'>
          {bannerData.headline}
        </Box>
        <Button
          as={Link}
          to={`/dao/${daochain}/${daoid}/${bannerData.path}`}
          isExternal
          variant='outline'
          color='white'
          borderColor='white'
          _hover={{ background: theme.colors.primary[600], color: 'white' }}
        >
          {bannerData.linkText}
        </Button>
      </Flex>
    </ContentBox>
  );
};

export default OverviewBanner;
