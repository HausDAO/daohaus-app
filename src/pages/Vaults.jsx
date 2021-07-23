import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Button, Flex } from '@chakra-ui/react';
import { RiAddFill } from 'react-icons/ri';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import MainViewLayout from '../components/mainViewLayout';
import BankChart from '../components/bankChart';
import VaultCard from '../components/vaultCard';
import ListFilter from '../components/listFilter';
import { daoConnectedAndSameChain } from '../utils/general';
import { vaultFilterOptions, vaultConfigByType } from '../data/vaults';

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
  const [chartBalances, setChartBalances] = useState([]);
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
        setChartBalances(daoVaults.flatMap(vault => vault.balanceHistory));
      } else {
        const filteredVaults = daoVaults.filter(vault => {
          return filter.valueMatches
            ? filter.valueMatches.includes(vault.type)
            : vault.type === filter.value;
        });
        setListVaults(filteredVaults);
        setChartBalances(filteredVaults.flatMap(vault => vault.balanceHistory));
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

  return (
    <MainViewLayout
      header='Vaults'
      customTerms={customTerms}
      headerEl={ctaButton}
      isDao
    >
      <BankChart
        overview={overview}
        customTerms={customTerms}
        daoVaults={daoVaults}
        balanceData={chartBalances}
        visibleVaults={listVaults}
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
        {hasNfts && false && (
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
