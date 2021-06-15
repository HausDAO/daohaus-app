import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import ContentBox from './ContentBox';
import { numberWithCommas } from '../utils/general';
import TextBox from './TextBox';
import { vaultTypeDisplayName } from '../utils/vault';

const VaultCard = ({ vault }) => {
  const { daoid, daochain } = useParams();
  return (
    <ContentBox w={['100%', '100%', '100%', '340px', '340px']} h='220px' mt={5}>
      <Flex
        direction='row'
        align='center'
        justify='space-between'
        w='100%'
        mb={5}
      >
        <TextBox size='xs' color='whiteAlpha.900'>
          {vaultTypeDisplayName[vault.type]}
        </TextBox>
        <RouterLink to={`/${daochain}/${daoid}/vaults/${vault.address}`}>
          <Text fontSize='sm'>Open</Text>
        </RouterLink>
      </Flex>
      <Box
        fontSize='xl'
        fontWeight={300}
        fontFamily='heading'
        lineHeight='1.125'
      >
        {vault.name}
      </Box>
      <Box fontSize='3xl' fontWeight={700} fontFamily='mono'>
        ${numberWithCommas(vault.currentBalance)}
      </Box>

      <Flex direction='row' align='center'>
        <Box fontSize='sm' mr={3}>
          2 tokens
        </Box>
      </Flex>
    </ContentBox>
  );
};

export default VaultCard;
