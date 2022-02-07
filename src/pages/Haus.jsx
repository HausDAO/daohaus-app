import React from 'react';

import { Link } from 'react-router-dom';
import { Avatar, Box, Divider, Flex, Text } from '@chakra-ui/react';
import ContentBox from '../components/ContentBox';
import Layout from '../components/layout';
import MainViewLayout from '../components/mainViewLayout';
import hausImg from '../assets/img/haus_icon.svg';
import HausCard from '../components/hausCard';

const Haus = () => {
  return (
    <Layout>
      <MainViewLayout header='Haus'>
        <Flex justifyContent='space-between'>
          <Flex direction='column' w='90%'>
            <ContentBox mt={6} maxW='800px'>
              <Flex justifyContent='space-between' css={{ gap: '15px;' }}>
                <Flex direction='column' maxW='325px' gap='19px'>
                  <Text fontSize='2xl' fontWeight='900'>
                    The Haus token aligns all DAOs on the platform.
                  </Text>
                  <Text fontSize='md' fontWeight='700'>
                    As we create more value together, that value flows back to
                    the HAUS token, shared by all communities on the platform
                  </Text>
                  <Link to='www.google.com' fontWeight='700'>
                    <Text fontSize='md' fontWeight='700'>
                      More about HAUS
                    </Text>
                  </Link>
                </Flex>
                <Flex direction='column' alignItems='center'>
                  <Avatar
                    name='Haus logo'
                    src={hausImg}
                    size='lg'
                    css={{
                      height: '161px;',
                      width: '161px;',
                      marginBottom: '26px;',
                    }}
                  />
                  <Link to='www.google.com'>
                    <Text fontSize='md' fontWeight='700'>
                      View on Coingecko
                    </Text>
                  </Link>
                </Flex>
              </Flex>
            </ContentBox>
            <Divider
              orientation='vertical'
              css={{
                border: '1px solid rgba(255, 255, 255, 0.15);',
                height: 'auto;',
                maxWidth: '800px;',
              }}
            />
            <ContentBox maxW='800px'>
              <Text fontSize='2xl' fontWeight='800' mb='43px'>
                Things to do with HAUS
              </Text>
              <Flex justifyContent='space-between'>
                <Flex direction='column'>
                  <Text fontSize='xl' fontWeight='700' mb='13px'>
                    Get Haus
                  </Text>
                  <Link to='www.google.com'>
                    <Text fontSize='sm' fontWeight='700'>
                      ON ETHEREUM &gt;
                    </Text>
                  </Link>
                  <Link to='www.google.com'>
                    <Text fontSize='sm' fontWeight='700'>
                      ON GNOSIS CHAIN &gt;
                    </Text>
                  </Link>
                </Flex>
                <Flex direction='column'>
                  <Text fontSize='xl' fontWeight='700' mb='13px'>
                    Provide Liquidity
                  </Text>
                  <Link to='www.google.com'>
                    <Text fontSize='sm' fontWeight='700'>
                      ON ETHEREUM &gt;
                    </Text>
                    <Text fontSize='sm' fontWeight='700'>
                      ON GNOSIS CHAIN &gt;
                    </Text>
                  </Link>
                </Flex>
                <Flex direction='column'>
                  <Text fontSize='xl' fontWeight='700' mb='13px'>
                    Govrn
                  </Text>
                  <Link to='www.google.com'>
                    <Text fontSize='sm' fontWeight='700'>
                      Join UBERHAUS &gt;
                    </Text>
                  </Link>
                </Flex>
              </Flex>
            </ContentBox>
          </Flex>
          <Box w={['100%', null, null, null, '40%']}>
            <HausCard showChart />
          </Box>
        </Flex>
      </MainViewLayout>
    </Layout>
  );
};

export default Haus;
