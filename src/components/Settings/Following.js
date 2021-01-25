import React from 'react';
import { Box, Flex, Image, Icon } from '@chakra-ui/react';
import { RiLoginBoxLine } from 'react-icons/ri';
import { Link as RouterLink } from 'react-router-dom';
import ContentBox from '../../components/Shared/ContentBox';
import TextBox from '../../components/Shared/TextBox';
import MetaChill from '../../assets/meta_chill.png';
import FedPapers from '../../assets/themes/fedpapersTheme/fedpapers-brand.png';

const followingDaos = [
  {
    img: MetaChill,
    name: 'MetaCartel',
    tags: ['grants'],
    link: '/dao/0xee629a192374caf2a72cf1695c485c5c89611ef2',
  },
  {
    img: FedPapers,
    name: 'Federalist Papers',
    tags: ['club'],
    link: '/dao/0xb4abc512610411682108513fd17c90e46c39d82e',
  },
];

const Following = () => {
  return (
    <>
      <TextBox size='xs' mb={2}>
        Friends
      </TextBox>
      <ContentBox w='40%'>
        {followingDaos.map((dao, i) => (
          <Flex key={dao.name} align='center' justify='space-between' py={4}>
            <Flex align='center'>
              <Image src={dao.img} alt={dao.name} w='50px' h='50px' mr={4} />
              <Box>
                <Box fontSize='lg' fontFamily='heading' fontWeight={700} pb={2}>
                  {dao.name}
                </Box>
                <Flex>
                  {dao.tags.map((tag) => (
                    <Box
                      key={dao + '-' + tag}
                      bg='secondary.500'
                      borderRadius={10}
                      p='0 8px'
                    >
                      {tag}
                    </Box>
                  ))}
                </Flex>
              </Box>
            </Flex>
            <RouterLink to={dao.link}>
              <Icon
                as={RiLoginBoxLine}
                color='secondary.500'
                h='25px'
                w='25px'
              />
            </RouterLink>
          </Flex>
          // {i < followingDaos.length - 1 && <Box as='hr' w='80%' m='0 auto' />}
        ))}
      </ContentBox>
    </>
  );
};

export default Following;
