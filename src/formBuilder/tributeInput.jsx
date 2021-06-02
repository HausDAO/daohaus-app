import React, { useEffect, useMemo, useState } from 'react';
import { Spinner } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import { utils } from 'web3';

import { useDao } from '../contexts/DaoContext';
import { useTX } from '../contexts/TXContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import InputSelect from './inputSelect';
import { ModButton } from './staticElements';

import { fetchBalance } from '../utils/tokenValue';
import { TokenService } from '../services/tokenService';

const TributeInput = props => {
  const { unlockToken } = useTX();
  const { address } = useInjectedProvider();
  const { daochain, daoid } = useParams();
  const { daoOverview } = useDao();
  const { localForm } = props;
  const { getValues, setValue } = localForm;

  const [daoTokens, setDaoTokens] = useState([]);
  const [unlocked, setUnlocked] = useState(true);
  const [balance, setBalance] = useState('loading');
  const [loading, setLoading] = useState(false);

  const maxBtnDisplay = useMemo(() => {
    if (balance === 'loading') {
      return (
        <>
          Max: <Spinner size='sm' />
        </>
      );
    }
    if (balance) {
      const commified = ethers.utils.commify(
        Number(utils.fromWei(balance)).toFixed(4),
      );
      return `Max: ${commified}`;
    }
  }, [balance]);

  const unlockBtnDisplay = loading ? <Spinner size='sm' /> : 'Unlock';

  useEffect(() => {
    if (daoOverview) {
      const depTokenAddress = daoOverview.depositToken?.tokenAddress;
      const depositToken = daoOverview.tokenBalances?.find(
        token =>
          token.guildBank && token.token.tokenAddress === depTokenAddress,
      );
      const nonDepTokens = daoOverview.tokenBalances.filter(
        token =>
          token.guildBank && token.token.tokenAddress !== depTokenAddress,
      );
      setDaoTokens(
        [depositToken, ...nonDepTokens].map(token => ({
          value: token.token.tokenAddress,
          name: token.token.symbol || token.token.tokenAddress,
          decimals: token.token.decimals,
          balance: token.tokenBalance,
        })),
      );
    }
  }, [daoOverview]);

  useEffect(() => {
    let shouldUpdate = true;
    const setInitialBalance = async () => {
      const tokenAddress = daoTokens[0]?.value;
      const result = await fetchBalance({
        tokenAddress,
        address,
        chainID: daochain,
      });
      if (shouldUpdate) {
        setBalance(result);
      }
    };
    if (daoTokens?.length) {
      setInitialBalance();
    }
    return () => {
      shouldUpdate = false;
    };
  }, [daoTokens, address, daochain]);

  const updateBalance = async tokenAddress => {
    setBalance('loading');
    const result = await fetchBalance({
      tokenAddress,
      address,
      chainID: daochain,
    });
    setBalance(result);
  };

  const handleUnlock = async () => {
    const tokenAddress = getValues('tributeToken');
    setLoading(true);
    const result = await unlockToken(tokenAddress);
    setLoading(false);
    setUnlocked(result);
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
    const amountApproved = await TokenService({
      chainID: daochain,
      tokenAddress: token,
    })('allowance')({
      accountAddr: address,
      contractAddr: daoid,
    });
    const isUnlocked = +amountApproved > +amount;
    setUnlocked(isUnlocked);
  };

  const handleChange = async () => {
    const tributeToken = getValues('tributeToken');
    const tributeOffered = getValues('tributeOffered');

    checkUnlocked(tributeToken, tributeOffered);
    updateBalance(tributeToken);
  };
  const setMax = () => {
    const tributeToken = getValues('tributeToken');
    setValue(
      'tributeOffered',
      balance / 10 ** daoTokens.find(t => t.value === tributeToken)?.decimals,
    );
    handleChange();
  };

  return (
    <InputSelect
      {...props}
      selectName='tributeToken'
      options={daoTokens}
      selectChange={handleChange}
      helperText={unlocked || 'Unlock to tokens to submit proposal'}
      btn={
        unlocked ? (
          <ModButton label={maxBtnDisplay} callback={setMax} />
        ) : (
          <>
            <ModButton label={unlockBtnDisplay} callback={handleUnlock} />
            <ModButton label={maxBtnDisplay} callback={setMax} />
          </>
        )
      }
    />
  );
};

export default TributeInput;
