import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from '@chakra-ui/react';
import { MaxUint256 } from '@ethersproject/constants';

import { useDao } from '../contexts/DaoContext';
import { useTX } from '../contexts/TXContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import InputSelect from './inputSelect';
import ModButton from './modButton';
import { TX } from '../data/txLegos/contractTX';
import { createContract } from '../utils/contract';
import { handleDecimals } from '../utils/general';
import { getContractBalance } from '../utils/tokenValue';
import { LOCAL_ABI } from '../utils/abi';
import { spreadOptions } from '../utils/formBuilder';
import { validate } from '../utils/validation';

const TributeInput = props => {
  const { submitTransaction } = useTX();
  const { address } = useInjectedProvider();
  const { daochain, daoid } = useParams();
  const { daoOverview } = useDao();
  const { localForm, registerOptions } = props;
  const { setValue, watch } = localForm;

  const [daoTokens, setDaoTokens] = useState([]);
  const [balance, setBalance] = useState(null);
  const [decimals, setDecimals] = useState(null);
  const [allowance, setAllowance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [needsUnlock, setNeedsUnlock] = useState(false);

  const tributeToken = watch('tributeToken');

  const tributeOffered = watch('tributeOffered');

  const displayBalance = useMemo(() => {
    if (balance && decimals) {
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

      const tokenContract = createContract({
        address: tributeToken,
        abi: LOCAL_ABI.ERC_20,
        chainID: daochain,
      });

      const allowanceRes = await tokenContract.methods
        .allowance(address, daoid)
        .call();

      const decimalRes = await tokenContract.methods.decimals().call();
      const balanceRes = await tokenContract.methods.balanceOf(address).call();

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
    if (result) {
      setAllowance(unlockAmount);
    }
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
