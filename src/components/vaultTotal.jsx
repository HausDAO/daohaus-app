import React from 'react';
import { Skeleton, Text, Box } from '@chakra-ui/react';

import { tallyUSDs } from '../utils/tokenValue';
import { numberWithCommas } from '../utils/general';
import { vaultTokenCount } from '../utils/vaults';

const VaultTotal = ({ vaults }) => {
  const treasury = vaults.find(v => v.type === 'treasury');
  const treasuryTotal = treasury ? tallyUSDs(treasury.erc20s) : 0;
  const minionTotal = vaults
    .filter(v => v.type !== 'treasury')
    .reduce((sum, vault) => (sum += vault.currentBalance), 0);
  const bankTotal = treasuryTotal + minionTotal;
  const uniqueTokenCount = vaultTokenCount(vaults);

  return (
    <>
      <Skeleton isLoaded={vaults?.length > 0}>
        <Text fontFamily='mono' fontSize='3xl' variant='value'>
          ${bankTotal !== 'loading' && numberWithCommas(bankTotal.toFixed(2))}
        </Text>
      </Skeleton>
      <Box>
        <Skeleton isLoaded={vaults?.length > 0}>
          <Box fontSize='sm' as='i' fontWeight={200}>
            {uniqueTokenCount} Token
            {uniqueTokenCount > 1 && 's'}
          </Box>
        </Skeleton>
      </Box>
    </>
  );
};

export default VaultTotal;
