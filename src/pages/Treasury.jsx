import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Flex, useToast } from '@chakra-ui/react';
import { RiAddFill } from 'react-icons/ri';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import BankList from '../components/BankList';
import BankChart from '../components/bankChart';
import MainViewLayout from '../components/mainViewLayout';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { daoConnectedAndSameChain } from '../utils/general';

// TODO: will rework with new data

const Treasury = ({
  overview,
  customTerms,
  currentDaoTokens,
  daoMember,
  delegate,
  daoVaults,
}) => {
  const { daoid, daochain } = useParams();
  const { address, injectedChain } = useInjectedProvider();
  const toast = useToast();
  const [needsSync, setNeedsSync] = useState(false);

  console.log('daoVaults', daoVaults);

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
      {daoConnectedAndSameChain(address, injectedChain?.chainId, daochain) &&
        daoMember && (
          <Button
            as={Link}
            to={`/dao/${daochain}/${daoid}/proposals/new/whitelist`}
            rightIcon={<RiAddFill />}
          >
            Add Asset
          </Button>
        )}
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
      header='DAO Treasury'
      customTerms={customTerms}
      headerEl={ctaButton}
      isDao
    >
      <BankChart
        currentDaoTokens={currentDaoTokens}
        overview={overview}
        customTerms={customTerms}
      />
      <BankList tokens={currentDaoTokens} needsSync={needsSync} />
    </MainViewLayout>
  );
};

export default Treasury;
