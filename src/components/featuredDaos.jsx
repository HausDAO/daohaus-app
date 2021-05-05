import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar, Badge, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import ContentBox from './ContentBox';
import TextBox from './TextBox';

import MCAvatar from '../assets/img/metacartel__avatar.jpg';
import LexAvatar from '../assets/img/lex__avatar.png';
import MGDAvatar from '../assets/img/mgd__avatar.jpg';
import VenturesAvatar from '../assets/img/ventures__avatar.jpg';
import RaidAvatar from '../assets/img/raidguild__avatar.png';
import MachiXAvatar from '../assets/img/machix__avatar.jpg';

const FeaturedDaos = () => (
  <>
    <Flex justify='space-between'>
      <TextBox mb={6}>Featured DAOs</TextBox>
      <TextBox as={RouterLink} to='/explore' color='secondary.500'>
        Explore
      </TextBox>
    </Flex>
    <SimpleGrid minChildWidth='200px' spacing={3}>
      <ContentBox
        _hover={{ transform: 'scale(1.05)' }}
        direction='column'
        as={RouterLink}
        to='/dao/0x1/0xee629a192374caf2a72cf1695c485c5c89611ef2'
        justify='start'
        align='center'
      >
        <Avatar src={MCAvatar} alt='' />
        <Text>MetaCartel</Text>
        <Text fontSize='xs'>The airport to Web3</Text>
        <Flex mt={2} justify='center'>
          <Badge
            variant='outline'
            colorScheme='secondary'
            textAlign='center'
            marginRight='5px'
          >
            Grants
          </Badge>
          <Badge variant='outline' colorScheme='primary' textAlign='center'>
            Mainnet
          </Badge>
        </Flex>
      </ContentBox>
      <ContentBox
        _hover={{ transform: 'scale(1.05)' }}
        direction='column'
        as={RouterLink}
        to='/dao/0x89/0x93fa3b9d57bcddda4ed2ee40831f5859a9c417b7'
        justify='start'
        align='center'
      >
        <Avatar src={MGDAvatar} alt='' />
        <Text>Meta Gamma Delta</Text>
        <Text fontSize='xs'>Supporting women-led projects in Web3</Text>
        <Flex mt={2} justify='center'>
          <Badge
            variant='outline'
            colorScheme='secondary'
            textAlign='center'
            marginRight='5px'
          >
            Grants
          </Badge>
          <Badge variant='outline' colorScheme='primary' textAlign='center'>
            Polygon
          </Badge>
        </Flex>
      </ContentBox>
      <ContentBox
        _hover={{ transform: 'scale(1.05)' }}
        direction='column'
        as={RouterLink}
        to='/dao/0x64/0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f'
        justify='start'
        align='center'
      >
        <Avatar src={RaidAvatar} alt='' />
        <Text>Raid Guild</Text>
        <Text fontSize='xs'>Collective of Web3 product builders</Text>
        <Flex mt={2} justify='center'>
          <Badge
            variant='outline'
            colorScheme='secondary'
            textAlign='center'
            marginRight='5px'
          >
            Guilds
          </Badge>
          <Badge variant='outline' colorScheme='primary' textAlign='center'>
            xDAI
          </Badge>
        </Flex>
      </ContentBox>
      <ContentBox
        _hover={{ transform: 'scale(1.05)' }}
        direction='column'
        as={RouterLink}
        to='/dao/0x64/0x58234d4bf7a83693dc0815d97189ed7d188f6981'
        justify='start'
        align='center'
      >
        <Avatar src={LexAvatar} alt='' />
        <Text>LexDAO</Text>
        <Text fontSize='xs'>The decentralized legal engineering guild</Text>
        <Flex mt={2} justify='center'>
          <Badge
            variant='outline'
            colorScheme='secondary'
            textAlign='center'
            marginRight='5px'
          >
            Guilds
          </Badge>
          <Badge variant='outline' colorScheme='primary' textAlign='center'>
            xDAI
          </Badge>
        </Flex>
      </ContentBox>
      <ContentBox
        _hover={{ transform: 'scale(1.05)' }}
        direction='column'
        as={RouterLink}
        to='/dao/0x1/0x4570b4faf71e23942b8b9f934b47ccedf7540162'
        justify='start'
        align='center'
      >
        <Avatar src={VenturesAvatar} alt='' />
        <Text>Venture DAO</Text>
        <Text fontSize='xs'>Investing in Web3 projects and teams</Text>
        <Flex mt={2} justify='center'>
          <Badge
            variant='outline'
            colorScheme='secondary'
            textAlign='center'
            marginRight='5px'
          >
            Investments
          </Badge>
          <Badge variant='outline' colorScheme='primary' textAlign='center'>
            Mainnet
          </Badge>
        </Flex>
      </ContentBox>
      <ContentBox
        _hover={{ transform: 'scale(1.05)' }}
        direction='column'
        as={RouterLink}
        to='/dao/0x1/0x016e79e9101a8eaa3e7f46d6d1c267819c09c939'
        justify='start'
        align='center'
      >
        <Avatar src={MachiXAvatar} alt='' />
        <Text>Machi X DAO</Text>
        <Text fontSize='xs'>Community of Crypto Artists</Text>
        <Flex mt={2} justify='center'>
          <Badge
            variant='outline'
            colorScheme='secondary'
            textAlign='center'
            marginRight='5px'
          >
            Guilds
          </Badge>
          <Badge variant='outline' colorScheme='primary' textAlign='center'>
            Mainnet
          </Badge>
        </Flex>
      </ContentBox>
    </SimpleGrid>
  </>
);

export default FeaturedDaos;
