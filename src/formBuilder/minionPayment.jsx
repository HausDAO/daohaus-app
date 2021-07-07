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
  // const { submitTransaction } = useTX();
  // const { address } = useInjectedProvider();
  const { daochain } = useParams();
  const {
    localForm,
    listenTo = 'selectedMinion',
    selectName = 'minionToken',
  } = props;
  const { watch } = localForm;

  const [minionTokens, setMinionTokens] = useState(null);
  // const [minionTokenDisplay, setMinionTokenDisplay] = useState(null);
  // const [unlocked, setUnlocked] = useState(true);
  // const [balance, setBalance] = useState(null);
  // const [decimals, setDecimals] = useState(null);
  // const [allowance, setAllowance] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [needsUnlock, setNeedsUnlock] = useState(false);

  const selectedMinion = watch(listenTo);
  // console.log(minionToken);
  const minionToken = watch(selectName);

  const isDisabled = useMemo(() => {
    return !validate.address(selectedMinion);
  }, [selectedMinion]);

  const minionTokenDisplay = useMemo(() => {
    if (minionTokens) {
      return minionTokens.map(token => ({
        value: token.contractAddress,
        name: token.symbol,
      }));
    }
    return [{ name: 'minion' }];
  }, [minionTokens]);

  const displayableBalance = useMemo(() => {
    if (validate.address(minionToken)) {
      const tokenData = minionTokens.find(
        token => token.contractAddress === minionToken,
      );
      const commified = handleDecimals(
        tokenData.balance,
        tokenData.decimals,
      )?.toFixed(4);
      return commified;
    }
    return null;
  }, [minionToken]);

  const btnDisplay = () => {
    if (loading) return <Spinner size='sm' />;
    if (displayableBalance) return `Max: ${displayableBalance}`;
    return '0';
  };

  useEffect(() => {
    const shouldUpdate = true;
    const getMinionVault = async () => {
      setLoading(true);
      const result = await fetchApiVaultData(
        supportedChains[daochain].network,
        [selectedMinion],
      );
      console.log(result);
      if (shouldUpdate && result) {
        const [minion] = result;
        console.log(`fired`, minion);
        if (minion?.erc20s?.length) {
          setLoading(false);
          setMinionTokens(minion.erc20s);
        }
      }
    };
    if (daochain && selectedMinion) {
      getMinionVault();
    } else {
      setMinionTokens(null);
      setLoading(false);
    }
  }, [daochain, selectedMinion]);

  // useEffect(() => {
  //   let shouldUpdate = true;

  //   const getInitial = async () => {
  //     setLoading(true);
  //     console.log(minionToken);
  //     const tokenService = TokenService({
  //       chainID: daochain,
  //       tokenAddress: minionToken,
  //     });
  //     const allowanceRes = await tokenService('allowance')({
  //       accountAddr: address,
  //       contractAddr: daoid,
  //     });
  //     const decimalRes = await tokenService('decimals')();
  //     const balanceRes = await tokenService('balanceOf')(address);
  //     if (shouldUpdate) {
  //       setBalance(balanceRes);
  //       setAllowance(allowanceRes);
  //       setDecimals(decimalRes);
  //       setLoading(false);
  //     }
  //   };
  //   if (minionToken) {
  //     getInitial();
  //   }
  //   return () => {
  //     shouldUpdate = false;
  //   };
  // }, [minionToken, address, daochain]);

  // useEffect(() => {
  //   if (
  //     !tributeOffered ||
  //     !minionToken ||
  //     tributeOffered === '0' ||
  //     !validate.number(tributeOffered)
  //   ) {
  //     setNeedsUnlock(false);
  //   } else {
  //     setNeedsUnlock(Number(allowance) < Number(tributeOffered));
  //   }
  // }, [tributeOffered, balance, allowance, minionToken]);

  // const handleUnlock = async () => {
  //   setLoading(true);
  //   const unlockAmount = MaxUint256.toString();
  //   const result = await submitTransaction({
  //     args: [daoid, unlockAmount],
  //     tx: TX.UNLOCK_TOKEN,
  //     values: { tokenAddress: minionToken, unlockAmount },
  //   });
  //   setLoading(false);
  //   setNeedsUnlock(!result);
  // };
  // const setMax = () => {
  //   setValue('tributeOffered', balance / 10 ** decimals);
  // };

  return (
    <InputSelect
      {...props}
      selectName='minionToken'
      options={minionTokenDisplay}
      // helperText={helperText()}
      disabled={isDisabled}
      btn={<ModButton label={displayableBalance} />}
    />
  );
};

export default MinionToken;
