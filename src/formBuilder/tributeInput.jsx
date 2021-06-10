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

import { TokenService } from '../services/tokenService';
import { validate } from '../utils/validation';

const TributeInput = props => {
  const { unlockToken } = useTX();
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
    needsUnlock && `Amount enterred exceeds token allowance.`;

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
      console.log('fired');
      setNeedsUnlock(false);
    } else {
      setNeedsUnlock(Number(allowance) < Number(tributeOffered));
    }
  }, [tributeOffered, balance, allowance, tributeToken]);

  const handleUnlock = async () => {
    setLoading(true);
    const result = await unlockToken(tributeToken);
    setLoading(false);
    console.log(unlockToken);
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
