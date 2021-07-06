import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Button, Flex } from '@chakra-ui/react';
import { RiAddFill } from 'react-icons/ri';

import BankChart from '../components/bankChart';
import MainViewLayout from '../components/mainViewLayout';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { daoConnectedAndSameChain } from '../utils/general';
import VaultCard from '../components/vaultCard';
import ListFilter from '../components/listFilter';
import { vaultFilterOptions } from '../utils/vault';
import { vaultConfigByType } from '../data/vaults';

const Vaults = ({
  overview,
  customTerms,
  currentDaoTokens,
  daoMember,
  daoVaults,
}) => {
  const { daoid, daochain } = useParams();
  const { address, injectedChain } = useInjectedProvider();
  const [filter, setFilter] = useState('all');
  const [listVaults, setListVaults] = useState(null);
  const [hasNfts, setHasNfts] = useState(false);

  useEffect(() => {
    if (daoVaults) {
      setHasNfts(daoVaults.flatMap(vault => vault.nfts).length > 0);
    }
  }, [daoVaults]);

  useEffect(() => {
    const filterVaults = () => {
      if (filter.value === 'all') {
        setListVaults(daoVaults);
      } else {
        const filteredVaults = daoVaults.filter(vault => {
          return filter.valueMatches
            ? filter.valueMatches.includes(vault.type)
            : vault.type === filter.value;
        });
        setListVaults(filteredVaults);
      }
    };
    if (daoVaults) {
      filterVaults();
    }
  }, [daoVaults, filter]);

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

  // TODO: maybe these gather the bank data for the chart and pass on
  // - here we put it all in sessionstorage
  // one odd bit here is the balance history isn't with vault data yet - requires the extra query
  // should that be up in context? - yes
  // - here we mash treasury and erc20s
  // vault page becomes one and mashes based on config

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
        daoVaults={daoVaults}
      />
      <Flex justify='space-between'>
        <Box mt={5}>
          <ListFilter
            filter={filter}
            setFilter={setFilter}
            options={vaultFilterOptions}
            labelText='Showing'
          />
        </Box>
        {hasNfts && (
          <Box
            mt={5}
            texttransform='uppercase'
            fontFamily='heading'
            fontSize={['sm', null, null, 'md']}
          >
            <Link to={`/dao/${daochain}/${daoid}/gallery`}>
              View NFT Gallery
            </Link>
          </Box>
        )}
      </Flex>

      <Flex wrap='wrap' align='start' justify='flex-start' w='100%'>
        {listVaults &&
          listVaults.map((vault, i) => {
            return (
              <VaultCard
                key={i}
                vault={vault}
                currentDaoTokens={currentDaoTokens}
                vaultConfig={vaultConfigByType[vault.type]}
              />
            );
          })}
      </Flex>
    </MainViewLayout>
  );
};

export default Vaults;
