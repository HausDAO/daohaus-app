import React, { useEffect, useState } from 'react';

import BankList from '../components/BankList';
import BankChart from '../components/bankChart';
import MainViewLayout from '../components/mainViewLayout';
import { useParams, Link } from 'react-router-dom';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { daoConnectedAndSameChain } from '../utils/general';
import { Button } from '@chakra-ui/react';
import { RiAddFill } from 'react-icons/ri';

const Bank = ({ overview, customTerms, currentDaoTokens, daoMember }) => {
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
    if (currentDaoTokens && daoMember?.exists) {
      setNeedsSync(
        currentDaoTokens.some((token) => {
          return (
            token.contractBalances &&
            token.contractBalances.token !== token.contractBalances.babe
          );
        }),
      );
    }
  }, [currentDaoTokens]);

  return (
    <MainViewLayout
      header='Bank'
      customTerms={customTerms}
      headerEl={ctaButton}
      isDao={true}
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
