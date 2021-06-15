import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Flex, useToast } from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import BankList from '../components/BankList';
import BankChart from '../components/bankChart';
import MainViewLayout from '../components/mainViewLayout';
import TextBox from '../components/TextBox';
import VaultNftCard from '../components/vaultNftCard';

// TODO: will rework with new data
// nft list can be latest 3

const MinionVault = ({
  overview,
  customTerms,
  currentDaoTokens,
  daoMember,
  delegate,
  daoVaults,
}) => {
  const { daoid, minion } = useParams();
  const toast = useToast();
  const [needsSync, setNeedsSync] = useState(false);
  const [vault, setVault] = useState(null);

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
    setVault(
      daoVaults.find(vault => {
        return vault.address === minion;
      }),
    );
  }, [daoVaults, minion]);

  useEffect(() => {
    const canSync = daoMember?.exists || delegate;
    if (currentDaoTokens && canSync) {
      setNeedsSync(
        currentDaoTokens.some(token => {
          return (
            token.contractBalances &&
            token.contractBalances.token !== token.contractBalances.babe
          );
        }),
      );
    }
  }, [currentDaoTokens, daoMember, delegate]);

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
              currentDaoTokens={currentDaoTokens}
              overview={overview}
              customTerms={customTerms}
            />
            <BankList tokens={currentDaoTokens} needsSync={needsSync} />
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
                  <TextBox w='100%' fontColor='secondary'>
                    View Gallery
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
