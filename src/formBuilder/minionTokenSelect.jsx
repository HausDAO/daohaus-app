import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { utils } from 'ethers';
import { Spinner } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useDao } from '../contexts/DaoContext';
import ModButton from './modButton';
import GenericSelect from './genericSelect';
import GenericInput from './genericInput';
import { createContract } from '../utils/contract';
import { LOCAL_ABI } from '../utils/abi';

const MinionTokenSelect = props => {
  const { daochain } = useParams();
  const { daoVaults } = useDao();
  const { localForm, localValues, name } = props;
  const { watch, setValue, register } = localForm;

  const [loadingInfo, setLoadingInfo] = useState(false);
  const [tokenSymbol, setTokenSymbol] = useState();
  const [customToken, setCustomToken] = useState(false);
  const [validToken, setValidToken] = useState(true);
  const [minionTokens, setMinionTokens] = useState(null);
  const selectedMinion = localValues?.minionAddress || watch('selectedMinion');
  const selectedTokenDecimals = watch('selectedTokenDecimals');
  const selectedTokenBalance = watch('selectedTokenBalance');
  const selectedSafeAddress =
    localValues?.safeAddress || watch('selectedSafeAddress');
  const selectedToken = watch(name);

  const minionTokenDisplay = useMemo(() => {
    if (minionTokens) {
      return minionTokens.map(token => ({
        value: token.contractAddress,
        name: token.symbol,
      }));
    }
    return null;
  }, [minionTokens]);

  const helperText = useMemo(() => {
    if (!selectedMinion) {
      return 'Select a Minion First';
    }
    if (loadingInfo) {
      return <Spinner size='xs' />;
    }
    if (
      selectedToken &&
      validToken &&
      selectedTokenBalance &&
      selectedTokenDecimals
    ) {
      const displayBalance = utils.formatUnits(
        selectedTokenBalance,
        selectedTokenDecimals,
      );

      return (
        <>
          {customToken && tokenSymbol} Balance: {displayBalance}
        </>
      );
    }
    if (selectedToken) {
      return 'Invalid Token';
    }
    if (customToken) {
      return 'Provide a Token Address';
    }
    return 'Select a Token';
  }, [
    loadingInfo,
    selectedToken,
    validToken,
    customToken,
    tokenSymbol,
    selectedTokenBalance,
    selectedTokenDecimals,
    selectedMinion,
  ]);

  useEffect(() => {
    register('selectedTokenDecimals');
    register('selectedTokenBalance');
  }, []);

  useEffect(() => {
    if (daoVaults && selectedMinion) {
      const minionVault = daoVaults.find(
        vault => vault.address === selectedMinion,
      );
      if (minionVault.erc20s?.length) {
        setMinionTokens(minionVault.erc20s);
      } else {
        setMinionTokens(false);
      }
    }
    if (daoVaults && !selectedMinion) setMinionTokens(null);
  }, [daoVaults, selectedMinion]);

  useEffect(() => {
    const getTokenInfo = async tokenAddress => {
      const tokenContract = createContract({
        address: tokenAddress,
        abi: LOCAL_ABI.ERC_20,
        chainID: daochain,
      });
      const decimals = await tokenContract.methods.decimals().call();
      const symbol = await tokenContract.methods.symbol().call();
      const balance = await tokenContract.methods
        .balanceOf(selectedSafeAddress || selectedMinion)
        .call();
      return { symbol, decimals, balance };
    };

    if (selectedToken && daochain) {
      setLoadingInfo(true);
      getTokenInfo(selectedToken)
        .then(({ symbol, decimals, balance }) => {
          setValidToken(true);
          setLoadingInfo(false);
          setTokenSymbol(symbol);
          setValue('selectedTokenBalance', balance);
          setValue('selectedTokenDecimals', decimals);
        })
        .catch(() => {
          setLoadingInfo(false);
          setTokenSymbol(null);
          setValue('selectedTokenBalance', null);
          setValue('selectedTokenDecimals', null);
          setValidToken(false);
        });
    }
  }, [selectedToken, daochain, selectedMinion]);

  const toggleCustomToken = useCallback(() => {
    setValue(name, null);
    setCustomToken(!customToken);
  }, [name, customToken]);

  if (customToken) {
    return (
      <GenericInput
        {...props}
        disabled={!selectedMinion}
        helperText={helperText}
        btn={<ModButton text='autofill' fn={toggleCustomToken} />}
      />
    );
  }

  return (
    <GenericSelect
      {...props}
      options={minionTokenDisplay}
      disabled={!selectedMinion}
      helperText={helperText}
      btn={<ModButton text='custom' fn={toggleCustomToken} />}
    />
  );
};

export default MinionTokenSelect;
