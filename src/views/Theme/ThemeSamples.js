import React from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';

import ContentBox from '../../components/Shared/ContentBox';
import TextBox from '../../components/Shared/TextBox';

const gradientValues = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

const ThemeSamples = () => {
  return (
    <Flex mt={6}>
      <ContentBox w='100%' justify='center' d='flex' mr={6}>
        <Flex direction='column' w='33%'>
          <Box
            fontSize='lg'
            fontFamily='heading'
            textTransform='uppercase'
            textAlign='center'
          >
            Primary
          </Box>
          {gradientValues.map((gradient) => {
            return (
              <Flex
                key={`p${gradient}`}
                w='100%'
                bg={`primary.${gradient}`}
                p={4}
                justify='center'
              >
                <Box fontFamily='mono' fontSize='lg' fontWeight={700}>
                  primary[{gradient}]
                </Box>
              </Flex>
            );
          })}
        </Flex>
        <Flex direction='column' w='33%'>
          <Box
            fontSize='lg'
            fontFamily='heading'
            textTransform='uppercase'
            textAlign='center'
          >
            Secondary
          </Box>
          {gradientValues.map((gradient) => {
            return (
              <Flex
                key={`s${gradient}`}
                w='100%'
                bg={`secondary.${gradient}`}
                p={4}
                justify='center'
              >
                <Box fontFamily='mono' fontSize='lg' fontWeight={700}>
                  secondary[{gradient}]
                </Box>
              </Flex>
            );
          })}
        </Flex>
        <Flex direction='column' w='33%'>
          <Box
            fontSize='lg'
            fontFamily='heading'
            textTransform='uppercase'
            textAlign='center'
          >
            Background
          </Box>
          {gradientValues.map((gradient) => {
            return (
              <Flex
                key={`s${gradient}`}
                w='100%'
                bg={`background.${gradient}`}
                p={4}
                justify='center'
              >
                <Box fontFamily='mono' fontSize='lg' fontWeight={700}>
                  background[{gradient}]
                </Box>
              </Flex>
            );
          })}
        </Flex>
      </ContentBox>
      <ContentBox w='100%'>
        <Heading mb={6} align='center'>
          Content Box
        </Heading>
        <Flex justify='space-evenly' w='100%'>
          <Box>
            <TextBox size='xs'>Label</TextBox>
            <TextBox variant='value' size='xl'>
              $420.69
            </TextBox>
          </Box>
          <Box>
            <TextBox size='xs'>Label</TextBox>
            <TextBox variant='value' size='xl'>
              $420.69
            </TextBox>
          </Box>
          <Box>
            <TextBox size='xs'>Label</TextBox>
            <TextBox variant='value' size='xl'>
              $420.69
            </TextBox>
          </Box>
        </Flex>
      </ContentBox>
    </Flex>
  );
};

export default ThemeSamples;
