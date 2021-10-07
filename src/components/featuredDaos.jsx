import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Flex,
  SimpleGrid,
  Text,
  HStack,
} from '@chakra-ui/react';

import ContentBox from './ContentBox';
import TextBox from './TextBox';

import MCAvatar from '../assets/img/metacartel__avatar.jpg';
import LexAvatar from '../assets/img/lex__avatar.png';
import MGDAvatar from '../assets/img/mgd__avatar.jpg';
import VenturesAvatar from '../assets/img/ventures__avatar.jpg';
import RaidAvatar from '../assets/img/raidguild__avatar.png';
import FoundationsAvatar from '../assets/img/foundations__avatar.jpeg';
// import MachiXAvatar from '../assets/img/machix__avatar.jpg';

const featuredDaoList = [
  {
    address: '0xb152b115c94275b54a3f0b08c1aa1d21f32a659a',
    network: '0x64',
    image: MCAvatar,
    name: 'MetaCartel',
    description: 'The airport to Web3',
    badges: ['Grants', 'xDai'],
  },
  {
    address: '0x93fa3b9d57bcddda4ed2ee40831f5859a9c417b7',
    network: '0x89',
    image: MGDAvatar,
    name: 'Meta Gamma Delta',
    description: 'Supporting women-led projects in Web3',
    badges: ['Grants', 'Polygon'],
  },
  {
    address: '0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f',
    network: '0x64',
    image: RaidAvatar,
    name: 'RaidGuild',
    description: 'Collective of Web3 product builders',
    badges: ['Guilds', 'xDai'],
  },
  {
    address: '0x58234d4bf7a83693dc0815d97189ed7d188f6981',
    network: '0x64',
    image: LexAvatar,
    name: 'LexDAO',
    description: 'The decentralized legal engineering guild',
    badges: ['Grants', 'xDai'],
  },
  {
    address: '0x1b975a9daf25e7b01e0a6c72d657ff74925327a8',
    network: '0x64',
    image: FoundationsAvatar,
    name: 'Foundations DAO',
    description: 'Feedback farming worldwide',
    badges: ['Clubs', 'xDai'],
  },
  {
    address: '0x4570b4faf71e23942b8b9f934b47ccedf7540162',
    network: '0x1',
    image: VenturesAvatar,
    name: 'Venture DAO',
    description: 'Investing in Web3 projects and teams',
    badges: ['Investments', 'Mainnet'],
  },
  // {
  //   address: '0xab94cb340b92c15865ed385acd0e1eabedb3c5ae',
  //   network: '0x64',
  //   image: MachiXAvatar,
  //   name: 'Machi X DAO',
  //   description: 'The airport to Web3',
  //   badges: ['Guilds', 'xDai'],
  // },
];

const FeaturedDaos = () => (
  <>
    <Flex justify='space-between'>
      <TextBox mb={6}>Featured DAOs</TextBox>
      <TextBox as={RouterLink} to='/explore' color='secondary.500'>
        Explore
      </TextBox>
    </Flex>
    <SimpleGrid minChildWidth='200px' spacing={3}>
      {featuredDaoList.map(dao => (
        <ContentBox
          _hover={{ transform: 'scale(1.05)' }}
          direction='column'
          as={RouterLink}
          to={`/dao/${dao.network}/${dao.address}`}
          justify='start'
          align='center'
          key={dao.name}
        >
          <Avatar src={dao.image} alt='' />
          <Text>{dao.name}</Text>
          <Text fontSize='xs'>{dao.description}</Text>
          <HStack mt={2} justify='center'>
            <Badge variant='outline' colorScheme='secondary' textAlign='center'>
              {dao.badges[0]}
            </Badge>
            <Badge variant='outline' colorScheme='primary' textAlign='center'>
              {dao.badges[1]}
            </Badge>
          </HStack>
        </ContentBox>
      ))}
    </SimpleGrid>
  </>
);

export default FeaturedDaos;
