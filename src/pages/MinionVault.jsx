import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Button, Flex, useToast } from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import BankList from '../components/BankList';
import BankChart from '../components/bankChart';
import MainViewLayout from '../components/mainViewLayout';
import TextBox from '../components/TextBox';
import VaultNftCard from '../components/vaultNftCard';
import MinionTokenList from '../components/minionTokenList';
import HubBalanceList from '../components/hubBalanceList';
import { fetchMinionInternalBalances } from '../utils/theGraph';

const MinionVault = ({
  overview,
  customTerms,
  currentDaoTokens,
  daoMember,
  delegate,
  daoVaults,
  isMember,
}) => {
  const { daochain, daoid, minion } = useParams();
  const toast = useToast();
  const [vault, setVault] = useState(null);

  const sendToken = () => {
    console.log('sendToken');
  };

  const handleCopy = () => {
    toast({
      title: 'Treasury Address Copied',
      position: 'top-right',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const ctaButton = (
    <Flex>
      <CopyToClipboard text={daoid} mr={2} onCopy={handleCopy}>
        <Button>Copy Address</Button>
      </CopyToClipboard>
    </Flex>
  );

  useEffect(() => {
    if (daoVaults && minion) {
      setVault(
        daoVaults.find(vault => {
          return vault.address === minion;
        }),
      );
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

  return (
    <MainViewLayout
      header='Minion Vault'
      customTerms={customTerms}
      headerEl={ctaButton}
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
