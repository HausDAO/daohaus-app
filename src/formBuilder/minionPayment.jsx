import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MaxUint256 } from '@ethersproject/constants';
import { Spinner } from '@chakra-ui/react';

import { useDao } from '../contexts/DaoContext';
import { useTX } from '../contexts/TXContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import InputSelect from './inputSelect';
import { ModButton } from './staticElements';

import { TokenService } from '../services/tokenService';
import { validate } from '../utils/validation';
import { TX } from '../data/contractTX';
import { handleDecimals } from '../utils/general';
import { fetchApiVaultData } from '../utils/metadata';
import { supportedChains } from '../utils/chain';

const MinionToken = props => {
  const { submitTransaction } = useTX();
  const { address } = useInjectedProvider();
  const { daochain, daoid } = useParams();
  const { localForm, listenTo = 'selectedMinion' } = props;
  const { setValue, watch } = localForm;

  const [minionTokenData, setMinionTokenData] = useState(null);
  const [minionTokenDisplay, setMinionTokenDisplay] = useState(null);
  const [unlocked, setUnlocked] = useState(true);
  const [balance, setBalance] = useState(null);
  const [decimals, setDecimals] = useState(null);
  const [allowance, setAllowance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [needsUnlock, setNeedsUnlock] = useState(false);

  const selectedMinion = watch(listenTo);

  // console.log(minionToken);
  const tributeOffered = watch('tributeOffered');
  const minionToken = watch('minionToken');

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
    const shouldUpdate = true;
    const getMinionVault = async () => {
      setLoading(true);
      const result = await fetchApiVaultData(
        supportedChains[daochain].network,
        [selectedMinion],
      );
      if (shouldUpdate && result) {
        const [minion] = result;
        if (minion?.erc20s?.length) {
          const displayable = minion.erc20s?.map(token => ({
            value: token.contractAddress,
            name: token.symbol,
          }));
          setLoading(false);
          setMinionTokenData(minion.erc20s);
          setMinionTokenDisplay(displayable);
        }
      }
    };
    if (daochain && selectedMinion) {
      getMinionVault();
    }
  }, [daochain, selectedMinion]);

  useEffect(() => {
    let shouldUpdate = true;

    const getInitial = async () => {
      setLoading(true);
      console.log(minionToken);
      const tokenService = TokenService({
        chainID: daochain,
        tokenAddress: minionToken,
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
    if (minionToken) {
      getInitial();
    }
    return () => {
      shouldUpdate = false;
    };
  }, [minionToken, address, daochain]);

  useEffect(() => {
    if (
      !tributeOffered ||
      !minionToken ||
      tributeOffered === '0' ||
      !validate.number(tributeOffered)
    ) {
      setNeedsUnlock(false);
    } else {
      setNeedsUnlock(Number(allowance) < Number(tributeOffered));
    }
  }, [tributeOffered, balance, allowance, minionToken]);

  const handleUnlock = async () => {
    setLoading(true);
    const unlockAmount = MaxUint256.toString();
    const result = await submitTransaction({
      args: [daoid, unlockAmount],
      tx: TX.UNLOCK_TOKEN,
      values: { tokenAddress: minionToken, unlockAmount },
    });
    setLoading(false);
    setNeedsUnlock(!result);
  };
  const setMax = () => {
    setValue('tributeOffered', balance / 10 ** decimals);
  };

  return (
    <InputSelect
      {...props}
      selectName='minionToken'
      options={minionTokenDisplay || []}
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

export default MinionToken;
