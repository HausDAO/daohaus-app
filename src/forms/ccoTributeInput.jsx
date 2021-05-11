import { Button, Input, InputGroup, InputRightAddon } from '@chakra-ui/react';
import { utils } from 'web3';
import { MaxUint256 } from '@ethersproject/constants';

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDao } from '../contexts/DaoContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { TokenService } from '../services/tokenService';
import { createPoll } from '../services/pollService';
import { useUser } from '../contexts/UserContext';

const CcoTributeInput = ({
  register,
  getValues,
  setError,
  roundData,
  contributionClosed,
}) => {
  const [unlocked, setUnlocked] = useState(true);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState([]);
  const { daoOverview } = useDao();
  const { daochain, daoid } = useParams();
  const { injectedProvider, address } = useInjectedProvider();
  const { errorToast, successToast } = useOverlay();
  const { cachePoll, resolvePoll } = useUser();

  useEffect(() => {
    if (daoOverview && !tokenData.length) {
      const depositTokenAddress = daoOverview.depositToken?.tokenAddress;
      const depositToken = daoOverview.tokenBalances?.find(
        token =>
          token.guildBank && token.token.tokenAddress === depositTokenAddress,
      );
      const tokenArray = daoOverview.tokenBalances.filter(
        token =>
          token.guildBank && token.token.tokenAddress !== depositTokenAddress,
      );
      tokenArray.unshift(depositToken);
      setTokenData(
        tokenArray.map(token => ({
          label: token.token.symbol || token.tokenAddress,
          value: token.token.tokenAddress,
          decimals: token.token.decimals,
          balance: token.tokenBalance,
        })),
      );
    }
  }, [daoOverview]);

  useEffect(() => {
    if (!unlocked) {
      setError('tributeOffered', {
        type: 'allowance',
        message: 'Tribute token must be unlocked to tribute.',
      });
    }
  }, [unlocked]);

  const unlock = async () => {
    setLoading(true);
    const token = roundData.ccoToken.tokenAddress;
    const args = [daoid, MaxUint256];

    try {
      const poll = createPoll({ action: 'unlockToken', cachePoll })({
        daoID: daoid,
        chainID: daochain,
        tokenAddress: token,
        userAddress: address,
        unlockAmount: MaxUint256,
        actions: {
          onError: (error, txHash) => {
            errorToast({
              title: 'There was an error.',
            });
            resolvePoll(txHash);
            console.error(`Could not find a matching proposal: ${error}`);
            setLoading(false);
          },
          onSuccess: txHash => {
            successToast({
              title: 'Tribute token unlocked',
            });
            resolvePoll(txHash);
            setUnlocked(true);
            setLoading(false);
          },
        },
      });
      await TokenService({
        web3: injectedProvider,
        chainID: daochain,
        tokenAddress: token,
      })('approve')({ args, address, poll });
    } catch (err) {
      console.log('error:', err);
      setLoading(false);
    }
  };

  const checkUnlocked = async (token, amount) => {
    if (
      amount === '' ||
      !token ||
      typeof +amount !== 'number' ||
      +amount === 0
    ) {
      setUnlocked(true);
      return;
    }
    const tokenContract = TokenService({
      chainID: daochain,
      tokenAddress: token,
    });

    const amountApproved = await tokenContract('allowance')({
      accountAddr: address,
      contractAddr: daoid,
    });

    const isUnlocked = +amountApproved > +amount;
    setUnlocked(isUnlocked);
  };

  const getMax = async token => {
    const tokenContract = TokenService({
      chainID: daochain,
      tokenAddress: token,
    });
    const max = await tokenContract('balanceOf')(address);
    setBalance(max);
  };

  useEffect(() => {
    if (tokenData.length) {
      const depositToken = tokenData[0];
      getMax(depositToken.value);
    }
  }, [tokenData]);

  const handleChange = async () => {
    const tributeToken = roundData.ccoToken.tokenAddress;
    const tributeOffered = getValues('tributeOffered');
    await checkUnlocked(tributeToken, tributeOffered);
    await getMax(tributeToken);
    return true;
  };

  return (
    <>
      <InputGroup>
        {!unlocked && (
          <Button
            onClick={() => unlock()}
            isLoading={loading}
            size='xs'
            position='absolute'
            right='0'
            bottom='-10px'
          >
            Unlock
          </Button>
        )}
        <Input
          name='tributeOffered'
          placeholder='0'
          mb={5}
          ref={register({
            validate: {
              inefficienFunds: value => {
                if (+value > +utils.fromWei(balance)) {
                  return 'Insufficient Funds';
                }
                return true;
              },
              locked: () => {
                if (!unlocked) {
                  return 'Tribute token must be unlocked to tribute';
                }
                return true;
              },
            },
            pattern: {
              value: /^[0-9]+$/,
              message: 'CCO Contribution must be a whole number',
            },
            max: {
              value: +roundData.maxContribution,
              message: `${roundData.maxContribution} ${roundData.ccoToken.symbol} per person max`,
            },
            min: {
              value: +roundData.minContribution,
              message: `${roundData.minContribution} ${roundData.ccoToken.symbol} per person min`,
            },
            required: {
              value: true,
              message: 'Contribution required',
            },
          })}
          focusBorderColor='secondary.500'
          onChange={handleChange}
          disabled={contributionClosed}
        />

        <InputRightAddon background='primary.500' p={2}>
          {roundData.ccoToken.symbol}
        </InputRightAddon>
      </InputGroup>
    </>
  );
};

export default CcoTributeInput;
