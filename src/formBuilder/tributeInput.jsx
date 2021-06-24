import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MaxUint256 } from '@ethersproject/constants';
import { Spinner } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { utils } from 'web3';

import { useDao } from '../contexts/DaoContext';
import { useTX } from '../contexts/TXContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import InputSelect from './inputSelect';
import { ModButton } from './staticElements';

import { TokenService } from '../services/tokenService';
import { validate } from '../utils/validation';
import { TX } from '../data/contractTX';

const TributeInput = props => {
  const { submitTransaction } = useTX();
  const { address } = useInjectedProvider();
  const { daochain, daoid } = useParams();
  const { daoOverview } = useDao();
  const { localForm } = props;
  const { setValue, watch } = localForm;

  const [daoTokens, setDaoTokens] = useState([]);
  // const [unlocked, setUnlocked] = useState(true);
  const [balance, setBalance] = useState(null);
  const [allowance, setAllowance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [needsUnlock, setNeedsUnlock] = useState(false);

  const tributeToken = watch('tributeToken');

  // console.log(tributeToken);
  const tributeOffered = watch('tributeOffered');

  const truncatedBalance = useMemo(() => {
    if (validate.number(balance)) {
      const commified = ethers.utils.commify(
        Number(utils.fromWei(balance)).toFixed(4),
      );
      return commified;
    }
    return 'Error';
  }, [balance]);

  const btnDisplay = () => {
    if (loading) return <Spinner size='sm' />;
    if (needsUnlock) return 'Unlock Token';
    if (!loading && truncatedBalance) return `Max: ${truncatedBalance}`;
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
      const balanceRes = await tokenService('balanceOf')(address);
      if (shouldUpdate) {
        setBalance(balanceRes);
        setAllowance(allowanceRes);
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
    setValue(
      'tributeOffered',
      balance / 10 ** daoTokens.find(t => t.value === tributeToken)?.decimals,
    );
  };

  return (
    <InputSelect
      {...props}
      selectName='tributeToken'
      options={daoTokens}
      helperText={helperText()}
      btn={
        <ModButton
          label={btnDisplay()}
          callback={needsUnlock ? handleUnlock : setMax}
        />
      }
    />
  );
};

export default TributeInput;
