import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { RiAddFill } from 'react-icons/ri';

import BankList from '../components/BankList';
import BankChart from '../components/bankChart';
import MainViewLayout from '../components/mainViewLayout';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { daoConnectedAndSameChain } from '../utils/general';

const Bank = ({
  overview,
  customTerms,
  currentDaoTokens,
  daoMember,
  delegate,
}) => {
  const { daoid, daochain } = useParams();
  const { address, injectedChain } = useInjectedProvider();
  const [needsSync, setNeedsSync] = useState(false);

  const ctaButton = daoConnectedAndSameChain(
    address,
    injectedChain?.chainId,
    daochain,
  ) &&
    daoMember && (
      <Button
        as={Link}
        to={`/dao/${daochain}/${daoid}/proposals/new/whitelist`}
        rightIcon={<RiAddFill />}
      >
        Add Asset
      </Button>
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
      header='Bank'
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

export default Bank;
