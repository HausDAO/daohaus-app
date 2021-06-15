import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Flex } from '@chakra-ui/react';
import { RiAddFill } from 'react-icons/ri';

import BankChart from '../components/bankChart';
import MainViewLayout from '../components/mainViewLayout';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { daoConnectedAndSameChain } from '../utils/general';
import VaultCard from '../components/vaultCard';

const Vaults = ({
  overview,
  customTerms,
  currentDaoTokens,
  daoMember,
  daoVaults,
}) => {
  const { daoid, daochain } = useParams();
  const { address, injectedChain } = useInjectedProvider();

  console.log('daoVaults', daoVaults);

  const ctaButton = daoConnectedAndSameChain(
    address,
    injectedChain?.chainId,
    daochain,
  ) &&
    daoMember && (
      <Button
        as={Link}
        to={`/dao/${daochain}/${daoid}/settings/boosts`}
        rightIcon={<RiAddFill />}
      >
        Add Vault
      </Button>
    );

  return (
    <MainViewLayout
      header='Vaults'
      customTerms={customTerms}
      headerEl={ctaButton}
      isDao
    >
      <BankChart
        currentDaoTokens={currentDaoTokens}
        overview={overview}
        customTerms={customTerms}
      />
      <Flex wrap='wrap' align='start' justify='space-between' w='100%'>
        {daoVaults.map((vault, i) => {
          return <VaultCard key={i} vault={vault} />;
        })}
      </Flex>
    </MainViewLayout>
  );
};

export default Vaults;
