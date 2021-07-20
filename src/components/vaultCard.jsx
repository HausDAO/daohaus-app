import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Flex, Text, Badge } from '@chakra-ui/react';

import ContentBox from './ContentBox';
import TextBox from './TextBox';
import VaultCardTokenList from './vaultCardTokenList';
import { numberWithCommas } from '../utils/general';
import { vaultUrlPart } from '../utils/vaults';
import CopyButton from './copyButton';
import { tallyUSDs } from '../utils/tokenValue';

const VaultCard = ({ vault, currentDaoTokens, vaultConfig }) => {
  const { daoid, daochain } = useParams();

  const bgImgUrl = vault.nfts[0]?.imageUrl;

  const currentVaultBalance =
    vault.type === 'treasury'
      ? tallyUSDs(currentDaoTokens)
      : vault.currentBalance;

  return (
    <ContentBox
      w={['100%', '100%', '100%', '340px', '340px']}
      h='220px'
      mt={5}
      mr={10}
      bgImg={bgImgUrl ? `url(${bgImgUrl})` : null}
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
            {vaultConfig.typeDisplay}
          </TextBox>
          {vaultConfig?.badge && (
            <Badge
              ml={2}
              variant=''
              bg={vaultConfig.badge.badgeColor}
              color={vaultConfig.badge.badgeTextColor}
            >
              {vaultConfig.badge.badgeName}
            </Badge>
          )}

          <CopyButton text={vault.address} iconProps={{ color: 'grey' }} />
        </Flex>
        <RouterLink
          to={`/dao/${daochain}/${daoid}/vaults/${vaultUrlPart(vault)}`}
        >
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
      <Box fontSize='3xl' fontWeight={700} fontFamily='mono' my={2}>
        ${numberWithCommas(currentVaultBalance.toFixed(2))}
      </Box>

      <Flex direction='column' align='start'>
        <VaultCardTokenList tokens={vault.erc20s} />

        {vaultConfig.canHoldNft && vault.nfts.length > 0 && (
          <Box fontSize='sm' mr={3} mt={2}>
            {vault.nfts.length} nft{vault.nfts.length > 1 ? 's' : ''}
          </Box>
        )}
      </Flex>
    </ContentBox>
  );
};

export default VaultCard;
