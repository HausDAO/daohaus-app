import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Button, Flex, useToast } from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import BankChart from '../components/bankChart';
import BalanceList from '../components/balanceList';
import MainViewLayout from '../components/mainViewLayout';
import TextBox from '../components/TextBox';
import VaultNftCard from '../components/vaultNftCard';
import MinionTokenList from '../components/minionTokenList';
import HubBalanceList from '../components/hubBalanceList';
import { fetchMinionInternalBalances } from '../utils/theGraph';
import { vaultConfigByType } from '../data/vaults';

const MinionVault = ({ overview, customTerms, daoVaults, isMember }) => {
  const { daochain, daoid, minion } = useParams();
  const toast = useToast();
  const [vault, setVault] = useState(null);

  const sendToken = () => {
    console.log('sendToken');
  };

  const handleCopy = () => {
    toast({
      title: 'Vault Address Copied',
      position: 'top-right',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const ctaButton = (
    <Flex>
      <CopyToClipboard text={vault?.address} mr={2} onCopy={handleCopy}>
        <Button>Copy Address</Button>
      </CopyToClipboard>
    </Flex>
  );

  useEffect(() => {
    if (daoVaults && minion) {
      const vaultMatch = daoVaults.find(vault => {
        return vault.address === minion;
      });
      setVault({
        ...vaultMatch,
        config: vaultConfigByType[vaultMatch.type],
      });
    }
  }, [daoVaults, minion]);

  useEffect(() => {
    const fetchInternalBalances = async () => {
      const res = await fetchMinionInternalBalances({
        chainID: daochain,
        minionAddress: minion,
      });

      console.log('res', res);
    };

    if (minion) {
      fetchInternalBalances();
    }
  }, [minion]);

  console.log('vault', vault);

  return (
    <MainViewLayout
      header={vault?.config?.typeDisplay || ''}
      customTerms={customTerms}
      headerEl={vault ? ctaButton : null}
      isDao
    >
      {vault && (
        <Flex wrap='wrap'>
          <Box
            w={['100%', null, null, null, '70%']}
            pr={[0, null, null, null, 6]}
            pb={6}
          >
            <BankChart
              overview={overview}
              customTerms={customTerms}
              minionVault={vault}
              balanceData={vault.balanceHistory}
              daoVaults={daoVaults}
              visibleVaults={[vault]}
            />
            {/* <BankList tokens={currentDaoTokens} needsSync={needsSync} /> */}

            {/* <HubBalanceList
              tokens={daoBalances}
              withdraw={withdraw}
              loading={loading}
              currentDaoTokens={currentDaoTokens}
            /> */}

            <BalanceList
              vaultConfig={vault.config}
              // balances={currentDaoTokens}
              // needsSync={needsSync}
            />

            <MinionTokenList
              minion={minion}
              action={sendToken}
              isMember={isMember}
            />
          </Box>
          <Box
            w={['100%', null, null, null, '30%']}
            pr={[0, null, null, null, 6]}
            pb={6}
          >
            {vault.nfts.length > 0 && (
              <>
                <Flex direction='row' justify='space-between'>
                  <TextBox w='100%'>NFTS</TextBox>
                  <TextBox w='100%' fontcolor='secondary'>
                    <Link
                      to={`/dao/${daochain}/${daoid}/gallery/minion/${minion}`}
                    >
                      View Gallery
                    </Link>
                  </TextBox>
                </Flex>
                {vault.nfts.map((nft, i) => (
                  <VaultNftCard nft={nft} key={i} />
                ))}
              </>
            )}
          </Box>
        </Flex>
      )}
    </MainViewLayout>
  );
};

export default MinionVault;
