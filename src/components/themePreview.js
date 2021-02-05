import React from 'react';
import { Flex, Image, Box, Icon } from '@chakra-ui/react';
import { RiArrowDropDownFill } from 'react-icons/ri';

import { useCustomTheme } from '../contexts/CustomThemeContext';
// import TextBox from './TextBox';
// import BankOverviewChart from '../Bank/BankOverviewChart';
import ThemeProposalCard from './themeProposalCard';
import { themeImagePath } from '../utils/metadata';
import { useMetaData } from '../contexts/MetaDataContext';

const ThemePreview = ({ previewValues }) => {
  const { daoMetaData } = useMetaData();
  const { theme } = useCustomTheme();
  // const [balances] = useBalances();
  // const [proposals] = useProposals();
  console.log(previewValues);

  // TODO: How to get the font from previewValues?

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
      bgColor={previewValues.bg500}
      border={`0.5px solid ${theme.colors.whiteAlpha[600]}`}
      borderRadius='2px'
      overflow='scroll'
      pr={6}
    >
      <Flex h='900px' w='100px' justify='center' bg={previewValues.primary500}>
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
      <Flex w='100%' direction='column'>
        <Box
          size='xl'
          color='whiteAlpha.900'
          fontWeight={800}
          fontFamily={previewValues.headingFont}
          ml={6}
          my={6}
        >
          {daoMetaData?.name}
        </Box>
        <Box ml={6}>
          {/* <BankOverviewChart balances={balances} dao={dao} /> */}
          <Box>Bank Chart</Box>
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
              All <Icon as={RiArrowDropDownFill} />
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
            </Box>{' '}
            <Box
              color={previewValues.secondary500}
              fontFamily={previewValues.headingFont}
              textTransform='uppercase'
              fontSize='sm'
              ml={2}
            >
              Newest <Icon as={RiArrowDropDownFill} />
            </Box>
          </Flex>
        </Flex>
        <Box m={6} mb={10}>
          <ThemeProposalCard previewValues={previewValues} />
        </Box>
        <Box h={20} />
      </Flex>
    </Flex>
  );
};

export default ThemePreview;
