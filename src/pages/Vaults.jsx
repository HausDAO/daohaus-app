import React, { useEffect, useState } from 'react';
import { RiAddFill } from 'react-icons/ri';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  HStack,
  Link as ChakraLink,
} from '@chakra-ui/react';

import useCanInteract from '../hooks/useCanInteract';
import BankChart from '../components/bankChart';
import ListFilter from '../components/listFilter';
import MainViewLayout from '../components/mainViewLayout';
import VaultCard from '../components/vaultCard';
import { vaultFilterOptions } from '../utils/vaults';
import { useMetaData } from '../contexts/MetaDataContext';
import { DAO_BOOKS_HOST } from '../data/boosts';
import DocLink from '../components/docLink';
import { POST_LOCATIONS } from '../utils/poster';

const Vaults = ({ overview, customTerms, currentDaoTokens, daoVaults }) => {
  const { canInteract } = useCanInteract({});
  const { daoid, daochain } = useParams();
  const [filter, setFilter] = useState('all');
  const [listVaults, setListVaults] = useState(null);
  const [chartBalances, setChartBalances] = useState([]);
  const [hasNfts, setHasNfts] = useState(false);
  const { daoMetaData } = useMetaData();

  const isBooksBoostEnabled = daoMetaData?.boosts?.DAO_BOOKS?.active;

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
          return vault.type === filter.value;
        });
        setListVaults(filteredVaults);
        setChartBalances(filteredVaults.flatMap(vault => vault.balanceHistory));
      }
    };
    if (daoVaults) {
      filterVaults();
    }
  }, [daoVaults, filter]);

  const ctaButton = canInteract && (
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
      <Flex justify='space-between' mt='5'>
        <Box>
          <ListFilter
            filter={filter}
            setFilter={setFilter}
            options={vaultFilterOptions}
            labelText='Showing'
          />
        </Box>
        <HStack alignItems='center'>
          <DocLink locationName={POST_LOCATIONS.VAULT_PAGE} />
          {hasNfts && (
            <Box
              texttransform='uppercase'
              fontFamily='heading'
              fontSize={['sm', null, null, 'md']}
            >
              <Link to={`/dao/${daochain}/${daoid}/gallery`}>
                View NFT Gallery
              </Link>
            </Box>
          )}
          {isBooksBoostEnabled && (
            <Button
              as={ChakraLink}
              isExternal
              href={`${DAO_BOOKS_HOST}/dao/${daoid}`}
            >
              View Books
            </Button>
          )}
        </HStack>
      </Flex>

      <Flex wrap='wrap' align='start' justify='flex-start' w='100%'>
        {listVaults &&
          listVaults.map((vault, i) => {
            return (
              <VaultCard
                key={i}
                vault={vault}
                currentDaoTokens={currentDaoTokens}
              />
            );
          })}
      </Flex>
    </MainViewLayout>
  );
};

export default Vaults;
