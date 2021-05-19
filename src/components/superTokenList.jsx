import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Box, Skeleton } from '@chakra-ui/react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useTX } from '../contexts/TXContext';
import { useUser } from '../contexts/UserContext';
import ContentBox from './ContentBox';
import TextBox from './TextBox';
import SuperTokenListItem from './SuperTokenListItem';

import { createPoll } from '../services/pollService';
import { SuperfluidMinionService } from '../services/superfluidMinionService';

const SuperTokenList = ({
  superTokenBalances,
  loadingStreams,
  handleCopyToast,
  daoMember,
  minionBalances,
  loading,
  setLoading,
}) => {
  const { daochain, daoid, minion } = useParams();

  const { address, injectedProvider } = useInjectedProvider();
  const {
    errorToast,
    successToast,
    setProposalModal,
    setTxInfoModal,
  } = useOverlay();
  const { refreshDao } = useTX();
  const { cachePoll, resolvePoll } = useUser();

  const balanceArr = useMemo(() => {
    if (superTokenBalances) {
      return Object.keys(superTokenBalances);
    }
    return [];
  }, [superTokenBalances]);

  const withdrawSupertoken = async (tokenAddress, downgrade) => {
    setLoading({
      active: true,
      condition: tokenAddress,
    });
    try {
      const poll = createPoll({
        action: 'superfluidWithdrawBalance',
        cachePoll,
      })({
        minionAddress: minion,
        tokenAddress,
        expectedBalance: 0,
        chainID: daochain,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: 'There was an error.',
            });
            resolvePoll(txHash);
            console.error(`Could not withdraw the balance: ${error}`);
          },
          onSuccess: txHash => {
            successToast({
              title: 'Outstanding balance has been withdrawn.',
            });
            refreshDao();
            resolvePoll(txHash);
          },
        },
      });
      const onTxHash = () => {
        setProposalModal(false);
        setTxInfoModal(true);
      };
      const args = [tokenAddress, downgrade];
      await SuperfluidMinionService({
        web3: injectedProvider,
        minion,
        chainID: daochain,
      })('withdrawRemainingFunds')({
        args,
        address,
        poll,
        onTxHash,
      });
      setLoading({
        active: false,
        condition: null,
      });
    } catch (err) {
      setLoading({
        active: false,
        condition: null,
      });
      console.log('error: ', err);
    }
  };

  const upgradeSupertoken = async (superToken, superTokenAddress) => {
    try {
      const underlyingTokenBalance = minionBalances.find(
        b => b.tokenAddress === superToken.underlyingTokenAddress,
      );
      if (underlyingTokenBalance && +underlyingTokenBalance.tokenBalance > 0) {
        setLoading({
          active: true,
          condition: superTokenAddress,
        });
        const poll = createPoll({
          action: 'withdrawBalance',
          cachePoll,
        })({
          memberAddress: minion,
          tokenAddress: superToken.underlyingTokenAddress,
          expectedBalance: 0,
          chainID: daochain,
          daoID: daoid,
          actions: {
            onError: (error, txHash) => {
              errorToast({
                title: 'There was an error.',
              });
              resolvePoll(txHash);
              console.error(`Could not upgrade the token balance: ${error}`);
            },
            onSuccess: txHash => {
              successToast({
                title: 'Token balance has been upgraded.',
              });
              refreshDao();
              resolvePoll(txHash);
            },
          },
        });
        const onTxHash = () => {
          setProposalModal(false);
          setTxInfoModal(true);
        };
        const args = [
          superToken.underlyingTokenAddress,
          underlyingTokenBalance.tokenBalance,
        ];
        await SuperfluidMinionService({
          web3: injectedProvider,
          minion,
          chainID: daochain,
        })('upgradeToken')({
          args,
          address,
          poll,
          onTxHash,
        });
        setLoading({
          active: false,
          condition: null,
        });
      } else {
        errorToast({
          title: `No ${
            underlyingTokenBalance ? `${underlyingTokenBalance.symbol}` : ''
          } token balance available in the Minion`,
        });
      }
    } catch (err) {
      setLoading({
        active: false,
        condition: null,
      });
      console.log('error: ', err);
    }
  };

  return (
    <Box>
      <Flex pt={4}>
        <TextBox size='md'>Supertoken Balances</TextBox>
      </Flex>
      <ContentBox mt={6}>
        <Flex>
          <Box w='15%' d={['none', null, null, 'inline-block']}>
            <TextBox size='xs'>Asset</TextBox>
          </Box>
          <Box w={['35%', null, null, '35%']}>
            <TextBox size='xs'>Internal Bal.</TextBox>
          </Box>
          <Box w='40%' d={['none', null, null, 'inline-block']}>
            <TextBox size='xs'>Actions</TextBox>
          </Box>
        </Flex>

        <Skeleton isLoaded={!loadingStreams}>
          {superTokenBalances &&
            balanceArr?.length > 0 &&
            balanceArr.map(tokenAddress => {
              const token = superTokenBalances[tokenAddress];
              if (token) {
                return (
                  <SuperTokenListItem
                    token={token}
                    loading={loading}
                    handleCopyToast={handleCopyToast}
                    tokenAddress={tokenAddress}
                    daoMember={daoMember}
                    withdrawSupertoken={withdrawSupertoken}
                    upgradeSupertoken={upgradeSupertoken}
                    key={tokenAddress}
                  />
                );
              }
              return null;
            })}
        </Skeleton>
      </ContentBox>
    </Box>
  );
};
export default SuperTokenList;
