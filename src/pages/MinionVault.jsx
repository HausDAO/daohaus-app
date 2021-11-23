import React, { useEffect, useMemo, useState } from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  useToast,
  Icon,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { utils as Web3Utils } from 'web3';

import { useToken } from '../contexts/TokenContext';
import BalanceList from '../components/balanceList';
import BankChart from '../components/bankChart';
import CrossDaoInternalBalanceList from '../components/crossDaoInternalBalanceList';
import Loading from '../components/loading';
import MainViewLayout from '../components/mainViewLayout';
import NftCard from '../components/nftCard';
import TextBox from '../components/TextBox';
import SafeMinionDetails from '../components/safeMinionDetails';
import { chainByID } from '../utils/chain';
import { fetchMinionInternalBalances } from '../utils/theGraph';
import { fetchNativeBalance } from '../utils/tokenExplorerApi';
import { formatNativeData } from '../utils/vaults';
import { fetchSafeDetails } from '../utils/requests';
import { MINION_TYPES } from '../utils/proposalUtils';
import { useMetaData } from '../contexts/MetaDataContext';
import { DAO_BOOKS_HOST } from '../data/boosts';

const MinionVault = ({ overview, customTerms, daoVaults }) => {
  const { daoid, daochain, minion } = useParams();
  const { currentDaoTokens } = useToken();
  const toast = useToast();
  const [vault, setVault] = useState(null);
  const [erc20Balances, setErc20Balances] = useState(null);
  const [nativeBalance, setNativeBalance] = useState(null);
  const [internalBalances, setInternalBalances] = useState(null);
  const [safeDetails, setSafeDetails] = useState(null);

  const { daoMetaData } = useMetaData();

  const isBooksBoostEnabled = daoMetaData?.boosts?.DAO_BOOKS?.active;

  const handleCopy = () => {
    toast({
      title: 'Vault Address Copied',
      position: 'top-right',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const ctaButton = useMemo(() => {
    if (vault) {
      return (
        <Flex>
          <CopyToClipboard
            text={vault.safeAddress || vault.address}
            mr={2}
            onCopy={handleCopy}
          >
            <Button>Copy Address</Button>
          </CopyToClipboard>
        </Flex>
      );
    }
    return null;
  }, [vault]);

  useEffect(() => {
    const setupBalanceData = async () => {
      // setup minion erc20 list data: native token, erc20s, internal balances
      const vaultMatch = daoVaults.find(vault => {
        return vault.address === minion;
      });

      if (!vaultMatch) {
        console.log('no vault found');
        return;
      }
      if (vaultMatch.safeAddress) {
        try {
          const safe = await fetchSafeDetails(
            chainByID(daochain).networkAlt || chainByID(daochain).network,
            vaultMatch,
          );
          if (safe) {
            vaultMatch.isMinionModule = safe.modules.includes(
              Web3Utils.toChecksumAddress(vaultMatch.address),
            );
            setSafeDetails(safe);
          }
        } catch (error) {
          console.error(error);
        }
      }
      const erc20sWithTotalUsd = vaultMatch.erc20s.map(token => {
        return {
          ...token,
          totalUSD: token.usd * (+token.balance / 10 ** +token.decimals),
        };
      });

      const nativeBalance = await fetchNativeBalance(
        vaultMatch.safeAddress || minion,
        daochain,
      );
      if (+nativeBalance > 0) {
        setNativeBalance(formatNativeData(daochain, nativeBalance));
      }

      const internalBalanceRes = await fetchMinionInternalBalances({
        chainID: daochain,
        minionAddress: vaultMatch.safeAddress || minion,
      });
      const internalBalanceData = internalBalanceRes
        .flatMap(dao => {
          return dao.tokenBalances.map(b => {
            return { ...b, moloch: dao.moloch, meta: dao.meta };
          });
        })
        .filter(bal => +bal.tokenBalance > 0);

      setVault({
        ...vaultMatch,
      });
      setErc20Balances(erc20sWithTotalUsd);
      setInternalBalances(internalBalanceData);
    };
    if (daoVaults && minion) {
      setupBalanceData();
    }
  }, [daoVaults, minion]);

  return (
    <MainViewLayout
      header={`${vault?.name || ''}`}
      customTerms={customTerms}
      headerEl={vault ? ctaButton : null}
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
            href={`${DAO_BOOKS_HOST}/dao/${daoid}/minion/${minion}`}
          >
            Vault Books
          </Button>
        )}
      </Flex>
      {!vault && <Loading message='Fetching treasury holdings...' />}
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
            {vault?.minionType === MINION_TYPES.SAFE && (
              <SafeMinionDetails
                vault={vault}
                safeDetails={safeDetails}
                handleCopy={handleCopy}
              />
            )}
            <CrossDaoInternalBalanceList
              tokens={internalBalances}
              currentDaoTokens={currentDaoTokens}
            />
            <BalanceList vault={vault} balances={erc20Balances} />
            {nativeBalance && (
              <BalanceList
                vault={vault}
                balances={nativeBalance}
                isNativeToken
              />
            )}
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
                  <NftCard
                    key={i}
                    nft={nft}
                    minion={minion}
                    vault={vault}
                    minionType={vault.minionType}
                  />
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
