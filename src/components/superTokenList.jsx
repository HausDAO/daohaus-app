import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Box, Skeleton } from '@chakra-ui/react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useTX } from '../contexts/TXContext';
import { useUser } from '../contexts/UserContext';
import { SUPERFLUID_MINION_TX } from '../data/txLegos/superfluidMinionTx';
import { SUPERFLUID_MINION_FORMS as FORM } from '../data/formLegos/superfluidForms';
import { useAppModal } from '../hooks/useModals';
import ContentBox from './ContentBox';
import TextBox from './TextBox';
import SuperTokenListItem from './SuperTokenListItem';
import { createPoll } from '../services/pollService';
import { SuperfluidMinionService } from '../services/superfluidMinionService';
import { createContract } from '../utils/contract';
import { deriveValFromWei } from '../utils/general';
import { LOCAL_ABI } from '../utils/abi';
import { MINION_TYPES } from '../utils/proposalUtils';

const SuperTokenList = ({
  superTokenBalances,
  loadingStreams,
  handleCopyToast,
  daoMember,
  minionBalances,
  loading,
  setLoading,
  minionType,
}) => {
  const { daochain, daoid, minion } = useParams();
  const { formModal } = useAppModal();
  const { address, injectedProvider } = useInjectedProvider();
  const {
    errorToast,
    successToast,
    setProposalModal,
    setTxInfoModal,
  } = useOverlay();
  const { refreshDao, submitTransaction } = useTX();
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

  const withdrawSupertokenProposal = async superTokenAddress => {
    // TODO: opt-in to downgrade or just withdraw supertoken
    const token = superTokenBalances[superTokenAddress];
    setLoading({
      active: true,
      condition: superTokenAddress,
    });
    try {
      await submitTransaction({
        tx: SUPERFLUID_MINION_TX.MINION_DOWNGRADE_RETURN_TOKEN_SAFE,
        localValues: {
          downgradeValue: token.tokenBalance,
          minionTransfer: token.tokenBalance,
          minionAddress: minion,
        },
        values: {
          superTokenAddress,
          title: `Downgrade ${token.symbol}`,
          tokenAddress: token.underlyingTokenAddress,
        },
      });
    } catch (err) {
      console.log('error: ', err);
    }
    setLoading({
      active: false,
      condition: null,
    });
  };

  const upgradeSupertoken = async (superToken, superTokenAddress) => {
    try {
      const underlyingTokenInternalBalance = minionBalances.find(
        b => b.tokenAddress === superToken.underlyingTokenAddress,
      );

      const tokenContract = createContract({
        address: superToken.underlyingTokenAddress,
        abi: LOCAL_ABI.ERC_20,
        chainID: daochain,
      });
      const tokenBalance = await tokenContract.methods.balanceOf(minion).call();

      if (
        (underlyingTokenInternalBalance &&
          +underlyingTokenInternalBalance.tokenBalance > 0) ||
        deriveValFromWei(tokenBalance) > 0
      ) {
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
          underlyingTokenInternalBalance.tokenBalance,
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
            underlyingTokenInternalBalance
              ? `${underlyingTokenInternalBalance.symbol}`
              : ''
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

  const upgradeSupertokenProposal = async superToken => {
    formModal({
      ...FORM.SUPERFLUID_UPGRADE_TOKEN,
      localValues: {
        defaultPaymentToken: superToken.underlyingTokenAddress,
        minionAddress: minion,
      },
    });
  };

  return (
    <Box>
      <Flex pt={4}>
        <TextBox size='md'>Supertoken Balances</TextBox>
      </Flex>
      <ContentBox mt={6}>
        <Flex>
          <Box w='15%' d={['none', null, null, 'inline-block']}>
            <TextBox size='xs'>Supertoken</TextBox>
          </Box>
          <Box w={['35%', null, null, '35%']}>
            <TextBox size='xs'>Balance</TextBox>
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
                    withdrawSupertoken={
                      minionType === MINION_TYPES.SAFE
                        ? withdrawSupertokenProposal
                        : withdrawSupertoken
                    }
                    upgradeSupertoken={
                      minionType === MINION_TYPES.SAFE
                        ? upgradeSupertokenProposal
                        : upgradeSupertoken
                    }
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
