import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Flex, Text } from '@chakra-ui/react';

import ContentBox from './ContentBox';
import TextBox from './TextBox';
import VaultCardTokenList from './vaultCardTokenList';
import { numberWithCommas } from '../utils/general';
import { vaultTypeDisplayName, vaultUrlPart } from '../utils/vault';
import CopyButton from './copyButton';

const VaultCard = ({ vault }) => {
  const { daoid, daochain } = useParams();

  // TODO: obscured by the bg color on contentbox
  // maybe adjust this with a helper and grab the newest nft the vault has
  const bgImgUrl = vault.nfts[0]?.imageUrl;

  return (
    <ContentBox
      w={['100%', '100%', '100%', '340px', '340px']}
      h='220px'
      mt={5}
      bgImage={bgImgUrl ? `url(${bgImgUrl})` : null}
    >
      <Flex
        direction='row'
        align='center'
        justify='space-between'
        w='100%'
        mb={5}
      >
        <Flex direction='row'>
          <TextBox size='xs' color='whiteAlpha.900'>
            {vaultTypeDisplayName[vault.type]}
          </TextBox>
          <CopyButton text={vault.address} iconProps={{ color: 'grey' }} />
        </Flex>
        <RouterLink to={`/${daochain}/${daoid}/vaults/${vaultUrlPart(vault)}`}>
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

      <Flex direction='column' align='start'>
        <VaultCardTokenList tokens={vault.tokens} />

        {vault.type !== 'treasury' && vault.nfts.length > 0 && (
          <Box fontSize='sm' mr={3}>
            {vault.nfts.length} nfts
          </Box>
        )}
      </Flex>
    </ContentBox>
  );
};

export default VaultCard;
