import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from '@chakra-ui/react';
import { MaxUint256 } from '@ethersproject/constants';

import { useDao } from '../contexts/DaoContext';
import { useTX } from '../contexts/TXContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import InputSelect from './inputSelect';
import ModButton from './modButton';
import { TokenService } from '../services/tokenService';
import { TX } from '../data/contractTX';
import { handleDecimals } from '../utils/general';
import { validate } from '../utils/validation';
import { getContractBalance } from '../utils/tokenValue';
import { spreadOptions } from '../utils/formBuilder';

const TributeInput = props => {
  const { submitTransaction } = useTX();
  const { address } = useInjectedProvider();
  const { daochain, daoid } = useParams();
  const { daoOverview } = useDao();
  const { localForm, registerOptions } = props;
  const { setValue, watch } = localForm;

  const [daoTokens, setDaoTokens] = useState([]);
  // const [unlocked, setUnlocked] = useState(true);
  const [balance, setBalance] = useState(null);
  const [decimals, setDecimals] = useState(null);
  const [allowance, setAllowance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [needsUnlock, setNeedsUnlock] = useState(false);

  const tributeToken = watch('tributeToken');

  const tributeOffered = watch('tributeOffered');

  const displayBalance = useMemo(() => {
    if (balance && decimals) {
      console.log('in tribute input', balance);
      const commified = handleDecimals(balance, decimals)?.toFixed(4);
      return commified;
    }
    return 'Error';
  }, [balance, decimals]);

  const btnDisplay = () => {
    if (loading) return <Spinner size='sm' />;
    if (needsUnlock) return 'Unlock Token';
    if (!loading && displayBalance) return `Max: ${displayBalance}`;
    return '0';
  };

  const helperText = () =>
    needsUnlock && `Amount entered exceeds token allowance.`;

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
        [depositToken, ...nonDepTokens]
          .filter(token => token.token.symbol)
          .map(token => ({
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

    const getInitial = async () => {
      setLoading(true);
      const tokenService = TokenService({
        chainID: daochain,
        tokenAddress: tributeToken,
      });
      const allowanceRes = await tokenService('allowance')({
        accountAddr: address,
        contractAddr: daoid,
      });
      const decimalRes = await tokenService('decimals')();
      const balanceRes = await tokenService('balanceOf')(address);
      if (shouldUpdate) {
        setBalance(balanceRes);
        setAllowance(allowanceRes);
        setDecimals(decimalRes);
        setLoading(false);
      }
    };
    if (tributeToken) {
      getInitial();
    }
    return () => {
      shouldUpdate = false;
    };
  }, [tributeToken, address, daochain]);

  useEffect(() => {
    if (
      !tributeOffered ||
      !tributeToken ||
      tributeOffered === '0' ||
      !validate.number(tributeOffered)
    ) {
      setNeedsUnlock(false);
    } else {
      setNeedsUnlock(Number(allowance) < Number(tributeOffered));
    }
  }, [tributeOffered, balance, allowance, tributeToken]);

  const handleUnlock = async () => {
    setLoading(true);
    const unlockAmount = MaxUint256.toString();
    const result = await submitTransaction({
      args: [daoid, unlockAmount],
      tx: TX.UNLOCK_TOKEN,
      values: { tokenAddress: tributeToken, unlockAmount },
    });
    setLoading(false);
    setNeedsUnlock(!result);
  };
  const setMax = () => {
    setValue('tributeOffered', balance / 10 ** decimals);
  };

  const options = spreadOptions({
    registerOptions,
    setValueAs: val => getContractBalance(val, decimals),
    validate: {
      exceedsAllowance: val =>
        getContractBalance(val, decimals) > Number(allowance)
          ? `Amount entered exceeds token allowance.`
          : true,
      hasBalance: val =>
        getContractBalance(val, decimals) > Number(balance)
          ? `Amount entered exceeds wallet balance.`
          : true,
    },
  });
  console.log(`options`, options);
  return (
    <InputSelect
      {...props}
      selectName='tributeToken'
      options={daoTokens}
      helperText={helperText()}
      registerOptions={options}
      btn={
        <ModButton
          text={btnDisplay()}
          fn={needsUnlock ? handleUnlock : setMax}
        />
      }
    />
  );
};

export default TributeInput;
