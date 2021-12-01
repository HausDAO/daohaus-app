import React, { useEffect, useState } from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useParams, Link } from 'react-router-dom';
import {
  Button,
  Flex,
  Icon,
  useToast,
  Link as ChakraLink,
} from '@chakra-ui/react';

import BalanceList from '../components/balanceList';
import BankChart from '../components/bankChart';
import MainViewLayout from '../components/mainViewLayout';
import { useMetaData } from '../contexts/MetaDataContext';
import { DAO_BOOKS_HOST } from '../data/boosts';

const Treasury = ({
  overview,
  customTerms,
  currentDaoTokens,
  daoMember,
  delegate,
  daoVaults,
}) => {
  const { daoid, daochain } = useParams();
  const toast = useToast();
  const [needsSync, setNeedsSync] = useState(false);

  const treasuryVaultData = daoVaults?.find(vault => vault.type === 'treasury');
  const { daoMetaData } = useMetaData();

  const isBooksBoostEnabled = daoMetaData?.boosts?.DAO_BOOKS?.active;

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
      header='Treasury'
      customTerms={customTerms}
      headerEl={ctaButton}
      isDao
    >
      <Flex justify='space-between' py='2'>
        <Flex
          as={Link}
          to={`/dao/${daochain}/${daoid}/vaults`}
          align='center'
          mb={3}
        >
          <Icon as={BiArrowBack} color='secondary.500' mr={2} />
          All Vaults
        </Flex>
        {isBooksBoostEnabled && (
          <Button
            variant='outline'
            as={ChakraLink}
            isExternal
            href={`${DAO_BOOKS_HOST}/dao/${daoid}/treasury`}
          >
            Vault Books
          </Button>
        )}
      </Flex>
      <BankChart
        overview={overview}
        customTerms={customTerms}
        daoVaults={daoVaults}
        balanceData={treasuryVaultData?.balanceHistory}
        visibleVaults={[treasuryVaultData]}
      />
      <BalanceList
        vault={treasuryVaultData}
        balances={currentDaoTokens}
        needsSync={needsSync}
        isTreasury
      />
    </MainViewLayout>
  );
};

export default Treasury;
