import {
  Button,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Select,
  Tooltip,
  Icon,
  Box,
} from '@chakra-ui/react';
import { RiInformationLine } from 'react-icons/ri';
import { utils } from 'web3';
import { ethers } from 'ethers';
import { MaxUint256 } from '@ethersproject/constants';

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TextBox from '../components/TextBox';
import { useDao } from '../contexts/DaoContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useOverlay } from '../contexts/OverlayContext';
import { TokenService } from '../services/tokenService';
import { useTX } from '../contexts/TXContext';
import { createPoll } from '../services/pollService';
import { useUser } from '../contexts/UserContext';

const TributeInput = ({ register, setValue, getValues, setError }) => {
  const [unlocked, setUnlocked] = useState(true);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState([]);
  const { daoOverview } = useDao();
  const { daochain, daoid } = useParams();
  const { injectedProvider, address } = useInjectedProvider();
  const { errorToast, successToast } = useOverlay();
  const { refreshDao } = useTX();
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
      console.log('tokenArray', tokenArray);
      setTokenData(
        tokenArray.map(token => ({
          label: token.token.symbol || token.tokenAddress,
          value: token.token.tokenAddress,
          decimals: token.token.decimals,
          balance: token.tokenBalance,
        })),
      );
    }
    // eslint-disable-next-line;
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
    const token = getValues('tributeToken');
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
              // ? update to token symbol or name
              title: 'Tribute token unlocked',
            });
            refreshDao();
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
    // console.log('check', token, amount);
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
    // eslint-disable-next-line
  }, [tokenData]);

  const handleChange = async () => {
    const tributeToken = getValues('tributeToken');
    const tributeOffered = getValues('tributeOffered');
    await checkUnlocked(tributeToken, tributeOffered);
    await getMax(tributeToken);
    return true;
  };

  const setMax = async () => {
    const tributeToken = getValues('tributeToken');
    setValue(
      'tributeOffered',
      balance / 10 ** tokenData.find(t => t.value === tributeToken).decimals,
    );
    handleChange();
  };

  return (
    <Box>
      <Tooltip
        hasArrow
        shouldWrapChildren
        label='Only tokens approved by the DAO are allowed here. Members can add more approved tokens with Token proposals'
        placement='top'
      >
        <TextBox as={FormLabel} size='xs' d='flex' alignItems='center'>
          Token Tribute
          <Icon as={RiInformationLine} ml={2} />
        </TextBox>
      </Tooltip>
      <InputGroup>
        {!unlocked && (
          <Button
            onClick={() => unlock()}
            isLoading={loading}
            size='xs'
            position='absolute'
            right='0'
            bottom='-32px'
          >
            Unlock
          </Button>
        )}
        <Button
          onClick={() => setMax()}
          size='xs'
          variant='outline'
          position='absolute'
          right='0'
          top='-30px'
        >
          Max:{' '}
          {balance &&
            ethers.utils.commify(parseFloat(utils.fromWei(balance)).toFixed(4))}
        </Button>
        <Input
          name='tributeOffered'
          placeholder='0'
          ref={register({
            validate: {
              insufficientFunds: value => {
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
              value: /[0-9]/,
              message: 'Tribute must be a number',
            },
          })}
          onChange={handleChange}
        />
        <InputRightAddon background='primary.500' p={0}>
          <Select
            name='tributeToken'
            defaultValue='0xd0a1e359811322d97991e03f863a0c30c2cf029c'
            ref={register}
            onChange={handleChange}
            color='white'
            background='primary.500'
          >
            {' '}
            {tokenData.map((token, idx) => (
              <option key={idx} default={!idx} value={token.value}>
                {token.label}
              </option>
            ))}
          </Select>
        </InputRightAddon>
      </InputGroup>
    </Box>
  );
};

export default TributeInput;
