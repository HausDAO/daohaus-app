import React, { useMemo } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Flex, Text, Badge } from '@chakra-ui/react';

import ContentBox from './ContentBox';
import CopyButton from './copyButton';
import TextBox from './TextBox';
import VaultCardTokenList from './vaultCardTokenList';
import { capitalize, numberWithCommas } from '../utils/general';
import { tallyUSDs } from '../utils/tokenValue';
import { vaultUrlPart, getVaultListData } from '../utils/vaults';

const VaultCard = ({ vault, currentDaoTokens }) => {
  const { daoid, daochain } = useParams();

  const bgImgUrl = vault.nfts[0]?.imageUrl;
  const currentVaultBalance =
    vault.type === 'treasury'
      ? tallyUSDs(currentDaoTokens)
      : vault.currentBalance || 0;

  const vaultBadge = useMemo(() => {
    if (vault.type !== 'treasury') {
      const {
        badgeColor,
        badgeTextColor,
        badgeName,
        badgeVariant,
      } = getVaultListData(vault, daochain, daoid);
      return (
        <Badge
          ml={2}
          variant={badgeVariant}
          bg={badgeColor}
          color={badgeTextColor}
        >
          {badgeName}
        </Badge>
      );
    }
    return null;
  }, [vault]);

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
            {capitalize(vault.type)}
          </TextBox>
          {vaultBadge}
          <CopyButton
            text={vault.safeAddress || vault.address}
            iconProps={{ color: 'grey' }}
          />
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

        {vault.nfts.length > 0 && (
          <Box fontSize='sm' mr={3} mt={2}>
            {vault.nfts.length} nft{vault.nfts.length > 1 ? 's' : ''}
          </Box>
        )}
      </Flex>
    </ContentBox>
  );
};

export default VaultCard;
