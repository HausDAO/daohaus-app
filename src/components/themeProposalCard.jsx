import React from 'react';
import { Flex, Box, Badge, Icon } from '@chakra-ui/react';
import { FaThumbsUp } from 'react-icons/fa';
import { format } from 'date-fns';
import ContentBox from './ContentBox';
import { getCustomProposalTerm } from '../utils/metadata';

const ThemeProposalCard = ({ previewValues, customTerms }) => {
  return (
    <ContentBox
      mt={3}
      transition='all 0.15s linear'
      _hover={{ bg: previewValues.primary500, color: 'white' }}
    >
      <Flex justify='space-between'>
        <Box
          fontSize='xs'
          textTransform='uppercase'
          fontFamily={previewValues.headingFont}
          letterSpacing='0.1em'
        >
          {customTerms
            ? getCustomProposalTerm(customTerms, 'Member Proposal')
            : 'Member Proposal'}
        </Box>
        <Box>
          <Badge>Passed</Badge>
        </Box>
      </Flex>
      <Flex justify='space-between' mt={3}>
        <Box>
          <Box
            fontWeight={700}
            fontSize='lg'
            fontFamily={previewValues.headingFont}
          >
            Legendary Proposal
          </Box>
          <Box fontSize='xs' as='i' fontFamily={previewValues.bodyFont}>
            {`Submitted ${format(new Date(), 'MMM d, y')}`}
          </Box>
        </Box>
        <Box>
          <Flex align='center'>
            <Flex h='20px'>
              <Badge colorScheme='green' variant='solid' mr={3}>
                5 Yes
              </Badge>
              <Badge colorScheme='red' variant='outline'>
                2 No
              </Badge>
            </Flex>
          </Flex>
        </Box>
      </Flex>
      <Flex alignItems='center' height='80px'>
        <Box fontSize='sm'>
          <Flex
            pl={6}
            w='40px'
            borderColor={previewValues.secondary500}
            borderWidth='2px'
            borderStyle='solid'
            borderRadius='40px'
            p={1}
            h='40px'
            justify='center'
            align='center'
            m='0 auto'
          >
            <Icon as={FaThumbsUp} color={previewValues.secondary500} />
          </Flex>
        </Box>
      </Flex>
      <Flex justify='space-between' mt={2}>
        <Box>
          <Box
            textTransform='uppercase'
            fontSize='xs'
            fontFamily={previewValues.headingFont}
            fontWeight={400}
            letterSpacing='0.1em'
            color='whiteAlpha.600'
          >
            Tribute
          </Box>
          <Box
            fontSize='lg'
            fontFamily={previewValues.monoFont}
            fontWeight={700}
          >
            10 WETH
          </Box>
        </Box>
        <Box>
          <Box
            textTransform='uppercase'
            fontSize='xs'
            fontFamily={previewValues.headingFont}
            fontWeight={400}
            letterSpacing='0.1em'
            color='whiteAlpha.600'
          >
            Shares
          </Box>
          <Box
            fontSize='lg'
            fontFamily={previewValues.monoFont}
            fontWeight={700}
          >
            10
          </Box>
        </Box>
        <Box>
          <Box
            textTransform='uppercase'
            fontSize='xs'
            fontFamily={previewValues.headingFont}
            fontWeight={400}
            letterSpacing='0.1em'
            color='whiteAlpha.600'
          >
            Loot
          </Box>
          <Box
            fontSize='lg'
            fontFamily={previewValues.monoFont}
            fontWeight={700}
          >
            90
          </Box>
        </Box>
      </Flex>
    </ContentBox>
  );
};

export default ThemeProposalCard;
