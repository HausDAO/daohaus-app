import React from 'react';
import { Box, ButtonGroup, Flex, Heading, Button } from '@chakra-ui/core';

import { useTheme } from '../../contexts/CustomThemeContext';
import ThemeInputsForm from './ThemeBuilderForm';
import raidBg from '../../assets/themes/raidTheme/raid__fantasy--bg.jpg';
import raidBrand from '../../assets/themes/raidTheme/raidguild__swords.svg';
import yearnBg from '../../assets/themes/yearn/yearn__bg--pattern--blueonwhite--light.png';
import yearnBrand from '../../assets/themes/yearn/yearn__brand__square.png';
import mcvBg from '../../assets/themes/mcv/mcv__bg.jpg';
import mcvBrand from '../../assets/themes/mcv/mcv__brand__square.png';
import DaoMetaForm from './DaoMetaForm';
// Custom Components
import ContentBox from '../../components/Shared/ContentBox';
import TextBox from '../../components/Shared/TextBox';

const gradientValues = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

const ThemeSample = () => {
  const [, setTheme] = useTheme();

  const setRaidGuildTheme = () => {
    setTheme({
      primary500: '#ff3864',
      secondary500: '#6F3EFC',
      bg500: '#121212',
      brandImg: raidBrand,
      bgImg: raidBg,
      bgOverlayOpacity: '0.5',
      primaryFont: 'Space Mono', // only temporary
      bodyFont: 'Rubik',
      daoMeta: {
        proposals: 'Quests',
        proposal: 'Quest',
        bank: 'Inventory',
        members: 'Players',
        member: 'Player',
        boosts: 'Boosts',
        boost: 'Boost',
        discord: 'https://discord.gg/WqwQGgeeFd',
        medium: '',
        telegram: '',
        website: '',
        other: '',
        f04title: '404 Game Over',
        f04heading: 'You have been slain',
        f04subhead: 'Please reload from the most recent save point.',
        f04cta: 'Start Over',
      },
    });
  };

  const setMcvTheme = () => {
    setTheme({
      primary500: '#C93C4F',
      secondary500: '#FFA229',
      bg500: '#121212',
      brandImg: mcvBrand,
      bgImg: mcvBg,
      bgOverlayOpacity: '0.5',
      primaryFont: 'Space Mono', // only temporary
      bodyFont: 'Rubik',
      daoMeta: {
        proposals: 'Quests',
        proposal: 'Quest',
        bank: 'Inventory',
        members: 'Players',
        member: 'Player',
        boosts: 'Apps',
        boost: 'App',
        discord: 'https://discord.gg/WqwQGgeeFd',
        medium: '',
        telegram: '',
        website: '',
        other: '',
        f04title: '404 Game Over',
        f04heading: 'You have been slain',
        f04subhead: 'Please reload from the most recent save point.',
        f04cta: 'Start Over',
      },
    });
  };

  const setYearnTheme = () => {
    setTheme({
      primary500: '#007bff',
      secondary500: '#DC6BE5',
      bg500: '#03061B',
      brandImg: yearnBrand,
      bgImg: yearnBg,
      bgOverlayOpacity: '0.5',
      primaryFont: 'Space Mono', // only temporary
      bodyFont: 'Rubik',
      daoMeta: {
        proposals: 'Quests',
        proposal: 'Quest',
        bank: 'Inventory',
        members: 'Waifus',
        member: 'Waifu',
        boosts: 'Apps',
        boost: 'App',
        discord: 'https://discord.gg/WqwQGgeeFd',
        medium: '',
        telegram: '',
        website: '',
        other: '',
        f04title: '404 Game Over',
        f04heading: 'You have been slain',
        f04subhead: 'Please reload from the most recent save point.',
        f04cta: 'Start Over',
      },
    });
  };

  return (
    <Box p={6}>
      <Flex direction='row'>
        <ContentBox
          direction='column'
          w='50%'
          align='center'
          mr={6}
          d='flex'
          flexWrap='wrap'
        >
          <ThemeInputsForm />

          <Flex justify='center' direction='column'>
            <Box fontSize='xl' fontFamily='heading' textAlign='center'>
              Pre-built
            </Box>
            <ButtonGroup>
              <Button
                onClick={setRaidGuildTheme}
                bg='#ff3864'
                border='1px solid #ff3864'
                _hover={{
                  color: '#ff3864',
                  bg: 'black',
                  border: '1px solid #ff3864',
                }}
              >
                RaidGuild
              </Button>
              <Button
                onClick={setMcvTheme}
                bg='black'
                border='1px solid #C93C4F'
                _hover={{ bg: '#C93C4F', border: '1px solid black' }}
              >
                MCV
              </Button>
              <Button
                onClick={setYearnTheme}
                bg='#007bff'
                border='1px solid white'
                _hover={{
                  color: '#007bff',
                  bg: 'white',
                  border: '1px solid #007bff',
                }}
              >
                Yearn
              </Button>
            </ButtonGroup>
          </Flex>
        </ContentBox>
        <ContentBox direction='column' w='50%' align='center'>
          <DaoMetaForm />
        </ContentBox>
      </Flex>
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
              <TextBox>Label</TextBox>
              <TextBox variant='value'>$420.69</TextBox>
            </Box>
            <Box>
              <TextBox>Label</TextBox>
              <TextBox variant='value'>$420.69</TextBox>
            </Box>
            <Box>
              <TextBox>Label</TextBox>
              <TextBox variant='value'>$420.69</TextBox>
            </Box>
          </Flex>
        </ContentBox>
      </Flex>
    </Box>
  );
};

export default ThemeSample;
