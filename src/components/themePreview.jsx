import React from 'react';
import { Flex, Image, Box, Icon, HStack, Button } from '@chakra-ui/react';
import { RiArrowDropDownFill } from 'react-icons/ri';
import { rgba } from 'polished';

import { useCustomTheme } from '../contexts/CustomThemeContext';
import ThemeChart from './themeChart';
import ThemeProposalCard from './themeProposalCard';
import { themeImagePath, getTerm } from '../utils/metadata';
import { useMetaData } from '../contexts/MetaDataContext';

const ThemePreview = ({ previewValues }) => {
  const { daoMetaData, customTerms } = useMetaData();
  const { theme } = useCustomTheme();

  return (
    <Flex
      m={6}
      h='600px'
      bgImage={`url(${
        previewValues.bgImg?.slice(0, 2) === 'Qm'
          ? `https://ipfs.infura.io/ipfs/${previewValues.bgImg}`
          : previewValues.bgImg
      })`}
      bgPosition='center center'
      bgRepeat='no-repeat'
      border={`0.5px solid ${theme.colors.whiteAlpha[600]}`}
      borderRadius='2px'
      overflow='scroll'
    >
      <Flex
        w='100%'
        h='900px'
        bgColor={rgba(
          previewValues.bg500,
          parseFloat(previewValues.bgOverlayOpacity || 0),
        )}
        zIndex={2}
      >
        <Flex
          h='900px'
          w='100px'
          justify='center'
          bg={previewValues.primary500}
          zIndex={3}
        >
          <Image
            src={themeImagePath(daoMetaData?.avatarImg)}
            borderRadius='40px'
            height='50px'
            width='50px'
            mt='20px'
            bg={previewValues.primary500}
            p='5px'
          />
        </Flex>
        <Flex w='100%' direction='column' zIndex={3} px={6}>
          <Flex w='100%' justify='space-between'>
            <Box
              size='xl'
              color='whiteAlpha.900'
              fontWeight={800}
              fontFamily={previewValues.headingFont}
              my={6}
            >
              {daoMetaData?.name}
            </Box>
            <HStack spacing={2}>
              <Button
                color={previewValues?.secondary500}
                borderColor={previewValues?.secondary500}
                variant='outline'
              >
                {getTerm(customTerms, 'bank')}
              </Button>
              <Button color='whiteAlpha500' bg={previewValues?.secondary500}>
                {getTerm(customTerms, 'proposals')}
              </Button>
            </HStack>
          </Flex>

          <Box>
            <ThemeChart previewValues={previewValues} />
          </Box>

          <Flex w='70%' justify='space-between' mx={6} mt={6}>
            <Flex>
              <Box
                fontFamily={previewValues.headingFont}
                textTransform='uppercase'
                color='whiteAlpha.700'
                fontSize='sm'
              >
                Filter By
              </Box>
              <Box
                color={previewValues.secondary500}
                fontFamily={previewValues.headingFont}
                textTransform='uppercase'
                fontSize='sm'
                ml={2}
              >
                All
                <Icon as={RiArrowDropDownFill} ml={1} />
              </Box>
            </Flex>
            <Flex>
              <Box
                fontFamily={previewValues.headingFont}
                textTransform='uppercase'
                color='whiteAlpha.700'
                fontSize='sm'
              >
                Sort By
              </Box>
              <Box
                color={previewValues.secondary500}
                fontFamily={previewValues.headingFont}
                textTransform='uppercase'
                fontSize='sm'
                ml={2}
              >
                Newest
                <Icon as={RiArrowDropDownFill} ml={1} />
              </Box>
            </Flex>
          </Flex>
          <Box mb={10}>
            <ThemeProposalCard
              previewValues={previewValues}
              customTerms={customTerms}
            />
          </Box>
          <Box h={20} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ThemePreview;
